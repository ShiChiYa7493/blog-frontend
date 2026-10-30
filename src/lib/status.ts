/**
 * Server-side health probes for /status.
 *
 * These run inside the Next.js server process and only ever call loopback
 * addresses on the same host — the browser never sees the internal ports.
 * Every probe is independently timed out so one stuck service cannot stall
 * the page.
 */

const TIMEOUT_MS = Number(process.env.STATUS_PROBE_TIMEOUT_MS ?? 1500)

export type ServiceState = "up" | "degraded" | "down" | "unknown"

export type ServiceStatus = {
	id: string
	name: string
	description: string
	state: ServiceState
	latencyMs?: number
	detail?: string
	/** Set when the probe itself cannot say anything meaningful. */
	note?: string
	home?: string
}

type ProbeResult = {
	status: number
	ok: boolean
	latencyMs: number
	body: unknown
}

function endpoint(envName: string, fallback: string) {
	const value = process.env[envName]
	return (value && value.trim()) || fallback
}

async function probe(url: string): Promise<ProbeResult | null> {
	const controller = new AbortController()
	const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
	const started = Date.now()
	try {
		const res = await fetch(url, {
			cache: "no-store",
			redirect: "error",
			signal: controller.signal,
			headers: { accept: "application/json" },
		})
		const text = await res.text()
		let body: unknown = null
		try {
			body = text ? JSON.parse(text) : null
		} catch {
			body = text.slice(0, 200)
		}
		return { status: res.status, ok: res.ok, latencyMs: Date.now() - started, body }
	} catch {
		return null
	} finally {
		clearTimeout(timer)
	}
}

function asRecord(value: unknown): Record<string, unknown> | null {
	return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null
}

/** "direct-rules-2026-10-26-v7" → "v7" so the card stays readable. */
function shortRulesVersion(version: string | null): string | null {
	if (!version) return null
	const match = /-v(\d+)$/.exec(version)
	return match ? `v${match[1]}` : version
}

const CATALOG_STATE_LABEL: Record<string, string> = {
	current: "实时数据",
	"offline-cache": "离线缓存",
	"bundled-fallback": "内置快照",
}

function formatRunTime(value: string | null): string | null {
	if (!value) return null
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return value
	return new Intl.DateTimeFormat("zh-CN", {
		timeZone: "Asia/Shanghai",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(date)
}

function pickString(source: Record<string, unknown> | null, ...keys: string[]): string | null {
	if (!source) return null
	for (const key of keys) {
		const value = source[key]
		if (typeof value === "string" && value.trim()) return value
	}
	return null
}

/** Blog API (NestJS). A plain 200 on a read-only endpoint is enough. */
async function checkBlogApi(): Promise<ServiceStatus> {
	const base = endpoint("STATUS_BLOG_API_URL", "http://127.0.0.1:3001")
	const result = await probe(`${base}/api/tags`)
	const baseStatus: ServiceStatus = {
		id: "blog-api",
		name: "博客接口",
		description: "文章、分类、标签与 RSS 的后端",
		state: "down",
	}
	if (!result) return baseStatus
	return { ...baseStatus, state: result.ok ? "up" : "degraded", latencyMs: result.latencyMs, detail: `HTTP ${result.status}` }
}

/** Arsenal catalog API. Reports its own data/rules versions. */
async function checkArsenalApi(): Promise<ServiceStatus> {
	const base = endpoint("STATUS_ARSENAL_API_URL", "http://127.0.0.1:17896")
	const result = await probe(`${base}/api/version`)
	const entry: ServiceStatus = {
		id: "arsenal",
		name: "ARSENAL 目录接口",
		description: "配卡页使用的武器 / MOD 目录与规则版本",
		state: "down",
		home: "/warframe/arsenal/",
	}
	if (!result) return entry
	if (!result.ok) return { ...entry, state: "degraded", latencyMs: result.latencyMs, detail: `HTTP ${result.status}` }

	const body = asRecord(result.body)
	const catalogState = pickString(body, "status")
	const rulesVersion = pickString(body, "rulesVersion")
	const dataVersion = pickString(body, "dataVersion")
	const parts = [
		catalogState ? `目录 ${CATALOG_STATE_LABEL[catalogState] ?? catalogState}` : null,
		rulesVersion ? `规则 ${shortRulesVersion(rulesVersion)}` : null,
		dataVersion ? `数据 ${dataVersion}` : null,
	].filter(Boolean)
	// "bundled-fallback" / "offline-cache" means the service is up but serving stale data.
	const degraded = catalogState === "bundled-fallback" || catalogState === "offline-cache"
	return {
		...entry,
		state: degraded ? "degraded" : "up",
		latencyMs: result.latencyMs,
		detail: parts.join(" · ") || `HTTP ${result.status}`,
	}
}

/** Internal data service. Exposes the active release and the last update run. */
async function checkDataService(): Promise<ServiceStatus> {
	const base = endpoint("STATUS_DATA_API_URL", "http://127.0.0.1:17895")
	const result = await probe(`${base}/v1/status`)
	const entry: ServiceStatus = {
		id: "data",
		name: "游戏数据服务",
		description: "版本化游戏数据与实时接口的数据源",
		state: "down",
	}
	if (!result) return entry
	if (!result.ok) return { ...entry, state: "degraded", latencyMs: result.latencyMs, detail: `HTTP ${result.status}` }

	const body = asRecord(result.body)
	const release = pickString(body, "release")
	const lastRun = asRecord(body ? body.lastRun : null)
	const finishedAt = pickString(lastRun, "finishedAt", "at", "startedAt")
	const parts = [
		release ? `数据版本 ${release.slice(0, 13)}` : null,
		finishedAt ? `最近检查 ${formatRunTime(finishedAt)}` : null,
	].filter(Boolean)
	return { ...entry, state: "up", latencyMs: result.latencyMs, detail: parts.join(" · ") || `HTTP ${result.status}` }
}

/**
 * Miya admin console. It sits behind a session check, so 401/403 still proves
 * the service is alive — only transport errors and 5xx count as down.
 */
async function checkBotAdmin(): Promise<ServiceStatus> {
	const base = endpoint("STATUS_BOT_ADMIN_URL", "http://127.0.0.1:5140")
	const result = await probe(`${base}/warframe/bot/api/state`)
	const entry: ServiceStatus = {
		id: "miya",
		name: "咪娅机器人",
		description: "QQ 机器人与网页后台",
		state: "down",
	}
	if (!result) return entry
	const alive = result.status === 200 || result.status === 302 || result.status === 401 || result.status === 403
	return {
		...entry,
		state: alive ? "up" : "degraded",
		latencyMs: result.latencyMs,
		detail: result.status === 200 ? "运行中" : `运行中（HTTP ${result.status}）`,
	}
}

export type OverallState = "operational" | "degraded" | "unknown"

export type StatusSnapshot = {
	checkedAt: string
	overall: OverallState
	services: ServiceStatus[]
}

export async function collectStatus(): Promise<StatusSnapshot> {
	const [blogApi, arsenal, data, bot] = await Promise.all([
		checkBlogApi(),
		checkArsenalApi(),
		checkDataService(),
		checkBotAdmin(),
	])

	// The page itself rendering is the proof that the web tier is up.
	const web: ServiceStatus = {
		id: "web",
		name: "本站（页面）",
		description: "Next.js 服务端渲染",
		state: "up",
		detail: "本页正常返回",
	}
	const services = [web, blogApi, arsenal, data, bot]
	const upCount = services.filter((s) => s.state === "up").length
	const overall: OverallState =
		upCount === services.length ? "operational" : upCount > 0 ? "degraded" : "unknown"

	return { checkedAt: new Date().toISOString(), overall, services }
}

export function formatCheckedAt(iso: string): string {
	const date = new Date(iso)
	return new Intl.DateTimeFormat("zh-CN", {
		timeZone: "Asia/Shanghai",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	}).format(date)
}

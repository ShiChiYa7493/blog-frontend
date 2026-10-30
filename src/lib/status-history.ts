import { promises as fs } from "node:fs"
import path from "node:path"
import type { ServiceState } from "@/lib/status"

/** Service ids recorded per sample, in the same order the probe layer produces them. */
export const HISTORY_SERVICE_IDS = ["web", "blog-api", "arsenal", "data", "miya"] as const
export type HistoryServiceId = (typeof HISTORY_SERVICE_IDS)[number]

type Sample = { t: number; s: Partial<Record<HistoryServiceId, string>> }

export type DayCell = { date: string; state: ServiceState | "none" }
export type ServiceUptime = {
	id: HistoryServiceId
	availability: number | null
	samples: number
	days: DayCell[]
}

const DAY_MS = 86_400_000
const MAX_FILE_BYTES = 4 * 1024 * 1024
const RETENTION_DAYS = 200

function stateDir(): string {
	return process.env.STATUS_STATE_DIR?.trim() || path.join(process.cwd(), ".state")
}

function historyFile(): string {
	return path.join(stateDir(), "status-history.jsonl")
}

/** YYYY-MM-DD in Asia/Shanghai, matching how the site reports dates elsewhere. */
export function dayKey(ms: number): string {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Shanghai",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date(ms))
}

function normalizeState(value: string | undefined): ServiceState {
	if (value === "up" || value === "degraded" || value === "down") return value
	return "unknown"
}

async function readSamples(): Promise<Sample[]> {
	try {
		const raw = await fs.readFile(historyFile(), "utf8")
		return raw
			.split("\n")
			.filter(Boolean)
			.map((line) => {
				try {
					return JSON.parse(line) as Sample
				} catch {
					return null
				}
			})
			.filter((sample): sample is Sample => Boolean(sample && typeof sample.t === "number"))
	} catch {
		return []
	}
}

/** Appends one probe sample; called by the loopback-only collector route. */
export async function appendSample(states: Record<HistoryServiceId, ServiceState>): Promise<void> {
	const file = historyFile()
	await fs.mkdir(path.dirname(file), { recursive: true })
	const sample: Sample = { t: Date.now(), s: states }
	await fs.appendFile(file, JSON.stringify(sample) + "\n", "utf8")

	// Keep the file bounded without touching recent data.
	try {
		const stat = await fs.stat(file)
		if (stat.size > MAX_FILE_BYTES) {
			const cutoff = Date.now() - RETENTION_DAYS * DAY_MS
			const kept = (await readSamples()).filter((entry) => entry.t >= cutoff)
			await fs.writeFile(file, kept.map((entry) => JSON.stringify(entry)).join("\n") + "\n", "utf8")
		}
	} catch {
		// Rotation is best-effort; a missed rotation must never fail the probe.
	}
}

export type UptimeReport = {
	windowDays: number
	windowStart: string
	windowEnd: string
	firstSampleAt: string | null
	samples: number
	services: ServiceUptime[]
}

/**
 * Aggregates the recorded samples into one cell per day per service.
 * Days before recording started stay "none" so the UI can draw them grey
 * instead of inventing uptime.
 */
export async function buildUptimeReport(windowDays = 90, now = Date.now()): Promise<UptimeReport> {
	const samples = await readSamples()
	const windowStartMs = now - (windowDays - 1) * DAY_MS
	const startKey = dayKey(windowStartMs)
	const endKey = dayKey(now)

	// date -> service -> counters
	const byDay = new Map<string, Map<HistoryServiceId, { up: number; degraded: number; down: number; unknown: number }>>()
	let firstSampleAt: number | null = null
	let inWindow = 0

	for (const sample of samples) {
		if (sample.t < windowStartMs) continue
		inWindow += 1
		if (firstSampleAt === null || sample.t < firstSampleAt) firstSampleAt = sample.t
		const key = dayKey(sample.t)
		let day = byDay.get(key)
		if (!day) {
			day = new Map()
			byDay.set(key, day)
		}
		for (const id of HISTORY_SERVICE_IDS) {
			const state = normalizeState(sample.s?.[id])
			const bucket = day.get(id) ?? { up: 0, degraded: 0, down: 0, unknown: 0 }
			if (state === "up") bucket.up += 1
			else if (state === "degraded") bucket.degraded += 1
			else if (state === "down") bucket.down += 1
			else bucket.unknown += 1
			day.set(id, bucket)
		}
	}

	const days: string[] = []
	for (let i = windowDays - 1; i >= 0; i -= 1) days.push(dayKey(now - i * DAY_MS))

	const services: ServiceUptime[] = HISTORY_SERVICE_IDS.map((id) => {
		let up = 0
		let total = 0
		const cells: DayCell[] = days.map((date) => {
			const bucket = byDay.get(date)?.get(id)
			if (!bucket) return { date, state: "none" }
			const count = bucket.up + bucket.degraded + bucket.down + bucket.unknown
			up += bucket.up
			total += count
			// One bad sample in a day should not paint the whole day amber:
			// a day is degraded only when >5% of its samples are not "up".
			if (bucket.down > 0) return { date, state: "down" }
			const notUp = bucket.degraded + bucket.unknown
			if (notUp / count > 0.05) return { date, state: "degraded" }
			return { date, state: "up" }
		})
		return {
			id,
			days: cells,
			samples: total,
			availability: total > 0 ? Math.round((up / total) * 10000) / 100 : null,
		}
	})

	return {
		windowDays,
		windowStart: startKey,
		windowEnd: endKey,
		firstSampleAt: firstSampleAt === null ? null : new Date(firstSampleAt).toISOString(),
		samples: inWindow,
		services,
	}
}

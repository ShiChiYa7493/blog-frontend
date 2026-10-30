import type { Metadata } from "next"
import Link from "next/link"
import { Activity, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, Info, XCircle } from "lucide-react"
import { SiteShell } from "@/components/SiteShell"
import { collectStatus, type ServiceState } from "@/lib/status"
import { buildUptimeReport, type DayCell } from "@/lib/status-history"
import incidentsFile from "@/content/incidents.json"

export const dynamic = "force-dynamic"
export const revalidate = 0

const SITE_URL = process.env.SITE_URL ?? "https://shichiya.cn"

export const metadata: Metadata = {
	title: "服务状态",
	description: "shichiya.cn 各服务的实时可用性、可用率与历史事件",
	alternates: { canonical: `${SITE_URL}/status` },
	openGraph: {
		title: "服务状态",
		description: "shichiya.cn 各服务的实时可用性、可用率与历史事件",
		url: `${SITE_URL}/status`,
		type: "website",
	},
}

type Incident = {
	date: string
	service: string
	level: "major" | "minor" | "info"
	status: string
	title: string
	summary: string
}

const INCIDENTS = (incidentsFile.incidents as Incident[]).slice().sort((a, b) => (a.date < b.date ? 1 : -1))

const SERVICE_META: Record<string, { name: string; description: string; home?: string }> = {
	web: { name: "站点页面", description: "Next.js 服务端渲染" },
	"blog-api": { name: "博客接口", description: "文章、分类、标签与 RSS 的后端" },
	arsenal: { name: "ARSENAL 目录接口", description: "配卡页使用的武器 / MOD 目录与规则版本", home: "/warframe/arsenal/" },
	data: { name: "游戏数据服务", description: "版本化游戏数据与实时接口的数据源" },
	miya: { name: "咪娅机器人", description: "QQ 机器人与网页后台" },
}

const STATE_ICON: Record<ServiceState, typeof CheckCircle2> = {
	up: CheckCircle2,
	degraded: AlertTriangle,
	down: XCircle,
	unknown: HelpCircle,
}

const STATE_ICON_COLOR: Record<ServiceState, string> = {
	up: "text-emerald-500",
	degraded: "text-amber-500",
	down: "text-rose-500",
	unknown: "text-muted-foreground",
}

const STATE_LABEL: Record<ServiceState, string> = {
	up: "正常",
	degraded: "降级",
	down: "不可用",
	unknown: "未知",
}

const TICK_CLASS: Record<DayCell["state"], string> = {
	up: "bg-emerald-500/85",
	degraded: "bg-amber-400/90",
	down: "bg-rose-500/90",
	unknown: "bg-muted-foreground/25",
	none: "bg-muted-foreground/10",
}

const BANNER: Record<string, { title: string; body: string; tone: string; icon: typeof CheckCircle2; iconColor: string }> = {
	operational: {
		title: "一切运行正常",
		body: "所有系统均按预期运行。",
		tone: "border-emerald-500/25 bg-emerald-500/[0.07]",
		icon: CheckCircle2,
		iconColor: "text-emerald-500",
	},
	degraded: {
		title: "部分服务异常",
		body: "有服务未正常响应或正在使用降级数据，其余功能不受影响。",
		tone: "border-amber-500/30 bg-amber-500/[0.07]",
		icon: AlertTriangle,
		iconColor: "text-amber-500",
	},
	unknown: {
		title: "暂时无法检测",
		body: "依赖服务本轮均未响应，可能是本机网络或服务编排出现问题。",
		tone: "border-rose-500/30 bg-rose-500/[0.07]",
		icon: XCircle,
		iconColor: "text-rose-500",
	},
}

function currentMonth(): string {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit" }).format(new Date())
}

function shiftMonth(ym: string, delta: number): string {
	const [year, month] = ym.split("-").map(Number)
	const date = new Date(Date.UTC(year, month - 1 + delta, 1))
	return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`
}

function monthLabel(ym: string): string {
	const [year, month] = ym.split("-").map(Number)
	return `${year}年${month}月`
}

function buildCalendar(ym: string): (string | null)[] {
	const [year, month] = ym.split("-").map(Number)
	const first = new Date(Date.UTC(year, month - 1, 1))
	const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
	const leading = (first.getUTCDay() + 6) % 7 // Monday-first grid
	const cells: (string | null)[] = Array.from({ length: leading }, () => null)
	for (let day = 1; day <= daysInMonth; day += 1) {
		cells.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
	}
	while (cells.length % 7 !== 0) cells.push(null)
	return cells
}

export default async function StatusPage({ searchParams }: { searchParams: { month?: string } }) {
	const [snapshot, report] = await Promise.all([collectStatus(), buildUptimeReport(90)])
	const banner = BANNER[snapshot.overall] ?? BANNER.unknown
	const BannerIcon = banner.icon

	const month = /^\d{4}-\d{2}$/.test(searchParams?.month ?? "") ? searchParams!.month! : currentMonth()
	const calendar = buildCalendar(month)
	const monthIncidents = INCIDENTS.filter((incident) => incident.date.startsWith(month))
	const incidentsByDate = new Map(monthIncidents.map((incident) => [incident.date, incident]))
	const statusLabel = (value: string) => (value === "resolved" ? "已解决" : value === "ongoing" ? "处理中" : value)
	const prevMonth = shiftMonth(month, -1)
	const nextMonth = shiftMonth(month, 1)
	const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())

	return (
		<SiteShell current="/status">
			<div className="max-w-2xl mx-auto">
				<h1 className="sr-only">服务状态</h1>

				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Activity className="h-4 w-4 text-primary" />
						<span>shichiya.cn 服务状态</span>
					</div>
					<Link
						href="/changelog"
						className="rounded-lg border border-border/70 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
					>
						订阅更新
					</Link>
				</div>

				{/* Overall banner */}
				<section className={`rounded-xl border px-5 py-4 ${banner.tone}`}>
					<div className="flex items-center gap-2">
						<BannerIcon className={`h-5 w-5 ${banner.iconColor}`} />
						<span className="font-medium">{banner.title}</span>
					</div>
					<p className="text-sm text-muted-foreground mt-1">{banner.body}</p>
					<p className="text-[11px] text-muted-foreground/70 mt-2">
						检测于 {new Intl.DateTimeFormat("zh-CN", {
							timeZone: "Asia/Shanghai",
							month: "2-digit",
							day: "2-digit",
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
							hour12: false,
						}).format(new Date(snapshot.checkedAt))}
					</p>
				</section>

				{/* Uptime per service */}
				<section className="mt-4 rounded-xl border border-border/70 bg-card/60 overflow-hidden">
					<header className="flex items-center justify-between px-5 py-3 border-b border-border/60">
						<h2 className="text-sm font-semibold">系统状态</h2>
						<span className="text-xs text-muted-foreground">
							{report.windowStart} 至 {report.windowEnd}
						</span>
					</header>

					<ul className="px-5 py-4 space-y-5">
						{report.services.map((service) => {
							const meta = SERVICE_META[service.id] ?? { name: service.id, description: "" }
							const live = snapshot.services.find((item) => item.id === service.id)
							const state = live?.state ?? "unknown"
							const Icon = STATE_ICON[state]
							return (
								<li key={service.id}>
									<div className="flex items-center justify-between gap-3">
										<div className="flex items-center gap-2 min-w-0">
											<Icon className={`h-4 w-4 shrink-0 ${STATE_ICON_COLOR[state]}`} aria-hidden />
											<span className="text-sm font-medium truncate">{meta.name}</span>
											<span className="sr-only">{STATE_LABEL[state]}</span>
											<span title={meta.description} className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
												<Info className="h-3.5 w-3.5" aria-hidden />
											</span>
										</div>
										<span className="text-xs tabular-nums text-muted-foreground shrink-0">
											{service.availability === null ? "—" : `${service.availability.toFixed(2)}%`} 可用性
										</span>
									</div>
									<div
										className="mt-2 flex gap-[3px] h-6"
										role="img"
										aria-label={`${meta.name} 最近 ${report.windowDays} 天可用性`}
									>
										{service.days.map((cell) => (
											<span
												key={cell.date}
												title={`${cell.date} · ${cell.state === "none" ? "无数据" : STATE_LABEL[cell.state as ServiceState]}`}
												className={`flex-1 rounded-[2px] ${TICK_CLASS[cell.state]}`}
											/>
										))}
									</div>
								</li>
							)
						})}
					</ul>

					<div className="px-5 pb-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground/80">
						<span className="flex items-center gap-1"><span className="h-2 w-2 rounded-[1px] bg-emerald-500/85" />正常</span>
						<span className="flex items-center gap-1"><span className="h-2 w-2 rounded-[1px] bg-amber-400/90" />降级</span>
						<span className="flex items-center gap-1"><span className="h-2 w-2 rounded-[1px] bg-rose-500/90" />不可用</span>
						<span className="flex items-center gap-1"><span className="h-2 w-2 rounded-[1px] bg-muted-foreground/10" />无数据</span>
					</div>
					<p className="px-5 pb-4 pt-1 text-[11px] leading-relaxed text-muted-foreground/80">
						{report.samples === 0
							? "可用率从今天开始统计，此前的日期显示为灰色。每 5 分钟探测一次。"
							: `按每 5 分钟一次的探测统计，共 ${report.samples} 次采样；灰色表示尚未记录。`}
					</p>
				</section>

				{/* Incident calendar */}
				<section className="mt-4 rounded-xl border border-border/70 bg-card/60 overflow-hidden">
					<header className="flex items-center justify-between px-5 py-3 border-b border-border/60">
						<h2 className="text-sm font-semibold">事件日历</h2>
						<div className="flex items-center gap-1 text-xs text-muted-foreground">
							<Link href={`/status?month=${prevMonth}`} className="p-1 rounded hover:bg-muted transition-colors" aria-label="上个月">
								<ChevronLeft className="h-4 w-4" />
							</Link>
							<span className="tabular-nums mx-1">{monthLabel(month)}</span>
							<Link href={`/status?month=${nextMonth}`} className="p-1 rounded hover:bg-muted transition-colors" aria-label="下个月">
								<ChevronRight className="h-4 w-4" />
							</Link>
						</div>
					</header>

					<div className="px-5 py-4">
						<div className="grid grid-cols-7 text-center text-[11px] text-muted-foreground mb-2">
							{["一", "二", "三", "四", "五", "六", "日"].map((day) => (
								<span key={day}>{day}</span>
							))}
						</div>
						<div className="grid grid-cols-7 gap-y-1.5 text-center text-xs">
							{calendar.map((date, index) => {
								if (!date) return <span key={`blank-${index}`} />
								const incident = incidentsByDate.get(date)
								const isToday = date === today
								return (
									<span key={date} className="flex items-center justify-center">
										<span
											title={incident ? incident.title : undefined}
											className={[
												"flex h-7 w-7 items-center justify-center rounded-full tabular-nums transition-colors",
												incident
													? incident.level === "major"
														? "border border-rose-500/50 text-rose-600 dark:text-rose-400"
														: "border border-amber-500/50 text-amber-600 dark:text-amber-400"
													: "text-muted-foreground",
												isToday && !incident ? "bg-primary/10 text-foreground font-medium" : "",
											].join(" ")}
										>
											{Number(date.slice(8))}
										</span>
									</span>
								)
							})}
						</div>

						<div className="mt-4 space-y-2">
							{monthIncidents.length === 0 ? (
								<p className="text-xs text-muted-foreground">本月无已记录的事件。</p>
							) : (
								monthIncidents.map((incident) => (
									<div key={`${incident.date}-${incident.title}`} className="rounded-lg border border-border/60 px-3 py-2">
										<div className="flex items-center gap-2 text-xs">
											<span className={`h-1.5 w-1.5 rounded-full ${incident.level === "major" ? "bg-rose-500" : "bg-amber-500"}`} />
											<span className="tabular-nums text-muted-foreground">{incident.date}</span>
											<span className="text-[11px] text-muted-foreground">· {statusLabel(incident.status)}</span>
										</div>
										<p className="text-sm mt-1">{incident.title}</p>
										<p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{incident.summary}</p>
									</div>
								))
							)}
						</div>
					</div>
				</section>

				<p className="mt-4 text-[11px] leading-relaxed text-muted-foreground/70">
					检测在服务端执行，只访问本机回环地址。咪娅后台需要登录，检测到 401/403 同样说明服务在运行。
					本页不记录逐请求日志，可用率来自每 5 分钟一次的采样。
				</p>
			</div>
		</SiteShell>
	)
}

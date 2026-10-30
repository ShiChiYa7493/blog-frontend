import type { Metadata } from "next"
import Link from "next/link"
import { Activity, AlertTriangle, CheckCircle2, HelpCircle, Info, XCircle } from "lucide-react"
import { SiteShell } from "@/components/SiteShell"
import { UptimeBars } from "@/components/status/UptimeBars"
import { IncidentCalendar, type Incident } from "@/components/status/IncidentCalendar"
import { collectStatus, type ServiceState } from "@/lib/status"
import { buildUptimeReport } from "@/lib/status-history"
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

export default async function StatusPage() {
	const [snapshot, report] = await Promise.all([collectStatus(), buildUptimeReport(90)])
	const banner = BANNER[snapshot.overall] ?? BANNER.unknown
	const BannerIcon = banner.icon

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

				<section className={`rounded-xl border px-5 py-4 ${banner.tone}`}>
					<div className="flex items-center gap-2">
						<BannerIcon className={`h-5 w-5 ${banner.iconColor}`} />
						<span className="font-medium">{banner.title}</span>
					</div>
					<p className="text-sm text-muted-foreground mt-1">{banner.body}</p>
					<p className="text-[11px] text-muted-foreground/70 mt-2">
						检测于{" "}
						{new Intl.DateTimeFormat("zh-CN", {
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
									<UptimeBars days={service.days} label={meta.name} />
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
							? "可用率从今天开始统计，此前的日期显示为灰色。每 5 分钟探测一次，悬停色块可查看当天状态。"
							: `按每 5 分钟一次的探测统计，共 ${report.samples} 次采样；灰色表示尚未记录。`}
					</p>
				</section>

				<section className="mt-4 rounded-xl border border-border/70 bg-card/60 overflow-hidden">
					<IncidentCalendar incidents={INCIDENTS} />
				</section>

				<p className="mt-4 text-[11px] leading-relaxed text-muted-foreground/70">
					检测在服务端执行，只访问本机回环地址。咪娅后台需要登录，检测到 401/403 同样说明服务在运行。
					本页不记录逐请求日志，可用率来自每 5 分钟一次的采样。
				</p>
			</div>
		</SiteShell>
	)
}

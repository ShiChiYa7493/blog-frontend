import type { Metadata } from "next"
import Link from "next/link"
import { Activity, RefreshCw } from "lucide-react"
import { SiteShell } from "@/components/SiteShell"
import { collectStatus, formatCheckedAt, type ServiceState, type StatusSnapshot } from "@/lib/status"

export const dynamic = "force-dynamic"
export const revalidate = 0

const SITE_URL = process.env.SITE_URL ?? "https://shichiya.cn"

export const metadata: Metadata = {
	title: "服务状态",
	description: "shichiya.cn 各服务的实时可用性与版本信息",
	alternates: { canonical: `${SITE_URL}/status` },
	openGraph: {
		title: "服务状态",
		description: "shichiya.cn 各服务的实时可用性与版本信息",
		url: `${SITE_URL}/status`,
		type: "website",
	},
}

const STATE_STYLES: Record<ServiceState, { label: string; dot: string; text: string; ring: string }> = {
	up: { label: "正常", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/20" },
	degraded: { label: "降级", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-500/20" },
	down: { label: "不可用", dot: "bg-rose-500", text: "text-rose-600 dark:text-rose-400", ring: "ring-rose-500/20" },
	unknown: { label: "未知", dot: "bg-slate-400", text: "text-slate-500", ring: "ring-slate-400/20" },
}

const OVERALL_COPY: Record<StatusSnapshot["overall"], { title: string; body: string; tone: string }> = {
	operational: {
		title: "全部正常",
		body: "各服务均在本轮检测中正常响应。",
		tone: "border-emerald-500/30 bg-emerald-500/5",
	},
	degraded: {
		title: "部分服务异常",
		body: "有服务未正常响应或正在使用降级数据，页面上的其它功能不受影响。",
		tone: "border-amber-500/30 bg-amber-500/5",
	},
	unknown: {
		title: "无法检测",
		body: "所有依赖服务都未能响应，可能是本机网络或服务编排出现问题。",
		tone: "border-rose-500/30 bg-rose-500/5",
	},
}

export default async function StatusPage() {
	const snapshot = await collectStatus()
	const overall = OVERALL_COPY[snapshot.overall]

	return (
		<SiteShell current="/status">
			<div className="mb-8">
				<div className="flex items-center gap-3">
					<Activity className="h-7 w-7 text-primary" />
					<h1 className="text-3xl md:text-4xl font-bold">服务状态</h1>
				</div>
				<p className="text-muted-foreground mt-2 text-sm md:text-base">
					shichiya.cn 上运行的各项服务的实时可用性。每次打开本页都会重新检测。
				</p>
			</div>

			<div className={`mb-8 rounded-lg border px-5 py-4 ${overall.tone}`}>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p className="text-lg font-semibold">{overall.title}</p>
						<p className="text-sm text-muted-foreground mt-1">{overall.body}</p>
					</div>
					<div className="flex items-center gap-3 text-xs text-muted-foreground">
						<span>检测于 {formatCheckedAt(snapshot.checkedAt)}（UTC+8）</span>
						<Link href="/status" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
							<RefreshCw className="h-3.5 w-3.5" />
							重新检测
						</Link>
					</div>
				</div>
			</div>

			<ul className="space-y-3">
				{snapshot.services.map((service) => {
					const style = STATE_STYLES[service.state]
					return (
						<li
							key={service.id}
							className={`rounded-lg border border-border/70 bg-card/60 px-5 py-4 ring-1 ${style.ring}`}
						>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div className="min-w-0">
									<div className="flex items-center gap-2">
										<span className={`h-2 w-2 rounded-full ${style.dot}`} aria-hidden />
										<h2 className="font-medium">{service.name}</h2>
										<span className={`text-xs font-medium ${style.text}`}>{style.label}</span>
									</div>
									<p className="text-sm text-muted-foreground mt-1">{service.description}</p>
									{service.detail && (
										<p className="text-xs text-muted-foreground/80 mt-1 font-mono break-all">{service.detail}</p>
									)}
								</div>
								<div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
									{typeof service.latencyMs === "number" && <span>{service.latencyMs} ms</span>}
									{service.home && (
										<Link href={service.home} className="hover:text-foreground transition-colors">
											打开 →
										</Link>
									)}
								</div>
							</div>
						</li>
					)
				})}
			</ul>

			<section className="mt-10 rounded-lg border border-border/60 bg-muted/30 px-5 py-4 text-sm text-muted-foreground">
				<h2 className="font-medium text-foreground mb-2">关于这项检测</h2>
				<ul className="list-disc pl-5 space-y-1.5">
					<li>检测在服务端执行，只访问本机回环地址，不会把内部端口暴露给浏览器。</li>
					<li>每项检测独立超时，任一服务卡住不会拖慢整页。</li>
					<li>「降级」表示服务在线但正在使用缓存或内置快照数据。</li>
					<li>咪娅后台需要登录，检测到 401/403 也说明服务在正常运行。</li>
					<li>本页不含历史可用率曲线；需要逐请求记录请参见各服务自身的日志。</li>
				</ul>
			</section>
		</SiteShell>
	)
}

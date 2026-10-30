"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cdnAsset } from "@/lib/cdn"
import { Anchor, Bot, Copy, GitBranch, History, Mail, Swords, Activity, ArrowRight } from "lucide-react"
import { toast } from "sonner"

const EMAIL = "shichiya@qq.com"

export type HomeLatestUpdate = {
	product: string
	date: string
	title: string
}

type SiteState = "operational" | "degraded" | "unknown"

const PRIMARY_LINKS = [
	{ href: "https://blog.shichiya.cn", label: "Blog", hint: "读文章", icon: Anchor, external: true },
	{ href: "/warframe/arsenal/", label: "ARSENAL", hint: "配卡计算", icon: Swords, external: false },
]

const SECONDARY_LINKS = [
	{ href: "/warframe/bot/", label: "Bot", icon: Bot, external: false },
	{ href: "/changelog", label: "更新记录", icon: History, external: false },
	{ href: "/status", label: "服务状态", icon: Activity, external: false },
	{ href: "https://github.com/ShiChiYa7493/shichiya-blog", label: "GitHub", icon: GitBranch, external: true },
]

const STATUS_COPY: Record<SiteState, { label: string; dot: string; text: string }> = {
	operational: { label: "服务正常", dot: "bg-emerald-400", text: "text-emerald-200" },
	degraded: { label: "部分降级", dot: "bg-amber-400", text: "text-amber-200" },
	unknown: { label: "状态未知", dot: "bg-slate-400", text: "text-white/50" },
}

async function copyToClipboard(text: string) {
	try {
		await navigator.clipboard.writeText(text)
		toast.success("已复制邮箱", { description: text })
	} catch {
		toast.error("复制失败", { description: text })
	}
}

export function HomeCard({ latest }: { latest?: HomeLatestUpdate | null }) {
	const [siteState, setSiteState] = useState<SiteState | null>(null)

	useEffect(() => {
		let cancelled = false
		const controller = new AbortController()
		const timer = setTimeout(() => controller.abort(), 4000)
		fetch("/site-status", { cache: "no-store", signal: controller.signal })
			.then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
			.then((data: { overall?: SiteState }) => {
				if (!cancelled) setSiteState(data.overall ?? "unknown")
			})
			.catch(() => {
				if (!cancelled) setSiteState("unknown")
			})
			.finally(() => clearTimeout(timer))
		return () => {
			cancelled = true
			controller.abort()
			clearTimeout(timer)
		}
	}, [])

	const status = siteState ? STATUS_COPY[siteState] : null

	return (
		<div className="relative z-20 w-full max-w-3xl mx-auto px-4">
			<div className="backdrop-blur-xl bg-slate-950/45 border border-white/15 rounded-2xl p-6 md:p-7 shadow-2xl shadow-blue-950/30">
				{/* Identity */}
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-center gap-4">
						<img
							src={cdnAsset("avatar.jpg")}
							alt="优川七夜"
							className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full object-cover shadow-lg ring-4 ring-white/20"
						/>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold text-white leading-tight" style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}>
								优川七夜
							</h1>
							<p className="text-white/50 text-[11px] tracking-[0.2em] uppercase mt-1">Yuga Shichiya</p>
						</div>
					</div>

					{status && (
						<Link
							href="/status"
							className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/70 hover:bg-white/10 transition-colors"
							title="查看服务状态"
							aria-label="查看服务状态"
						>
							<span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden />
							<span className={status.text}>{status.label}</span>
						</Link>
					)}
				</div>

				{/* Tagline + one-line positioning (also the indexable description of this page) */}
				<div className="mt-4 space-y-1.5">
					<p className="text-white/75 text-xs md:text-sm">跨越现今，前往未来，起锚吧！</p>
					<p className="text-white/55 text-xs md:text-sm leading-relaxed">
						独立开发者，做 Warframe 工具与自建服务，顺手把过程和踩过的坑写下来。
					</p>
				</div>

				{/* Primary entries */}
				<div className="grid grid-cols-2 gap-2.5 mt-5">
					{PRIMARY_LINKS.map((link) => {
						const Icon = link.icon
						const isPrimary = link.label === "Blog"
						return (
							<a
								key={link.label}
								href={link.href}
								target={link.external ? "_blank" : undefined}
								rel={link.external ? "noopener noreferrer" : undefined}
								className={`group flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
									isPrimary
										? "bg-blue-500/80 hover:bg-blue-400/80 shadow-lg shadow-blue-500/20"
										: "bg-white/10 hover:bg-white/15 border border-white/15"
								}`}
							>
								<span className="flex items-center gap-2 min-w-0">
									<Icon className="h-4 w-4 shrink-0" />
									<span className="truncate">{link.label}</span>
								</span>
								<span className="text-[11px] text-white/60 group-hover:text-white/80 transition-colors hidden sm:inline">
									{link.hint}
								</span>
							</a>
						)
					})}
				</div>

				{/* Secondary entries */}
				<div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2.5">
					{SECONDARY_LINKS.map((link) => {
						const Icon = link.icon
						return (
							<a
								key={link.label}
								href={link.href}
								target={link.external ? "_blank" : undefined}
								rel={link.external ? "noopener noreferrer" : undefined}
								className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-2.5 text-[11px] text-white/70 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
							>
								<Icon className="h-4 w-4" aria-hidden />
								<span>{link.label}</span>
							</a>
						)
					})}
					<button
						type="button"
						onClick={() => copyToClipboard(EMAIL)}
						title={`点击复制 ${EMAIL}`}
						aria-label={`复制邮箱 ${EMAIL}`}
						className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-2.5 text-[11px] text-white/70 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
					>
						<Mail className="h-4 w-4" aria-hidden />
						<span className="flex items-center gap-1">
							邮箱
							<Copy className="h-2.5 w-2.5 opacity-60" aria-hidden />
						</span>
					</button>
				</div>

				{/* Latest update ticker */}
				{latest && (
					<div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-[11px]">
						<p className="text-white/60 min-w-0 sm:truncate">
							<span className="text-white/40 mr-1.5">最近更新</span>
							<span className="text-white/70">{latest.date}</span>
							<span className="text-white/40 mx-1 hidden sm:inline">·</span>
							<span className="text-white/50 hidden sm:inline">{latest.product}</span>
							<span className="text-white/40 mx-1">·</span>
							<span className="text-white/70">{latest.title}</span>
						</p>
						<Link href="/changelog" className="shrink-0 inline-flex items-center gap-0.5 text-white/60 hover:text-white transition-colors">
							查看全部 <ArrowRight className="h-3 w-3" />
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}
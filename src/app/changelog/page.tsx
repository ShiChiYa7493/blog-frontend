import type { Metadata } from "next"
import Link from "next/link"
import { History, ArrowUpRight } from "lucide-react"
import { SiteShell } from "@/components/SiteShell"
import { getChangelog, getLatestEntry, formatEntryDate, type ChangelogEntryType } from "@/lib/changelog"

const SITE_URL = process.env.SITE_URL ?? "https://shichiya.cn"

export const metadata: Metadata = {
	title: "更新记录",
	description: "ARSENAL、咪娅机器人与游戏数据服务的版本变更记录",
	alternates: { canonical: `${SITE_URL}/changelog` },
	openGraph: {
		title: "更新记录",
		description: "ARSENAL、咪娅机器人与游戏数据服务的版本变更记录",
		url: `${SITE_URL}/changelog`,
		type: "website",
	},
}

const TYPE_STYLES: Record<ChangelogEntryType, string> = {
	新增: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
	改进: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
	修复: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
	数据: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
}

export default function ChangelogPage() {
	const changelog = getChangelog()
	const latest = getLatestEntry(changelog)

	return (
		<SiteShell current="/changelog">
			<div className="mb-8">
				<div className="flex items-center gap-3">
					<History className="h-7 w-7 text-primary" />
					<h1 className="text-3xl md:text-4xl font-bold">更新记录</h1>
				</div>
				<p className="text-muted-foreground mt-2 text-sm md:text-base">
					几个自建产品的版本变更。每条只写用户能感知的变化，内部重构与运维不记在这里。
				</p>
				{latest && (
					<p className="text-xs text-muted-foreground mt-3">
						最近更新：{formatEntryDate(latest.entry.date)} · {latest.product.name} —— {latest.entry.title}
					</p>
				)}
			</div>

			<nav className="mb-8 flex flex-wrap gap-2">
				{changelog.products.map((product) => (
					<a
						key={product.id}
						href={`#${product.id}`}
						className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
					>
						{product.name}
					</a>
				))}
			</nav>

			<div className="space-y-12">
				{changelog.products.map((product) => (
					<section key={product.id} id={product.id} className="scroll-mt-20">
						<div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-3">
							<div>
								<h2 className="text-xl font-bold">{product.name}</h2>
								<p className="text-sm text-muted-foreground mt-1">{product.summary}</p>
							</div>
							<div className="flex items-center gap-2">
								{product.badges?.map((badge) => (
									<span key={badge} className="rounded border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground font-mono">
										{badge}
									</span>
								))}
								{product.home && (
									<Link
										href={product.home}
										className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
									>
										打开 <ArrowUpRight className="h-3 w-3" />
									</Link>
								)}
							</div>
						</div>

						{product.entries.length === 0 ? (
							<p className="text-sm text-muted-foreground py-4">暂无记录。</p>
						) : (
							<ol className="mt-4 space-y-1">
								{product.entries.map((entry, index) => (
									<li key={`${product.id}-${entry.date}-${entry.title}`}>
										<details open={index === 0} className="group rounded-lg border border-transparent hover:border-border/60 px-3 py-2">
											<summary className="flex cursor-pointer list-none flex-wrap items-center gap-2.5 [&::-webkit-details-marker]:hidden">
												<span className="font-mono text-xs text-muted-foreground tabular-nums">{formatEntryDate(entry.date)}</span>
												<span className={`rounded border px-1.5 py-0.5 text-[11px] leading-none ${TYPE_STYLES[entry.type]}`}>{entry.type}</span>
												<span className="text-sm font-medium">{entry.title}</span>
											</summary>
											{entry.items && entry.items.length > 0 && (
												<ul className="mt-2 ml-[calc(4.5rem+0.625rem)] list-disc pl-5 text-sm text-muted-foreground space-y-1">
													{entry.items.map((item) => (
														<li key={item}>{item}</li>
													))}
												</ul>
											)}
										</details>
									</li>
								))}
							</ol>
						)}
					</section>
				))}
			</div>

			<section className="mt-12 rounded-lg border border-border/60 bg-muted/30 px-5 py-4 text-sm text-muted-foreground">
				<h2 className="font-medium text-foreground mb-2">说明</h2>
				<ul className="list-disc pl-5 space-y-1.5">
					<li>本页随发布更新，最新条目默认展开，其余点开可看细节。</li>
					<li>只记录用户能感知的变化；重构、测试、依赖升级与运维不在此列。</li>
					<li>ARSENAL 的「可算模式」与「MOD 规则」是当前数据与规则下的支持范围，不代表游戏内已验证。</li>
					<li>各服务当前可用性见 <Link href="/status" className="text-primary hover:underline">服务状态</Link>。</li>
				</ul>
			</section>
		</SiteShell>
	)
}

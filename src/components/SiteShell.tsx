import Link from "next/link"
import { Anchor } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

const NAV = [
	// 博客在独立子域，主域的 /blog 没有代理到 Next
	{ href: "https://blog.shichiya.cn", label: "博客" },
	{ href: "/changelog", label: "更新记录" },
	{ href: "/status", label: "服务状态" },
	{ href: "/warframe/arsenal/", label: "ARSENAL" },
]

/** Minimal shell for site-level pages that sit outside the blog layout. */
export function SiteShell({ children, current }: { children: React.ReactNode; current?: string }) {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
				<div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
					<Link href="/" className="flex items-center gap-1.5 text-lg font-black tracking-tight shrink-0">
						<Anchor className="h-4 w-4 text-primary" />
						优川七夜
					</Link>
					<nav className="flex items-center gap-4 md:gap-6 text-sm text-muted-foreground overflow-x-auto">
						{NAV.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={
									current === item.href
										? "text-foreground font-medium whitespace-nowrap"
										: "hover:text-foreground transition-colors whitespace-nowrap"
								}
							>
								{item.label}
							</Link>
						))}
						<ThemeToggle />
					</nav>
				</div>
			</header>
			<main className="max-w-4xl mx-auto px-4 py-8 md:py-10 w-full flex-1">{children}</main>
			<footer className="border-t border-border/60">
				<div className="max-w-4xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
					<span>&copy; {new Date().getFullYear()} 优川七夜 · Weigh Anchor!</span>
					<div className="flex items-center gap-4">
						<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
							蜀ICP备2026017856号
						</a>
						<a href="https://icp.gov.moe/?keyword=20267493" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
							萌ICP备20267493号
						</a>
					</div>
				</div>
			</footer>
		</div>
	)
}

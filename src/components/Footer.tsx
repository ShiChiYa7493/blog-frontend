import Link from "next/link"
import { Anchor } from "lucide-react"

export default function Footer() {
	return (
		<footer className="mt-16">
			<div className="flex items-center gap-3 max-w-6xl mx-auto px-4">
				<div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
				<Anchor className="h-3 w-3 text-primary/30" />
				<div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
			</div>
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
					<p>&copy; {new Date().getFullYear()} 优川七夜 · Weigh Anchor!</p>
					<div className="flex gap-4">
						<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
							蜀ICP备2026017856号
						</a>
						<a href="https://icp.gov.moe/?keyword=20267493" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
							萌ICP备20267493号
						</a>
					</div>
					<div className="flex gap-6">
						<Link href="/api/rss" className="hover:text-foreground transition-colors">
							RSS
						</Link>
						<Link href="/blog/about" className="hover:text-foreground transition-colors">
							About
						</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}

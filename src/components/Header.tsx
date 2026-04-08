import Link from "next/link"
import { getCategories } from "@/lib/api"
import { ThemeToggle } from "@/components/ThemeToggle"
import { MobileNav } from "@/components/MobileNav"
import { Search, Anchor } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export default async function Header() {
	let categories: { id: number; name: string; slug: string }[] = []
	try {
		categories = await getCategories()
	} catch {
		categories = []
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
				{/* Left: Mobile menu + Logo */}
				<div className="flex items-center gap-2">
					<MobileNav categories={categories} />
					<Link href="/blog" className="flex items-center gap-1.5 text-xl font-black tracking-tight">
						<Anchor className="h-4 w-4 text-primary" />
						SHICHIYA
					</Link>
				</div>

				{/* Center: Desktop nav */}
				<nav className="hidden md:flex items-center gap-6 text-sm">
					{categories.map((cat: { id: number; name: string; slug: string }) => (
						<Link key={cat.id} href={`/blog/categories/${cat.slug}`} className="text-muted-foreground hover:text-foreground transition-colors">
							{cat.name}
						</Link>
					))}
					<Link href="/blog/gallery" className="text-muted-foreground hover:text-foreground transition-colors">
						图库
					</Link>
					<Link href="/blog/archives" className="text-muted-foreground hover:text-foreground transition-colors">
						Archives
					</Link>
					<Link href="/blog/about" className="text-muted-foreground hover:text-foreground transition-colors">
						About
					</Link>
				</nav>

				{/* Right: Search + Theme toggle */}
				<div className="flex items-center gap-1">
					<Link href="/blog/search" className={buttonVariants({ variant: "ghost", size: "icon" })}>
						<Search className="h-4 w-4" />
					</Link>
					<ThemeToggle />
				</div>
			</div>
		</header>
	)
}

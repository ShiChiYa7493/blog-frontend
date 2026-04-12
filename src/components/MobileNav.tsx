"use client"

import { useState } from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Menu, Anchor } from "lucide-react"

interface MobileNavProps {
	categories: { id: number; name: string; slug: string }[]
}

export function MobileNav({ categories }: MobileNavProps) {
	const [open, setOpen] = useState(false)

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger className={`${buttonVariants({ variant: "ghost", size: "icon" })} md:hidden`}>
				<Menu className="h-5 w-5" />
			</SheetTrigger>
			<SheetContent side="left" className="!w-72 p-0">
				<div className="flex flex-col h-full px-4 py-6">
					<Link href="/blog" onClick={() => setOpen(false)} className="flex items-center gap-1.5 text-xl font-black tracking-tight mb-4">
						<Anchor className="h-4 w-4 text-primary" />
						优川七夜
					</Link>
					<Separator className="mb-4" />
					<nav className="flex flex-col gap-1 flex-1">
						{categories.map(cat => (
							<Link
								key={cat.id}
								href={`/blog/categories/${cat.slug}`}
								onClick={() => setOpen(false)}
								className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
							>
								{cat.name}
							</Link>
						))}
						<Link
							href="/blog/gallery"
							onClick={() => setOpen(false)}
							className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
						>
							图库
						</Link>
						<Separator className="my-2" />
						<Link
							href="/blog/archives"
							onClick={() => setOpen(false)}
							className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
						>
							归档
						</Link>
						<Link
							href="/blog/about"
							onClick={() => setOpen(false)}
							className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
						>
							关于
						</Link>
					</nav>
				</div>
			</SheetContent>
		</Sheet>
	)
}

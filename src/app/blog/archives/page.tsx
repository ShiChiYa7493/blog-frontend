import type { Metadata } from 'next';
import { getArticles } from "@/lib/api"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Archives',
};
import { Separator } from "@/components/ui/separator"
import { PageBanner } from "@/components/PageBanner"
import { PageTransition } from "@/components/PageTransition"
import { Archive } from "lucide-react"

interface Article {
	id: string
	slug: string
	title: string
	publishedAt: string
}

export default async function ArchivesPage() {
	let articles: Article[] = []
	try {
		const result = await getArticles({ page: 1 })
		articles = result.data || []
	} catch {}

	const grouped: Record<string, Article[]> = {}
	articles.forEach(article => {
		const year = new Date(article.publishedAt).getFullYear().toString()
		if (!grouped[year]) grouped[year] = []
		grouped[year].push(article)
	})

	const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

	return (
		<PageTransition>
			<div className="max-w-3xl mx-auto">
				<PageBanner title="归档" subtitle="按时间线浏览所有文章" icon={<Archive className="h-7 w-7 text-primary" />} />
				{years.map(year => (
					<div key={year} className="mb-8">
						<h2 className="text-xl font-bold mb-3 text-primary">{year}</h2>
						<Separator className="mb-4" />
						<ul className="space-y-3">
							{grouped[year].map(article => (
								<li key={article.id} className="flex items-baseline gap-4">
									<time className="text-sm text-primary/50 w-24 shrink-0">
										{new Date(article.publishedAt).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" })}
									</time>
									<Link href={`/blog/posts/${article.id}`} className="hover:text-muted-foreground transition-colors">
										{article.title}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</PageTransition>
	)
}

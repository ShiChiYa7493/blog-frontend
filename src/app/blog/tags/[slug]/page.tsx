/* eslint-disable @typescript-eslint/no-explicit-any */
import { getArticles, getTags } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';
import { PageBanner } from '@/components/PageBanner';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedCards, AnimatedCard } from '@/components/AnimatedCards';
import { Tag } from 'lucide-react';

export default async function TagPage({ params, searchParams }: { params: { slug: string }; searchParams: { page?: string } }) {
  let articles: any[] = [];
  let meta = { total: 0, page: 1, limit: 10, totalPages: 0 };
  let tagName = params.slug;

  try {
    const result = await getArticles({ tag: params.slug, page: Number(searchParams.page) || 1 });
    articles = result.data || [];
    meta = result.meta;
    const tags = await getTags();
    const tag = tags.find((t: any) => t.slug === params.slug);
    if (tag) tagName = tag.name;
  } catch {}

  return (
    <PageTransition>
      <PageBanner
        title={`# ${tagName}`}
        subtitle={`共 ${meta.total} 篇文章`}
        icon={<Tag className="h-7 w-7 text-primary" />}
      />
      <AnimatedCards>
        {articles.map((article: any) => (
          <AnimatedCard key={article.id}>
            <ArticleCard article={article} />
          </AnimatedCard>
        ))}
      </AnimatedCards>
      <Pagination meta={meta} basePath={`/blog/tags/${params.slug}`} />
    </PageTransition>
  );
}

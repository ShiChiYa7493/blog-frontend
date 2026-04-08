/* eslint-disable @typescript-eslint/no-explicit-any */
import { getArticles, getCategories } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';
import { PageBanner } from '@/components/PageBanner';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedCards, AnimatedCard } from '@/components/AnimatedCards';
import { FolderOpen } from 'lucide-react';

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }; searchParams: { page?: string } }) {
  let articles: any[] = [];
  let meta = { total: 0, page: 1, limit: 10, totalPages: 0 };
  let categoryName = params.slug;

  try {
    const result = await getArticles({ category: params.slug, page: Number(searchParams.page) || 1 });
    articles = result.data || [];
    meta = result.meta;
    const categories = await getCategories();
    const cat = categories.find((c: any) => c.slug === params.slug);
    if (cat) categoryName = cat.name;
  } catch {}

  return (
    <PageTransition>
      <PageBanner
        title={categoryName}
        subtitle={`共 ${meta.total} 篇文章`}
        icon={<FolderOpen className="h-7 w-7 text-primary" />}
      />
      <AnimatedCards>
        {articles.map((article: any) => (
          <AnimatedCard key={article.id}>
            <ArticleCard article={article} />
          </AnimatedCard>
        ))}
      </AnimatedCards>
      <Pagination meta={meta} basePath={`/blog/categories/${params.slug}`} />
    </PageTransition>
  );
}

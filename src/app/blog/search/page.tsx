import { searchArticles } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';
import { Input } from '@/components/ui/input';
import { PageBanner } from '@/components/PageBanner';
import { PageTransition } from '@/components/PageTransition';
import { Search as SearchIcon } from 'lucide-react';

interface Article {
  id: number;
  [key: string]: unknown;
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const q = searchParams.q || '';
  const page = Number(searchParams.page) || 1;

  let results = { data: [] as Article[], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  if (q) {
    try {
      results = await searchArticles(q, page);
    } catch {}
  }

  return (
    <PageTransition>
      <div>
        <PageBanner title="搜索" subtitle="探索所有文章" icon={<SearchIcon className="h-7 w-7 text-primary" />} />
        <form action="/blog/search" method="GET" className="mb-8">
          <Input type="text" name="q" defaultValue={q} placeholder="搜索文章..." className="w-full max-w-lg text-lg h-12 px-4 border-2 border-primary focus-visible:ring-primary" />
        </form>
        {q && (
          <p className="text-muted-foreground mb-6">{results.meta.total} 条结果，关键词：&ldquo;{q}&rdquo;</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.data.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        {q && <Pagination meta={results.meta} basePath={`/blog/search?q=${encodeURIComponent(q)}`} />}
      </div>
    </PageTransition>
  );
}

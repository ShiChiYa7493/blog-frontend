import { searchArticles } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';

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
    <div>
      <h1 className="text-3xl font-bold mb-4">Search</h1>
      <form action="/search" method="GET" className="mb-8">
        <input type="text" name="q" defaultValue={q} placeholder="Search articles..." className="w-full max-w-lg border-2 border-gray-900 px-4 py-3 text-lg focus:outline-none" />
      </form>
      {q && (
        <p className="text-gray-500 mb-6">{results.meta.total} results for &ldquo;{q}&rdquo;</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.data.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      {q && <Pagination meta={results.meta} basePath={`/search?q=${encodeURIComponent(q)}`} />}
    </div>
  );
}

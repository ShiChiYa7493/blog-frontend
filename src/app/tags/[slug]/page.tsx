import { getArticles, getTags } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';

interface Tag {
  slug: string;
  name: string;
}

interface Article {
  id: number;
  [key: string]: unknown;
}

export default async function TagPage({ params, searchParams }: { params: { slug: string }; searchParams: { page?: string } }) {
  let articles: Article[] = [];
  let meta = { total: 0, page: 1, limit: 10, totalPages: 0 };
  let tagName = params.slug;

  try {
    const result = await getArticles({ tag: params.slug, page: Number(searchParams.page) || 1 });
    articles = result.data || [];
    meta = result.meta;
    const tags: Tag[] = await getTags();
    const tag = tags.find((t) => t.slug === params.slug);
    if (tag) tagName = tag.name;
  } catch {}

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">#{tagName}</h1>
      <p className="text-gray-500 mb-8">{meta.total} articles</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      <Pagination meta={meta} basePath={`/tags/${params.slug}`} />
    </div>
  );
}

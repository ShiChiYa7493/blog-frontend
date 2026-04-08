import { getArticles, getCategories } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';

interface Category {
  slug: string;
  name: string;
}

interface Article {
  id: number;
  [key: string]: unknown;
}

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }; searchParams: { page?: string } }) {
  let articles: Article[] = [];
  let meta = { total: 0, page: 1, limit: 10, totalPages: 0 };
  let categoryName = params.slug;

  try {
    const result = await getArticles({ category: params.slug, page: Number(searchParams.page) || 1 });
    articles = result.data || [];
    meta = result.meta;
    const categories: Category[] = await getCategories();
    const cat = categories.find((c) => c.slug === params.slug);
    if (cat) categoryName = cat.name;
  } catch {}

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
      <p className="text-muted-foreground mb-8">{meta.total} 篇文章</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      <Pagination meta={meta} basePath={`/categories/${params.slug}`} />
    </div>
  );
}

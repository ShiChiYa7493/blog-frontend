/* eslint-disable @typescript-eslint/no-explicit-any */
import { getArticles } from '@/lib/api';
import HeroArticle from '@/components/HeroArticle';
import ArticleCard from '@/components/ArticleCard';

export default async function Home() {
  let articles: any[] = [];
  try {
    const result = await getArticles();
    articles = result.data || [];
  } catch {
    articles = [];
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-xl">No articles yet</p>
      </div>
    );
  }

  const [hero, ...rest] = articles;

  return (
    <div>
      <section className="mb-12">
        <HeroArticle article={hero} />
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((article: any) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}

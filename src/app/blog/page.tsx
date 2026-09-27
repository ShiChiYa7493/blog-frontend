/* eslint-disable @typescript-eslint/no-explicit-any */
import { getArticles } from '@/lib/api';
import HeroArticle from '@/components/HeroArticle';
import ArticleCard from '@/components/ArticleCard';
import BlogSidebar from '@/components/BlogSidebar';
import { Anchor } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';

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
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-xl">暂无文章</p>
        <p className="text-sm mt-2">前往管理后台开始写作</p>
      </div>
    );
  }

  const [hero, ...rest] = articles;

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Hero */}
        <section>
          <HeroArticle article={hero} />
        </section>

        {/* Main content + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Articles */}
          <div className="flex-1 min-w-0">
            {rest.length > 0 && (
              <section>
                <h2 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  最新文章
                  <Anchor className="h-3.5 w-3.5 text-primary/40" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rest.map((article: any) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getArticles } from '@/lib/api';
import HeroArticle from '@/components/HeroArticle';
import ArticleCard from '@/components/ArticleCard';
import { AnimatedCards, AnimatedCard } from '@/components/AnimatedCards';
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
      <div className="space-y-12">
        {/* Blog banner */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <section className="relative -mx-4 -mt-8 overflow-hidden rounded-b-2xl">
          <div className="relative h-48 md:h-64">
            <img
              src="/9a8690c0c9ed03ffafab0883a12fe55a.jpeg"
              alt="banner"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-4 left-6 md:bottom-6 md:left-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground drop-shadow-sm" style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}>
                优川七夜的博客
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Tech & Life · Weigh Anchor!</p>
            </div>
          </div>
        </section>

        <section>
          <HeroArticle article={hero} />
        </section>

        {rest.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-6 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              最新文章
              <Anchor className="h-4 w-4 text-primary/40" />
            </h2>
            <AnimatedCards>
              {rest.map((article: any, i: number) => (
                <AnimatedCard key={article.id}>
                  <ArticleCard article={article} index={i} />
                </AnimatedCard>
              ))}
            </AnimatedCards>
          </section>
        )}
      </div>
    </PageTransition>
  );
}

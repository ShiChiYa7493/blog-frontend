/* eslint-disable @typescript-eslint/no-explicit-any */
import { getArticles } from '@/lib/api';
import HeroArticle from '@/components/HeroArticle';
import ArticleCard from '@/components/ArticleCard';
import { AnimatedCards, AnimatedCard } from '@/components/AnimatedCards';
import { Anchor } from 'lucide-react';

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
        <p className="text-xl">No articles yet</p>
        <p className="text-sm mt-2">Start writing from the admin panel.</p>
      </div>
    );
  }

  const [hero, ...rest] = articles;

  return (
    <div className="space-y-12">
      <section>
        <HeroArticle article={hero} />
      </section>

      {rest.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-6 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            Latest
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
  );
}

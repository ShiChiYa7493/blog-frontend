/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { MotionDiv } from '@/components/MotionDiv';
import { Anchor } from 'lucide-react';

export default function HeroArticle({ article }: { article: any }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/posts/${article.slug}`} className="block group">
        <div className="relative aspect-[2.2/1] bg-muted rounded-lg overflow-hidden">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <span className="text-muted-foreground/30 text-8xl font-serif">{article.title[0]}</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <Badge variant="secondary" className="mb-3 bg-primary text-primary-foreground">
              <Anchor className="h-3 w-3 mr-1" />
              FEATURED
            </Badge>
            <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-white/70 mb-2">
              <span className="font-semibold text-white">{article.category?.name}</span>
              <span>&middot;</span>
              <time>{new Date(article.publishedAt).toLocaleDateString('zh-CN')}</time>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold leading-tight text-white group-hover:text-white/90 transition-colors">
              {article.title}
            </h2>
            {article.summary && (
              <p className="text-white/70 leading-relaxed line-clamp-2 mt-2 max-w-2xl text-sm md:text-base">
                {article.summary}
              </p>
            )}
          </div>
        </div>
      </Link>
    </MotionDiv>
  );
}

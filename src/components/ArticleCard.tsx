/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

function estimateReadingTime(summary?: string): string {
  // Rough estimate from summary length - actual content not available in list
  if (!summary) return '1';
  const chars = summary.length;
  return String(Math.max(1, Math.ceil(chars / 50)));
}

function NavalPattern({ title }: { title: string }) {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-primary/8 via-primary/4 to-background overflow-hidden">
      {/* Wave pattern */}
      <svg className="absolute bottom-0 left-0 right-0 text-primary/10" viewBox="0 0 400 80" preserveAspectRatio="none">
        <path d="M0,40 C50,20 100,60 150,40 C200,20 250,60 300,40 C350,20 400,60 400,40 L400,80 L0,80 Z" fill="currentColor" />
        <path d="M0,50 C60,30 120,70 180,50 C240,30 300,70 360,50 C380,40 400,50 400,50 L400,80 L0,80 Z" fill="currentColor" opacity="0.5" />
      </svg>
      {/* Anchor watermark */}
      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-primary/8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a3 3 0 0 0-3 3c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3Z" />
        <path d="M12 8v13" />
        <path d="M5 12H2l4.5 9L12 21l5.5 0L22 12h-3" />
        <path d="M7 15l5 6 5-6" />
      </svg>
      {/* Title initial */}
      <span className="absolute top-3 right-3 text-primary/15 text-3xl font-serif font-bold">
        {title[0]}
      </span>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ArticleCard({ article, index = 0 }: { article: any; index?: number }) {
  const readTime = estimateReadingTime(article.summary);

  return (
    <Link href={`/blog/posts/${article.id}`} className="block group">
      <div className="relative rounded-xl p-[1px] transition-all duration-500 bg-transparent group-hover:bg-gradient-to-br group-hover:from-primary/40 group-hover:via-primary/20 group-hover:to-transparent">
        <Card className="overflow-hidden border-border/50 group-hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full rounded-[11px]">
          {/* Cover image */}
          <div className="aspect-[16/9] bg-muted overflow-hidden">
            {article.coverImage ? (
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <NavalPattern title={article.title} />
            )}
          </div>
          <CardContent className="p-4">
            {/* Category + reading time */}
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-primary/30 text-primary">
                {article.category?.name}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
            {/* Title */}
            <h3 className="font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            {/* Summary */}
            {article.summary && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{article.summary}</p>
            )}
            {/* Tags + reading time */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex flex-wrap gap-1.5">
                {article.tags?.slice(0, 3).map((tag: any) => (
                  <span key={tag.id} className="text-[11px] text-muted-foreground/70">
                    #{tag.name}
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground/50">
                约 {readTime} 分钟
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}

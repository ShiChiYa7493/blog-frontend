/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ArticleCard({ article, index = 0 }: { article: any; index?: number }) {
  return (
    <Link href={`/posts/${article.slug}`} className="block group">
      <Card className="overflow-hidden border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
        {/* Cover image */}
        <div className="aspect-[16/9] bg-muted overflow-hidden">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <span className="text-muted-foreground/20 text-4xl font-serif">{article.title[0]}</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
              {article.category?.name}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
            </span>
          </div>
          <h3 className="font-bold leading-snug group-hover:text-muted-foreground transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{article.summary}</p>
          )}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {article.tags.slice(0, 3).map((tag: any) => (
                <span key={tag.id} className="text-[11px] text-muted-foreground/70">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

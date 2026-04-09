/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { getCategories, getTags } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Anchor, FolderOpen, Tag, Ship } from 'lucide-react';

export default async function BlogSidebar() {
  let categories: any[] = [];
  let tags: any[] = [];
  try {
    [categories, tags] = await Promise.all([getCategories(), getTags()]);
  } catch {}

  return (
    <aside className="space-y-6">
      {/* Profile card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 text-center">
          <img
            src="/avatar.jpg"
            alt="优川七夜"
            className="w-16 h-16 rounded-full mx-auto mb-3 ring-2 ring-primary/30"
          />
          <h3 className="font-bold">优川七夜</h3>
          <p className="text-xs text-muted-foreground mt-1">Yuga Shichiya</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Anchor className="h-3 w-3 text-primary/50" />
            <p className="text-xs text-muted-foreground italic">Weigh Anchor!</p>
          </div>
        </div>
      </Card>

      {/* Categories */}
      {categories.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold">分类</h3>
            </div>
            <div className="space-y-1">
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/blog/categories/${cat.slug}`}
                  className="flex items-center justify-between py-1.5 px-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-muted-foreground/50">{cat._count?.articles || 0}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold">标签</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag: any) => (
                <Link key={tag.id} href={`/blog/tags/${tag.slug}`}>
                  <Badge variant="outline" className="text-xs border-primary/20 hover:bg-primary/5 cursor-pointer">
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Naval decoration */}
      <Card className="border-dashed">
        <CardContent className="p-4 text-center">
          <Ship className="h-8 w-8 mx-auto text-primary/20 mb-2" />
          <p className="text-xs text-muted-foreground italic">
            今乗り越え 未来へと
          </p>
          <p className="text-[10px] text-muted-foreground/50 mt-1">
            跨越现今，前往未来
          </p>
        </CardContent>
      </Card>
    </aside>
  );
}

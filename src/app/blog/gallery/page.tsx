/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { getGalleryImages, getGalleryCategories } from '@/lib/api';
import { GalleryGrid } from '@/components/GalleryGrid';
import { Images } from 'lucide-react';
import type { Metadata } from 'next';
import { PageBanner } from '@/components/PageBanner';
import { PageTransition } from '@/components/PageTransition';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Gallery',
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  let images: any[] = [];
  let categories: any[] = [];
  try {
    const [imgRes, catRes] = await Promise.all([
      getGalleryImages(1, 100, category),
      getGalleryCategories(),
    ]);
    images = imgRes.data || [];
    categories = catRes || [];
  } catch {
    images = [];
    categories = [];
  }

  const activeCat = categories.find((c) => c.slug === category);
  const subtitle = activeCat ? `${activeCat.name} · 共 ${images.length} 张图片` : `共 ${images.length} 张图片`;

  return (
    <PageTransition>
      <div>
        <PageBanner title="图库" subtitle={subtitle} icon={<Images className="h-7 w-7 text-primary" />} />

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 px-1">
            <Link
              href="/blog/gallery"
              className={cn(
                'px-3 py-1 text-sm rounded-full border transition-colors',
                !category
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              全部
            </Link>
            {categories.map((c: any) => (
              <Link
                key={c.id}
                href={`/blog/gallery?category=${encodeURIComponent(c.slug)}`}
                className={cn(
                  'px-3 py-1 text-sm rounded-full border transition-colors',
                  category === c.slug
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {c.name}
                {typeof c._count?.images === 'number' && (
                  <span className="ml-1 opacity-70">({c._count.images})</span>
                )}
              </Link>
            ))}
          </div>
        )}

        {images.length === 0 ? (
          <p className="text-center py-20 text-muted-foreground">暂无图片</p>
        ) : (
          <GalleryGrid images={images} />
        )}
      </div>
    </PageTransition>
  );
}

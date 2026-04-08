/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getGalleryImages } from '@/lib/api';
import { GalleryGrid } from '@/components/GalleryGrid';
import { Images } from 'lucide-react';
import type { Metadata } from 'next';
import { PageBanner } from '@/components/PageBanner';
import { PageTransition } from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'Gallery',
};

export default async function GalleryPage() {
  let images: any[] = [];
  try {
    const result = await getGalleryImages(1, 100);
    images = result.data || [];
  } catch {
    images = [];
  }

  return (
    <PageTransition>
      <div>
        <PageBanner title="图库" subtitle={`共 ${images.length} 张图片`} icon={<Images className="h-7 w-7 text-primary" />} />

        {images.length === 0 ? (
          <p className="text-center py-20 text-muted-foreground">暂无图片</p>
        ) : (
          <GalleryGrid images={images} />
        )}
      </div>
    </PageTransition>
  );
}

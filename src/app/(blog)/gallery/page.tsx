/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getGalleryImages } from '@/lib/api';
import { GalleryGrid } from '@/components/GalleryGrid';
import { Anchor } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '图库',
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
    <div>
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold">图库</h1>
        <Anchor className="h-5 w-5 text-primary/40" />
      </div>

      {images.length === 0 ? (
        <p className="text-center py-20 text-muted-foreground">暂无图片</p>
      ) : (
        <GalleryGrid images={images} />
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type GalleryImage = {
  id: number;
  url: string;
  title: string | null;
  description: string | null;
};

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  };

  const goPrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  };

  return (
    <>
      {/* Masonry-style grid using CSS columns */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="break-inside-avoid cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={image.url}
                alt={image.title || ''}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm truncate">{image.title}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="dialog"
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Prev button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10 h-12 w-12"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedIndex].url}
                alt={images[selectedIndex].title || ''}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              {(images[selectedIndex].title || images[selectedIndex].description) && (
                <div className="mt-3 text-center">
                  {images[selectedIndex].title && (
                    <p className="text-white font-medium">{images[selectedIndex].title}</p>
                  )}
                  {images[selectedIndex].description && (
                    <p className="text-white/60 text-sm mt-1">{images[selectedIndex].description}</p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Next button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10 h-12 w-12"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

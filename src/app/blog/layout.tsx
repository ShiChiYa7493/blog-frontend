import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReadingProgress } from '@/components/ReadingProgress';
import { ScrollToTop } from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: {
    default: 'Blog',
    template: '%s | 优川七夜',
  },
  description: '优川七夜的技术与生活博客',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReadingProgress />
      {/* Full-page background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/9a8690c0c9ed03ffafab0883a12fe55a.jpeg')" }}
      />
      <div className="fixed inset-0 z-0 bg-background/85 dark:bg-background/92" />
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <ScrollToTop />
    </>
  );
}

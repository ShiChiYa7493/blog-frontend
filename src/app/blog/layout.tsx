import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReadingProgress } from '@/components/ReadingProgress';
import { ScrollToTop } from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: {
    default: '博客',
    template: '%s | 优川七夜的博客',
  },
  description: '优川七夜的技术与生活博客',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReadingProgress />
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

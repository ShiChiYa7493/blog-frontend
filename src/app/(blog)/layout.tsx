import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}

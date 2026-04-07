import Link from 'next/link';
import { getCategories } from '@/lib/api';

export default async function Header() {
  let categories = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return (
    <header className="border-b-2 border-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight">
            SHICHIYA
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="hover:text-gray-600 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/archives" className="hover:text-gray-600 transition-colors">
              Archives
            </Link>
            <Link href="/about" className="hover:text-gray-600 transition-colors">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

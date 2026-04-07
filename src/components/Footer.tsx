import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Shichiya. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/api/rss" className="hover:text-gray-900">RSS</Link>
            <Link href="/about" className="hover:text-gray-900">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

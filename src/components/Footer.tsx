import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="mt-16">
      <Separator />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Shichiya. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/api/rss" className="hover:text-foreground transition-colors">RSS</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

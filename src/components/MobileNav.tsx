'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Menu } from 'lucide-react';

interface MobileNavProps {
  categories: { id: number; name: string; slug: string }[];
}

export function MobileNav({ categories }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={`${buttonVariants({ variant: 'ghost', size: 'icon' })} md:hidden`}>
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="flex flex-col gap-4 mt-8">
          <Link href="/" onClick={() => setOpen(false)} className="text-xl font-black tracking-tight">
            SHICHIYA
          </Link>
          <Separator />
          <nav className="flex flex-col gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Separator />
            <Link href="/archives" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Archives
            </Link>
            <Link href="/about" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

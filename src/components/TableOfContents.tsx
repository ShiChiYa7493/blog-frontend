'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Read headings from rendered DOM so IDs match rehype-slug exactly
    const collect = () => {
      const nodes = document.querySelectorAll<HTMLElement>('article h2[id], article h3[id], article h4[id]');
      const items: TocItem[] = [];
      nodes.forEach((el) => {
        items.push({
          id: el.id,
          text: el.textContent || '',
          level: Number(el.tagName.substring(1)),
        });
      });
      setHeadings(items);
    };
    collect();
    const t = setTimeout(collect, 100);
    return () => clearTimeout(t);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav className="hidden xl:block fixed right-[max(1rem,calc((100vw-72rem)/2-14rem))] top-24 w-56">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">目录</p>
      <ul className="space-y-1.5 text-sm border-l border-border">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (!el) return;
                const headerOffset = 80;
                const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
                window.scrollTo({ top, behavior: 'smooth' });
                history.replaceState(null, '', `#${h.id}`);
                setActiveId(h.id);
              }}
              className={cn(
                'block py-0.5 transition-colors border-l-2 -ml-px',
                h.level === 2 ? 'pl-3' : h.level === 3 ? 'pl-6' : 'pl-9',
                activeId === h.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

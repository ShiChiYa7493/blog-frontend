import type { Metadata } from 'next';
import { PageBanner } from '@/components/PageBanner';
import { PageTransition } from '@/components/PageTransition';
import { User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto">
        <PageBanner title="关于" subtitle="优川七夜 · Yuga Shichiya" icon={<User className="h-7 w-7 text-primary" />} />
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p>Hi, I&apos;m <strong>优川七夜 (Yuga Shichiya)</strong>. Welcome to my blog where I share thoughts on technology and life.</p>
          <p>今乗り越え 未来へと Weigh Anchor! — 跨越现今，前往未来，起锚吧！</p>
          <p>This blog is built with Next.js, NestJS, and PostgreSQL.</p>
        </div>
      </div>
    </PageTransition>
  );
}

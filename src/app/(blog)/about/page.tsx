import { Anchor } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold">关于</h1>
        <Anchor className="h-5 w-5 text-primary/40" />
      </div>
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p>Hi, I&apos;m <strong>优川七夜 (Yuga Shichiya)</strong>. Welcome to my blog where I share thoughts on technology and life.</p>
        <p>今乗り越え 未来へと Weigh Anchor! — 跨越现今，前往未来，起锚吧！</p>
        <p>This blog is built with Next.js, NestJS, and PostgreSQL.</p>
      </div>
    </div>
  );
}

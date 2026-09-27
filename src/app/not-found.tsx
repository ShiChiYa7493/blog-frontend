/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <img
        src="/IMG_7439.png"
        alt="404"
        className="w-48 h-48 object-contain rounded-2xl mb-8 shadow-lg"
      />
      <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
      <p className="text-lg text-muted-foreground mb-1">
        Страница не найдена...
      </p>
      <p className="text-sm text-muted-foreground/60 mb-8">
        这个页面似乎漂走了...
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
      >
        返回首页
      </Link>
    </div>
  );
}

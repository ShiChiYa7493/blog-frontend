/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

export default function HeroArticle({ article }: { article: any }) {
  return (
    <Link href={`/posts/${article.slug}`} className="block group">
      <div className="relative aspect-[2/1] bg-gray-100 rounded-sm overflow-hidden mb-4">
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-gray-300 text-6xl font-serif">{article.title[0]}</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-gray-500">
          <span className="font-semibold text-gray-900">{article.category?.name}</span>
          <span>&middot;</span>
          <time>{new Date(article.publishedAt).toLocaleDateString('zh-CN')}</time>
        </div>
        <h2 className="text-3xl font-bold leading-tight group-hover:text-gray-600 transition-colors">
          {article.title}
        </h2>
        {article.summary && (
          <p className="text-gray-600 leading-relaxed line-clamp-2">{article.summary}</p>
        )}
      </div>
    </Link>
  );
}

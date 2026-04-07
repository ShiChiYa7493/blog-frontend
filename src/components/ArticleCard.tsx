/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';

export default function ArticleCard({ article }: { article: any }) {
  return (
    <Link href={`/posts/${article.slug}`} className="block group">
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500 mb-2">
          <span className="font-semibold text-gray-900">{article.category?.name}</span>
          <span>&middot;</span>
          <time>{new Date(article.publishedAt).toLocaleDateString('zh-CN')}</time>
        </div>
        <h3 className="text-lg font-bold mb-1 group-hover:text-gray-600 transition-colors">
          {article.title}
        </h3>
        {article.summary && (
          <p className="text-sm text-gray-600 line-clamp-2">{article.summary}</p>
        )}
        <div className="flex gap-2 mt-2">
          {article.tags?.map((tag: any) => (
            <span key={tag.id} className="text-xs text-gray-400">#{tag.name}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

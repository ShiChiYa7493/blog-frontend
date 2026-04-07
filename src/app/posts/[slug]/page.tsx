import { getArticle } from '@/lib/api';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import CommentSection from '@/components/CommentSection';
import Link from 'next/link';
import Image from 'next/image';

interface Tag {
  id: number;
  name: string;
  slug: string;
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  let article;
  try {
    article = await getArticle(params.slug);
  } catch {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-gray-500 mb-3">
          <Link href={`/categories/${article.category?.slug}`} className="font-semibold text-gray-900 hover:text-gray-600">
            {article.category?.name}
          </Link>
          <span>&middot;</span>
          <time>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('zh-CN')}</time>
          <span>&middot;</span>
          <span>{article.viewCount} views</span>
        </div>
        <h1 className="text-4xl font-bold leading-tight mb-4">{article.title}</h1>
        {article.summary && (
          <p className="text-lg text-gray-600 leading-relaxed">{article.summary}</p>
        )}
        <div className="flex gap-2 mt-3">
          {article.tags?.map((tag: Tag) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`} className="text-xs border border-gray-300 px-2 py-1 rounded-sm hover:bg-gray-50">
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
      {article.coverImage && (
        <div className="mb-8 relative w-full aspect-video">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover rounded-sm" />
        </div>
      )}
      <MarkdownRenderer content={article.content} />
      <CommentSection slug={params.slug} />
    </article>
  );
}

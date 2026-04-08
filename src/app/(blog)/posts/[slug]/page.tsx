import { getArticle } from '@/lib/api';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import CommentSection from '@/components/CommentSection';
import { MotionDiv } from '@/components/MotionDiv';
import { Badge } from '@/components/ui/badge';
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
      <MotionDiv
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground mb-3">
          <Link href={`/categories/${article.category?.slug}`} className="font-semibold text-primary hover:text-primary/70">
            {article.category?.name}
          </Link>
          <span>&middot;</span>
          <time>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('zh-CN')}</time>
          <span>&middot;</span>
          <span>{article.viewCount} 阅读</span>
        </div>
        <h1 className="text-4xl font-bold leading-tight mb-4">{article.title}</h1>
        {article.summary && (
          <p className="text-lg text-muted-foreground leading-relaxed">{article.summary}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {article.tags?.map((tag: Tag) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`}>
              <Badge variant="outline" className="border-primary/30">{tag.name}</Badge>
            </Link>
          ))}
        </div>
      </MotionDiv>
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

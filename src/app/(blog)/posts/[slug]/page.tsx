/* eslint-disable @next/next/no-img-element */
import { getArticle, getArticles } from '@/lib/api';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import CommentSection from '@/components/CommentSection';
import { TableOfContents } from '@/components/TableOfContents';
import { MotionDiv } from '@/components/MotionDiv';
import { Badge } from '@/components/ui/badge';
import { estimateReadingTime } from '@/lib/reading-time';
import Link from 'next/link';
import { Clock, Eye, ChevronLeft, ChevronRight, Anchor } from 'lucide-react';

interface Tag {
  id: number;
  name: string;
  slug: string;
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let article: any;
  try {
    article = await getArticle(params.slug);
  } catch {
    notFound();
  }

  const readingTime = estimateReadingTime(article.content);

  // Fetch prev/next articles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prevArticle: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let nextArticle: any = null;
  try {
    const { data: articles } = await getArticles({ page: 1 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentIndex = articles.findIndex((a: any) => a.slug === params.slug);
    if (currentIndex > 0) nextArticle = articles[currentIndex - 1];
    if (currentIndex < articles.length - 1) prevArticle = articles[currentIndex + 1];
  } catch {}

  return (
    <div className="relative">
      {/* TOC sidebar */}
      <TableOfContents content={article.content} />

      <article className="max-w-3xl mx-auto">
        {/* Hero cover */}
        {article.coverImage && (
          <MotionDiv
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="-mx-4 md:-mx-8 mb-8"
          >
            <div className="relative aspect-[2.2/1] overflow-hidden rounded-lg">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </MotionDiv>
        )}

        {/* Article header */}
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
          className="mb-8"
        >
          {/* Category + meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <Link href={`/categories/${article.category?.slug}`} className="font-semibold text-primary hover:text-primary/70 uppercase tracking-wider">
              {article.category?.name}
            </Link>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString('zh-CN')}
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {article.viewCount} 阅读
            </span>
            <span className="text-border">|</span>
            <span>约 {readingTime} 分钟</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{article.title}</h1>

          {/* Summary */}
          {article.summary && (
            <p className="text-lg text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4 italic">
              {article.summary}
            </p>
          )}

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map((tag: Tag) => (
                <Link key={tag.id} href={`/tags/${tag.slug}`}>
                  <Badge variant="outline" className="border-primary/30 hover:bg-primary/5">{tag.name}</Badge>
                </Link>
              ))}
            </div>
          )}
        </MotionDiv>

        {/* Anchor divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <Anchor className="h-3 w-3 text-primary/30" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        {/* Content */}
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <MarkdownRenderer content={article.content} />
        </MotionDiv>

        {/* Anchor divider */}
        <div className="flex items-center gap-3 my-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <Anchor className="h-3 w-3 text-primary/30" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        {/* Prev / Next navigation */}
        {(prevArticle || nextArticle) && (
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
          >
            {prevArticle ? (
              <Link
                href={`/posts/${prevArticle.slug}`}
                className="group flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">上一篇</p>
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{prevArticle.title}</p>
                </div>
              </Link>
            ) : <div />}
            {nextArticle ? (
              <Link
                href={`/posts/${nextArticle.slug}`}
                className="group flex items-center justify-end gap-3 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-right"
              >
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">下一篇</p>
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{nextArticle.title}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary shrink-0" />
              </Link>
            ) : <div />}
          </MotionDiv>
        )}

        {/* Comments */}
        <CommentSection slug={params.slug} />
      </article>
    </div>
  );
}

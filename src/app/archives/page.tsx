import { getArticles } from '@/lib/api';
import Link from 'next/link';

interface Article {
  id: number;
  slug: string;
  title: string;
  publishedAt: string;
}

export default async function ArchivesPage() {
  let articles: Article[] = [];
  try {
    const result = await getArticles({ page: 1 });
    articles = result.data || [];
  } catch {}

  const grouped: Record<string, Article[]> = {};
  articles.forEach((article) => {
    const year = new Date(article.publishedAt).getFullYear().toString();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(article);
  });

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Archives</h1>
      {years.map((year) => (
        <div key={year} className="mb-8">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">{year}</h2>
          <ul className="space-y-3">
            {grouped[year].map((article) => (
              <li key={article.id} className="flex items-baseline gap-4">
                <time className="text-sm text-gray-400 w-24 shrink-0">
                  {new Date(article.publishedAt).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                </time>
                <Link href={`/posts/${article.slug}`} className="hover:text-gray-600 transition-colors">
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

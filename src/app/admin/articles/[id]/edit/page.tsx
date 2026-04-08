'use client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ArticleEditor from '@/components/admin/ArticleEditor';
import { getAdminCategories, getAdminTags } from '@/lib/admin-api';

export default function EditArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<AnyRecord | null>(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = params.id;
    // Fetch article by getting it from the public slug endpoint
    // We need the article content, so we need to find the slug first
    // For simplicity, fetch from admin articles list won't have content
    // So we fetch via a direct API call that includes content
    const token = localStorage.getItem('admin_token');
    Promise.all([
      fetch(`/api/admin/articles?page=1&limit=100`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).then(r => r.json()).then((data: AnyRecord) => {
        const art = data.data?.find((a: AnyRecord) => a.id === Number(id));
        if (art) {
          // The list endpoint omits content, fetch full article by slug
          return fetch(`/api/articles/${art.slug}`).then(r => r.json());
        }
        return null;
      }),
      getAdminCategories(),
      getAdminTags(),
    ]).then(([art, cats, tgs]) => {
      setArticle(art);
      setCategories(cats);
      setTags(tgs);
      setLoaded(true);
    });
  }, [params.id]);

  if (!loaded) return <p className="text-muted-foreground">加载中...</p>;
  if (!article) return <p className="text-muted-foreground">文章未找到</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">编辑文章</h1>
      <ArticleEditor article={article} categories={categories} tags={tags} />
    </div>
  );
}

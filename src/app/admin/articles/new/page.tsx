'use client';

import { useEffect, useState } from 'react';
import ArticleEditor from '@/components/admin/ArticleEditor';
import { getAdminCategories, getAdminTags } from '@/lib/admin-api';

export default function NewArticlePage() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getAdminCategories(), getAdminTags()]).then(([cats, tgs]) => {
      setCategories(cats);
      setTags(tgs);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return <p className="text-muted-foreground">加载中...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">新建文章</h1>
      <ArticleEditor categories={categories} tags={tags} />
    </div>
  );
}

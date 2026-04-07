'use client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getAdminArticles, deleteArticle } from '@/lib/admin-api';

export default function AdminArticlesPage() {
  const [data, setData] = useState<AnyRecord | null>(null);
  const [page, setPage] = useState(1);

  const load = useCallback(() => getAdminArticles(page).then(setData), [page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this article?')) return;
    await deleteArticle(id);
    load();
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link href="/admin/articles/new" className="bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-700">New Article</Link>
      </div>
      <table className="w-full bg-white border border-gray-200">
        <thead>
          <tr className="border-b text-left text-sm text-gray-500">
            <th className="p-3">Title</th><th className="p-3">Category</th><th className="p-3">Status</th><th className="p-3">Views</th><th className="p-3">Date</th><th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((article: AnyRecord) => (
            <tr key={article.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">{article.title}</td>
              <td className="p-3 text-sm text-gray-500">{article.category?.name}</td>
              <td className="p-3">
                <span className={`text-xs px-2 py-1 ${article.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{article.status}</span>
              </td>
              <td className="p-3 text-sm text-gray-500">{article.viewCount}</td>
              <td className="p-3 text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString('zh-CN')}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <Link href={`/admin/articles/${article.id}/edit`} className="text-sm text-blue-600 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(article.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center gap-2 mt-4">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border text-sm disabled:opacity-30">Prev</button>
        <span className="px-3 py-1 text-sm">{data.meta.page} / {data.meta.totalPages}</span>
        <button disabled={page >= data.meta.totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border text-sm disabled:opacity-30">Next</button>
      </div>
    </div>
  );
}

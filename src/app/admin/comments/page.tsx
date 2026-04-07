'use client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

import { useEffect, useState, useCallback } from 'react';
import { getAdminComments, updateCommentStatus, deleteComment } from '@/lib/admin-api';

export default function AdminCommentsPage() {
  const [data, setData] = useState<AnyRecord | null>(null);
  const [page, setPage] = useState(1);

  const load = useCallback(() => getAdminComments(page).then(setData), [page]);
  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id: number, status: string) => {
    await updateCommentStatus(id, status);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this comment?')) return;
    await deleteComment(id);
    load();
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Comments</h1>
      <div className="space-y-4">
        {data.data.map((comment: AnyRecord) => (
          <div key={comment.id} className="bg-white border p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-medium">{comment.nickname}</span>
                <span className="text-sm text-gray-400">{comment.email}</span>
                <span className={`text-xs px-2 py-0.5 ${comment.status === 'APPROVED' ? 'bg-green-100 text-green-800' : comment.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{comment.status}</span>
              </div>
              <span className="text-sm text-gray-400">{new Date(comment.createdAt).toLocaleString('zh-CN')}</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">on <span className="font-medium text-gray-700">{comment.article?.title}</span></p>
            <p className="text-sm mb-3">{comment.content}</p>
            <div className="flex gap-2">
              {comment.status !== 'APPROVED' && <button onClick={() => handleStatus(comment.id, 'APPROVED')} className="text-xs text-green-600 border border-green-300 px-2 py-1">Approve</button>}
              {comment.status !== 'REJECTED' && <button onClick={() => handleStatus(comment.id, 'REJECTED')} className="text-xs text-yellow-600 border border-yellow-300 px-2 py-1">Reject</button>}
              <button onClick={() => handleDelete(comment.id)} className="text-xs text-red-600 border border-red-300 px-2 py-1">Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-4">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border text-sm disabled:opacity-30">Prev</button>
        <span className="px-3 py-1 text-sm">{data.meta.page} / {data.meta.totalPages}</span>
        <button disabled={page >= data.meta.totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border text-sm disabled:opacity-30">Next</button>
      </div>
    </div>
  );
}

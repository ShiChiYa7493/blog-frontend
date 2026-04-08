'use client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getAdminComments, updateCommentStatus, deleteComment } from '@/lib/admin-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function StatusBadge({ status }: { status: string }) {
  if (status === 'APPROVED') {
    return <Badge className="bg-primary/10 text-primary border-0">{status}</Badge>;
  }
  if (status === 'REJECTED') {
    return <Badge variant="destructive">{status}</Badge>;
  }
  return <Badge variant="secondary">{status}</Badge>;
}

export default function AdminCommentsPage() {
  const [data, setData] = useState<AnyRecord | null>(null);
  const [page, setPage] = useState(1);

  const load = useCallback(() => getAdminComments(page).then(setData), [page]);
  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id: number, status: string) => {
    await updateCommentStatus(id, status);
    toast.success(status === 'APPROVED' ? '评论已通过' : '评论已拒绝');
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这条评论？')) return;
    await deleteComment(id);
    toast.success('评论已删除');
    load();
  };

  if (!data) return <p className="text-muted-foreground">加载中...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">评论管理</h1>
      <div className="space-y-4">
        {data.data.map((comment: AnyRecord) => (
          <Card key={comment.id}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{comment.nickname}</span>
                  <span className="text-sm text-muted-foreground">{comment.email}</span>
                  <StatusBadge status={comment.status} />
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleString('zh-CN')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                评论于 <span className="font-medium text-foreground">{comment.article?.title}</span>
              </p>
              <p className="text-sm mb-3">{comment.content}</p>
              <div className="flex gap-2">
                {comment.status !== 'APPROVED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatus(comment.id, 'APPROVED')}
                    className="text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
                  >
                    通过
                  </Button>
                )}
                {comment.status !== 'REJECTED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatus(comment.id, 'REJECTED')}
                  >
                    拒绝
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={() => handleDelete(comment.id)}>
                  删除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-4">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</Button>
        <span className="px-3 py-1 text-sm text-muted-foreground">{data.meta.page} / {data.meta.totalPages}</span>
        <Button variant="outline" size="sm" disabled={page >= data.meta.totalPages} onClick={() => setPage(page + 1)}>下一页</Button>
      </div>
    </div>
  );
}

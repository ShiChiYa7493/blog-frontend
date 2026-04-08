'use client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { getAdminArticles, deleteArticle } from '@/lib/admin-api';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

export default function AdminArticlesPage() {
  const [data, setData] = useState<AnyRecord | null>(null);
  const [page, setPage] = useState(1);

  const load = useCallback(() => getAdminArticles(page).then(setData), [page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这篇文章？')) return;
    await deleteArticle(id);
    toast.success('Article deleted');
    load();
  };

  if (!data) return <p className="text-muted-foreground">加载中...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link href="/admin/articles/new" className={buttonVariants({ size: 'sm' })}>新建文章</Link>
      </div>
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>标题</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>浏览</TableHead>
              <TableHead>日期</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((article: AnyRecord) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell className="text-muted-foreground">{article.category?.name}</TableCell>
                <TableCell>
                  {article.status === 'PUBLISHED' ? (
                    <Badge className="bg-primary/10 text-primary border-0">{article.status}</Badge>
                  ) : (
                    <Badge variant="secondary">{article.status}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{article.viewCount}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className={buttonVariants({ variant: 'outline', size: 'sm' })}
                    >
                      编辑
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                    >
                      删除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</Button>
        <span className="px-3 py-1 text-sm text-muted-foreground">{data.meta.page} / {data.meta.totalPages}</span>
        <Button variant="outline" size="sm" disabled={page >= data.meta.totalPages} onClick={() => setPage(page + 1)}>下一页</Button>
      </div>
    </div>
  );
}

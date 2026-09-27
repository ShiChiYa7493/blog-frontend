'use client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '@/lib/admin-api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AnyRecord[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => getAdminCategories().then(setCategories);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateCategory(editingId, { name, slug });
      toast.success('Category updated');
      setEditingId(null);
    } else {
      await createCategory({ name, slug });
      toast.success('Category created');
    }
    setName(''); setSlug('');
    load();
  };

  const handleEdit = (cat: AnyRecord) => { setEditingId(cat.id); setName(cat.name); setSlug(cat.slug); };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除这个分类？')) return;
    await deleteCategory(id);
    toast.success('Category deleted');
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">分类管理</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <Input type="text" placeholder="名称" value={name} onChange={(e) => setName(e.target.value)} required className="max-w-[200px]" />
        <Input type="text" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="max-w-[200px]" />
        <Button type="submit">{editingId ? '更新' : '添加'}</Button>
        {editingId && (
          <Button type="button" variant="outline" onClick={() => { setEditingId(null); setName(''); setSlug(''); }}>
            取消
          </Button>
        )}
      </form>
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>文章数</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat: AnyRecord) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                <TableCell>{cat._count?.articles || 0}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(cat)}>编辑</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(cat.id)}>删除</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

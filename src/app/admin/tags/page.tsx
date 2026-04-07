'use client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getAdminTags, createTag, updateTag, deleteTag } from '@/lib/admin-api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

export default function AdminTagsPage() {
  const [tags, setTags] = useState<AnyRecord[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = () => getAdminTags().then(setTags);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateTag(editingId, { name, slug });
      toast.success('Tag updated');
      setEditingId(null);
    } else {
      await createTag({ name, slug });
      toast.success('Tag created');
    }
    setName(''); setSlug('');
    load();
  };

  const handleEdit = (tag: AnyRecord) => { setEditingId(tag.id); setName(tag.name); setSlug(tag.slug); };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this tag?')) return;
    await deleteTag(id);
    toast.success('Tag deleted');
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tags</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="max-w-[200px]" />
        <Input type="text" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="max-w-[200px]" />
        <Button type="submit">{editingId ? 'Update' : 'Add'}</Button>
        {editingId && (
          <Button type="button" variant="outline" onClick={() => { setEditingId(null); setName(''); setSlug(''); }}>
            Cancel
          </Button>
        )}
      </form>
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag: AnyRecord) => (
              <TableRow key={tag.id}>
                <TableCell>{tag.name}</TableCell>
                <TableCell className="text-muted-foreground">{tag.slug}</TableCell>
                <TableCell>{tag._count?.articles || 0}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(tag)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(tag.id)}>Delete</Button>
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

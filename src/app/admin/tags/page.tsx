'use client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

import { useEffect, useState } from 'react';
import { getAdminTags, createTag, updateTag, deleteTag } from '@/lib/admin-api';

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
      setEditingId(null);
    } else {
      await createTag({ name, slug });
    }
    setName(''); setSlug('');
    load();
  };

  const handleEdit = (tag: AnyRecord) => { setEditingId(tag.id); setName(tag.name); setSlug(tag.slug); };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this tag?')) return;
    await deleteTag(id);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tags</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="border px-3 py-2 text-sm" />
        <input type="text" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="border px-3 py-2 text-sm" />
        <button type="submit" className="bg-gray-900 text-white px-4 py-2 text-sm">{editingId ? 'Update' : 'Add'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setName(''); setSlug(''); }} className="border px-4 py-2 text-sm">Cancel</button>}
      </form>
      <table className="w-full bg-white border">
        <thead><tr className="border-b text-left text-sm text-gray-500"><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">Articles</th><th className="p-3">Actions</th></tr></thead>
        <tbody>
          {tags.map((tag: AnyRecord) => (
            <tr key={tag.id} className="border-b">
              <td className="p-3">{tag.name}</td>
              <td className="p-3 text-sm text-gray-500">{tag.slug}</td>
              <td className="p-3 text-sm">{tag._count?.articles || 0}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => handleEdit(tag)} className="text-sm text-blue-600">Edit</button>
                <button onClick={() => handleDelete(tag.id)} className="text-sm text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

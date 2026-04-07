'use client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

import { useEffect, useState } from 'react';
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '@/lib/admin-api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AnyRecord[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = () => getAdminCategories().then(setCategories);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateCategory(editingId, { name, slug });
      setEditingId(null);
    } else {
      await createCategory({ name, slug });
    }
    setName(''); setSlug('');
    load();
  };

  const handleEdit = (cat: AnyRecord) => { setEditingId(cat.id); setName(cat.name); setSlug(cat.slug); };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    await deleteCategory(id);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="border px-3 py-2 text-sm" />
        <input type="text" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="border px-3 py-2 text-sm" />
        <button type="submit" className="bg-gray-900 text-white px-4 py-2 text-sm">{editingId ? 'Update' : 'Add'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setName(''); setSlug(''); }} className="border px-4 py-2 text-sm">Cancel</button>}
      </form>
      <table className="w-full bg-white border">
        <thead><tr className="border-b text-left text-sm text-gray-500"><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">Articles</th><th className="p-3">Actions</th></tr></thead>
        <tbody>
          {categories.map((cat: AnyRecord) => (
            <tr key={cat.id} className="border-b">
              <td className="p-3">{cat.name}</td>
              <td className="p-3 text-sm text-gray-500">{cat.slug}</td>
              <td className="p-3 text-sm">{cat._count?.articles || 0}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => handleEdit(cat)} className="text-sm text-blue-600">Edit</button>
                <button onClick={() => handleDelete(cat.id)} className="text-sm text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

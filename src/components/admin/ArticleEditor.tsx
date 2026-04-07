'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { createArticle, updateArticle, uploadImage } from '@/lib/admin-api';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

interface Props {
  article?: AnyRecord;
  categories: AnyRecord[];
  tags: AnyRecord[];
}

export default function ArticleEditor({ article, categories, tags }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [summary, setSummary] = useState(article?.summary || '');
  const [content, setContent] = useState(article?.content || '');
  const [coverImage, setCoverImage] = useState(article?.coverImage || '');
  const [categoryId, setCategoryId] = useState<number>(article?.categoryId || categories[0]?.id || 0);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(article?.tags?.map((t: AnyRecord) => t.id) || []);
  const [status, setStatus] = useState(article?.status || 'DRAFT');
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadImage(file);
    setCoverImage(result.url);
  };

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = { title, slug, summary, content, coverImage, status, categoryId, tagIds: selectedTagIds };
    try {
      if (article) {
        await updateArticle(article.id, data);
      } else {
        await createArticle(data);
      }
      router.push('/admin/articles');
    } catch {
      alert('Failed to save article');
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900" />
        <input type="text" placeholder="Slug (URL-safe)" value={slug} onChange={(e) => setSlug(e.target.value)} required className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900" />
      </div>

      <input type="text" placeholder="Summary (optional)" value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900" />

      <div className="grid grid-cols-3 gap-4">
        <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="border border-gray-300 px-3 py-2">
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 px-3 py-2">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Cover:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
        </div>
      </div>

      {coverImage && (
        <div className="flex items-center gap-2">
          <Image src={coverImage} alt="cover" width={64} height={64} className="h-16 w-auto rounded" />
          <button type="button" onClick={() => setCoverImage('')} className="text-sm text-red-500">Remove</button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)} className={`text-xs px-3 py-1 border rounded-sm ${selectedTagIds.includes(tag.id) ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 hover:bg-gray-50'}`}>
            {tag.name}
          </button>
        ))}
      </div>

      <div data-color-mode="light">
        <MDEditor value={content} onChange={(val) => setContent(val || '')} height={500} />
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={saving} className="bg-gray-900 text-white px-6 py-2 hover:bg-gray-700 disabled:opacity-50">
          {saving ? 'Saving...' : article ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={() => router.back()} className="border border-gray-300 px-6 py-2 hover:bg-gray-50">Cancel</button>
      </div>
    </form>
  );
}

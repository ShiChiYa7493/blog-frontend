'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { toast } from 'sonner';
import { createArticle, updateArticle, uploadImage } from '@/lib/admin-api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const [categoryId, setCategoryId] = useState<string>(article?.categoryId || categories[0]?.id || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(article?.tags?.map((t: AnyRecord) => t.id) || []);
  const [status, setStatus] = useState(article?.status || 'DRAFT');
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadImage(file);
    setCoverImage(result.url);
  };

  const toggleTag = (tagId: string) => {
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
        toast.success('文章保存成功');
      } else {
        await createArticle(data);
        toast.success('文章保存成功');
      }
      router.push('/admin/articles');
    } catch {
      toast.error('保存文章失败');
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="title">标题</Label>
          <Input
            id="title"
            type="text"
            placeholder="标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            type="text"
            placeholder="Slug（可选，用于 SEO）"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="summary">摘要</Label>
        <Input
          id="summary"
          type="text"
          placeholder="摘要（可选）"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="DRAFT">草稿</option>
            <option value="PUBLISHED">已发布</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label>封面：</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm text-muted-foreground"
          />
        </div>
      </div>

      {coverImage && (
        <div className="flex items-center gap-2">
          <Image src={coverImage} alt="cover" width={64} height={64} className="h-16 w-auto rounded" />
          <Button type="button" variant="destructive" size="sm" onClick={() => setCoverImage('')}>移除</Button>
        </div>
      )}

      <div className="space-y-1">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={cn(
                'text-xs px-3 py-1 border rounded-sm transition-colors',
                selectedTagIds.includes(tag.id)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:bg-muted'
              )}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div
        data-color-mode="light"
        onPaste={async (e) => {
          const items = e.clipboardData?.items;
          if (!items) return;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith('image/')) {
              e.preventDefault();
              const file = items[i].getAsFile();
              if (!file) return;
              toast.info('图片上传中...');
              try {
                const result = await uploadImage(file);
                setContent((prev: string) => prev + `\n<img src="${result.url}" width="100%" />\n`);
                toast.success('图片已插入');
              } catch {
                toast.error('图片上传失败');
              }
              return;
            }
          }
        }}
        onDrop={async (e) => {
          const files = e.dataTransfer?.files;
          if (!files || files.length === 0) return;
          const file = files[0];
          if (!file.type.startsWith('image/')) return;
          e.preventDefault();
          toast.info('图片上传中...');
          try {
            const result = await uploadImage(file);
            setContent((prev: string) => prev + `\n<img src="${result.url}" width="100%" />\n`);
            toast.success('图片已插入');
          } catch {
            toast.error('图片上传失败');
          }
        }}
        onDragOver={(e) => {
          if (e.dataTransfer?.types?.includes('Files')) {
            e.preventDefault();
          }
        }}
      >
        <MDEditor value={content} onChange={(val) => setContent(val || '')} height={500} />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? '保存中...' : article ? '更新' : '创建'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>取消</Button>
      </div>
    </form>
  );
}

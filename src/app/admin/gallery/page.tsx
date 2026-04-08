'use client';

import { useEffect, useState, useCallback } from 'react';
import { getGalleryImages, uploadGalleryImage, updateGalleryImage, deleteGalleryImage } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Trash2, Copy, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

type GalleryImage = {
  id: number;
  filename: string;
  url: string;
  title: string | null;
  description: string | null;
  size: number;
  mimeType: string;
  createdAt: string;
};

export default function AdminGalleryPage() {
  const [data, setData] = useState<{ data: GalleryImage[]; meta: { total: number; page: number; totalPages: number } } | null>(null);
  const [page, setPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);

  const load = useCallback(() => {
    getGalleryImages(page).then(setData);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadGalleryImage(files[i]);
      }
      toast.success(`已上传 ${files.length} 张图片`);
      load();
    } catch {
      toast.error('上传失败');
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这张图片？')) return;
    await deleteGalleryImage(id);
    toast.success('已删除');
    load();
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    toast.success('链接已复制');
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setEditTitle(image.title || '');
    setEditDescription(image.description || '');
  };

  const handleEditSave = async () => {
    if (!editingImage) return;
    await updateGalleryImage(editingImage.id, { title: editTitle, description: editDescription });
    toast.success('已更新');
    setEditingImage(null);
    load();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!data) return <p className="text-muted-foreground">加载中...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">图库管理</h1>
          <p className="text-sm text-muted-foreground mt-1">共 {data.meta.total} 张图片</p>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            id="gallery-upload"
          />
          <Button disabled={uploading} onClick={() => document.getElementById('gallery-upload')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? '上传中...' : '上传图片'}
          </Button>
        </div>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data.data.map((image) => (
          <Card key={image.id} className="overflow-hidden group relative">
            <div
              className="aspect-square bg-muted cursor-pointer"
              onClick={() => setPreviewImage(image)}
            >
              <img
                src={image.url}
                alt={image.title || image.filename}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Hover overlay with actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleCopyUrl(image.url)}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleEdit(image)}>
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(image.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            {/* Info bar */}
            <div className="p-2">
              <p className="text-xs truncate text-foreground">{image.title || image.filename}</p>
              <p className="text-xs text-muted-foreground">{formatSize(image.size)}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data.meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</Button>
          <span className="px-3 py-1 text-sm text-muted-foreground">{data.meta.page} / {data.meta.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= data.meta.totalPages} onClick={() => setPage(page + 1)}>下一页</Button>
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editingImage} onOpenChange={(open) => { if (!open) setEditingImage(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑图片信息</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>标题</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="图片标题" />
            </div>
            <div>
              <Label>描述</Label>
              <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="图片描述" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingImage(null)}>取消</Button>
            <Button onClick={handleEditSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview dialog */}
      <Dialog open={!!previewImage} onOpenChange={(open) => { if (!open) setPreviewImage(null); }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewImage?.title || previewImage?.filename}</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div>
              <img
                src={previewImage.url}
                alt={previewImage.title || previewImage.filename}
                className="w-full rounded-lg"
              />
              {previewImage.description && (
                <p className="text-sm text-muted-foreground mt-2">{previewImage.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span>{formatSize(previewImage.size)}</span>
                <span>{previewImage.mimeType}</span>
                <span>{new Date(previewImage.createdAt).toLocaleString('zh-CN')}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

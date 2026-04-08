'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function CommentForm({ slug, parentId, onSubmitted }: {
  slug: string;
  parentId?: number;
  onSubmitted?: () => void;
}) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/articles/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, email, content, parentId }),
      });
      if (res.ok) {
        setMessage('评论已提交，等待审核');
        setContent('');
        onSubmitted?.();
      } else {
        setMessage('评论提交失败');
      }
    } catch {
      setMessage('评论提交失败');
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input type="text" placeholder="昵称" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
        <Input type="email" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <Textarea placeholder="写下你的评论..." value={content} onChange={(e) => setContent(e.target.value)} required rows={4} className="w-full" />
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? '提交中...' : '提交'}
        </Button>
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </div>
    </form>
  );
}

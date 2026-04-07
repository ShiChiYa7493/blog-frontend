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
        setMessage('Comment submitted, awaiting review.');
        setContent('');
        onSubmitted?.();
      } else {
        setMessage('Failed to submit comment.');
      }
    } catch {
      setMessage('Failed to submit comment.');
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input type="text" placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <Textarea placeholder="Write a comment..." value={content} onChange={(e) => setContent(e.target.value)} required rows={4} className="w-full" />
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </div>
    </form>
  );
}

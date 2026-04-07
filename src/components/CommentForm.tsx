'use client';

import { useState } from 'react';

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
        <input type="text" placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} required className="border border-gray-300 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-gray-900" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border border-gray-300 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-gray-900" />
      </div>
      <textarea placeholder="Write a comment..." value={content} onChange={(e) => setContent(e.target.value)} required rows={4} className="w-full border border-gray-300 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-gray-900" />
      <div className="flex items-center gap-4">
        <button type="submit" disabled={submitting} className="bg-gray-900 text-white px-6 py-2 text-sm hover:bg-gray-700 disabled:opacity-50 transition-colors">
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
        {message && <span className="text-sm text-gray-500">{message}</span>}
      </div>
    </form>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import { getComments } from '@/lib/api';
import CommentForm from './CommentForm';
import { Button } from '@/components/ui/button';

interface Reply {
  id: string;
  nickname: string;
  content: string;
  createdAt: string;
  parentId: string | null;
}

interface Comment {
  id: string;
  nickname: string;
  content: string;
  createdAt: string;
  replies?: Reply[];
}

function renderContent(text: string) {
  // Highlight leading @nickname mention(s)
  const parts = text.split(/(@[^\s@]+)/g);
  return parts.map((p, i) =>
    p.startsWith('@')
      ? <span key={i} className="text-primary font-medium">{p}</span>
      : <span key={i}>{p}</span>,
  );
}

type ReplyTarget = {
  // The id to send as parentId — always the root comment id (one-level threading).
  rootId: string;
  // The nickname being replied to (may be a reply author, not the root author).
  nickname: string;
} | null;

export default function CommentSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTarget, setReplyTarget] = useState<ReplyTarget>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const REPLY_LIMIT = 3;

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const load = useCallback(async () => {
    try {
      const data = await getComments(articleId);
      setComments(data || []);
    } catch {
      setComments([]);
    }
  }, [articleId]);

  useEffect(() => { load(); }, [load]);

  const startReply = (rootId: string, nickname: string) => {
    setReplyTarget({ rootId, nickname });
    queueMicrotask(() => {
      document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h3 className="text-xl font-bold mb-6">评论 (<span className="text-primary">{comments.length}</span>)</h3>
      <div className="space-y-6 mb-8">
        {comments.map((comment) => (
          <div key={comment.id} className="border-l-2 border-primary/30 pl-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span className="font-medium text-foreground">{comment.nickname}</span>
              <span>&middot;</span>
              <time>{new Date(comment.createdAt).toLocaleDateString('zh-CN')}</time>
              <button
                type="button"
                onClick={() => startReply(comment.id, comment.nickname)}
                className="ml-2 text-xs text-primary hover:underline"
              >
                回复
              </button>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap">{renderContent(comment.content)}</p>
            {comment.replies && comment.replies.length > 0 && (() => {
              const isExpanded = expanded.has(comment.id);
              const total = comment.replies.length;
              const overflow = total > REPLY_LIMIT;
              const visible = overflow && !isExpanded ? comment.replies.slice(0, REPLY_LIMIT) : comment.replies;
              return (
                <div className="mt-3 ml-4 space-y-3">
                  {visible.map((reply) => (
                    <div key={reply.id} className="border-l border-border pl-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span className="font-medium text-foreground">{reply.nickname}</span>
                        <span>&middot;</span>
                        <time>{new Date(reply.createdAt).toLocaleDateString('zh-CN')}</time>
                        <button
                          type="button"
                          onClick={() => startReply(comment.id, reply.nickname)}
                          className="ml-2 text-xs text-primary hover:underline"
                        >
                          回复
                        </button>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{renderContent(reply.content)}</p>
                    </div>
                  ))}
                  {overflow && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(comment.id)}
                      className="text-xs text-primary hover:underline ml-1"
                    >
                      {isExpanded ? '收起回复' : `展开剩余 ${total - REPLY_LIMIT} 条回复`}
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        ))}
      </div>

      <div id="comment-form">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold">{replyTarget ? `回复 @${replyTarget.nickname}` : '发表评论'}</h4>
          {replyTarget && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setReplyTarget(null)}>取消回复</Button>
          )}
        </div>
        <CommentForm
          articleId={articleId}
          parentId={replyTarget?.rootId}
          replyToName={replyTarget?.nickname}
          onSubmitted={() => { setReplyTarget(null); load(); }}
        />
      </div>
    </section>
  );
}

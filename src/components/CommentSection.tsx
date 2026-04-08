import { getComments } from '@/lib/api';
import CommentForm from './CommentForm';

interface Reply {
  id: number;
  nickname: string;
  content: string;
  createdAt: string;
}

interface Comment {
  id: number;
  nickname: string;
  content: string;
  createdAt: string;
  replies?: Reply[];
}

export default async function CommentSection({ slug }: { slug: string }) {
  let comments: Comment[] = [];
  try {
    comments = await getComments(slug);
  } catch {
    comments = [];
  }

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h3 className="text-xl font-bold mb-6">Comments (<span className="text-primary">{comments.length}</span>)</h3>
      <div className="space-y-6 mb-8">
        {comments.map((comment: Comment) => (
          <div key={comment.id} className="border-l-2 border-primary/30 pl-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span className="font-medium text-foreground">{comment.nickname}</span>
              <span>&middot;</span>
              <time>{new Date(comment.createdAt).toLocaleDateString('zh-CN')}</time>
            </div>
            <p className="text-sm text-foreground">{comment.content}</p>
            {comment.replies?.map((reply: Reply) => (
              <div key={reply.id} className="mt-3 ml-4 border-l border-border pl-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span className="font-medium text-foreground">{reply.nickname}</span>
                  <span>&middot;</span>
                  <time>{new Date(reply.createdAt).toLocaleDateString('zh-CN')}</time>
                </div>
                <p className="text-sm text-foreground">{reply.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <h4 className="text-lg font-bold mb-4">Leave a Comment</h4>
      <CommentForm slug={slug} />
    </section>
  );
}

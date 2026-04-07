import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import 'highlight.js/styles/github-dark.css';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-serif prose-p:leading-relaxed prose-pre:bg-gray-900 prose-code:text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

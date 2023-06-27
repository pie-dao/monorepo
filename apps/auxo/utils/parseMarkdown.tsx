// Create a component that accepts a Markdown string and returns JSX

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Markdown(text: string) {
  return (
    <div className="prose max-w-none prose-headings:text-primary prose-p:text-primary prose-p:leading-normal prose-strong:text-primary prose-ul:text-primary prose-li:text-primary prose-h4:mb-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}

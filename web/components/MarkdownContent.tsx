import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  children: string;
  className?: string;
};

export function MarkdownContent({ children, className = "" }: MarkdownContentProps) {
  return (
    <div
      className={`prose prose-sm sm:prose-base max-w-none
        prose-headings:scroll-mt-20
        prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4
        prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-3
        prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2
        prose-p:text-[var(--muted)] prose-p:leading-relaxed
        prose-strong:text-[var(--fg)] prose-strong:font-semibold
        prose-code:text-[var(--accent)] prose-code:bg-[var(--bg)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:hidden prose-code:after:hidden
        prose-pre:bg-[var(--bg)] prose-pre:border prose-pre:border-[var(--border)] prose-pre:rounded-lg prose-pre:text-xs
        prose-li:text-[var(--muted)] prose-li:my-0.5
        prose-ul:my-2 prose-ol:my-2
        prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline
        prose-blockquote:text-[var(--muted)] prose-blockquote:border-l-[var(--accent)] prose-blockquote:border-l-2 prose-blockquote:font-normal prose-blockquote:not-italic
        prose-table:text-sm
        prose-th:text-[var(--fg)] prose-th:bg-[var(--bg)]
        prose-td:text-[var(--muted)]
        prose-hr:border-[var(--border)] prose-hr:my-6
        ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

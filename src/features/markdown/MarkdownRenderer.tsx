import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { remarkPlugins, rehypePlugins } from "./plugins";
import { shouldVirtualize } from "./block-splitter";
import { VirtualizedRenderer } from "./VirtualizedRenderer";
import "../../styles/markdown.css";
import "../../styles/code-highlight.css";

interface Props {
  content: string;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({ content }: Props) {
  if (shouldVirtualize(content)) {
    return (
      <article className="md-body">
        <VirtualizedRenderer content={content} />
      </article>
    );
  }

  return (
    <article className="md-body">
      <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
        {content}
      </ReactMarkdown>
    </article>
  );
});

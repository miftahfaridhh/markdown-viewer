import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { remarkPlugins, rehypePlugins } from "./plugins";
import "../../styles/markdown.css";
import "highlight.js/styles/github.css";

interface Props {
  content: string;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({ content }: Props) {
  return (
    <article className="md-body">
      <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
        {content}
      </ReactMarkdown>
    </article>
  );
});

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { remarkPlugins, rehypePlugins } from "./plugins";

interface Props {
  content: string;
}

export const BlockRenderer = memo(
  function BlockRenderer({ content }: Props) {
    return (
      <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
        {content}
      </ReactMarkdown>
    );
  },
  (prev, next) => prev.content === next.content,
);

import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import type { PluggableList } from "unified";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), "className"],
    span: [...(defaultSchema.attributes?.span ?? []), "className"],
    div: [...(defaultSchema.attributes?.div ?? []), "className"],
  },
};

export const remarkPlugins: PluggableList = [remarkGfm];

export const rehypePlugins: PluggableList = [
  rehypeRaw,
  [rehypeSanitize, sanitizeSchema],
  rehypeHighlight,
  rehypeSlug,
];

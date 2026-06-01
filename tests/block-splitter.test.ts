import { describe, it, expect } from "vitest";
import { splitIntoBlocks, shouldVirtualize } from "../src/features/markdown/block-splitter";

describe("splitIntoBlocks", () => {
  it("splits simple paragraphs on blank lines", () => {
    const input = "First paragraph.\n\nSecond paragraph.\n\nThird paragraph.";
    const blocks = splitIntoBlocks(input);
    expect(blocks).toHaveLength(3);
    expect(blocks[0]).toBe("First paragraph.");
    expect(blocks[1]).toBe("Second paragraph.");
  });

  it("treats a fenced code block as one atomic block even with blank lines inside", () => {
    const input = "Before.\n\n```js\nconsole.log(1);\n\nconsole.log(2);\n```\n\nAfter.";
    const blocks = splitIntoBlocks(input);
    expect(blocks).toHaveLength(3);
    expect(blocks[1]).toContain("console.log(1)");
    expect(blocks[1]).toContain("console.log(2)");
  });

  it("handles tilde fences", () => {
    const input = "~~~python\nprint('hello')\n~~~\n\nNext block.";
    const blocks = splitIntoBlocks(input);
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toContain("print('hello')");
  });

  it("filters out empty blocks", () => {
    const input = "\n\n\nHello.\n\n\n\nWorld.\n\n";
    const blocks = splitIntoBlocks(input);
    expect(blocks).toHaveLength(2);
  });

  it("returns single block for content with no blank lines", () => {
    const input = "# Heading\nSome text\nMore text";
    const blocks = splitIntoBlocks(input);
    expect(blocks).toHaveLength(1);
  });
});

describe("shouldVirtualize", () => {
  it("returns false for small content", () => {
    expect(shouldVirtualize("short")).toBe(false);
  });

  it("returns true for content larger than 512 KB", () => {
    const large = "x".repeat(512 * 1024 + 1);
    expect(shouldVirtualize(large)).toBe(true);
  });
});

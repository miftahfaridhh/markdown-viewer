import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "./test-utils";
import { MarkdownRenderer } from "../src/features/markdown/MarkdownRenderer";

describe("MarkdownRenderer", () => {
  it("renders a heading without crashing", async () => {
    render(<MarkdownRenderer content="# Hello World" />);
    const heading = await screen.findByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Hello World");
  });

  it("renders bold text without crashing", async () => {
    render(<MarkdownRenderer content="This is **bold** text." />);
    const bold = await screen.findByText("bold");
    expect(bold.tagName.toLowerCase()).toBe("strong");
  });

  it("renders a fenced code block without crashing", async () => {
    render(<MarkdownRenderer content={"```js\nconst x = 1;\n```"} />);
    // highlight.js splits the code into spans, so we look for the code element
    const codeEl = await screen.findByRole("code");
    expect(codeEl).toBeInTheDocument();
    expect(codeEl.textContent).toContain("const");
  });

  it("renders a task list without crashing", async () => {
    const content = "- [x] Done\n- [ ] Todo";
    render(<MarkdownRenderer content={content} />);
    const checkboxes = await screen.findAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });
});

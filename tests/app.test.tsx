import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import App from "../src/App";

describe("App", () => {
  it("renders the empty state title when no file is open", async () => {
    render(<App />);
    const title = await screen.findByText("Markdown Viewer");
    expect(title).toBeInTheDocument();
  });

  it("renders the empty state hint when no file is open", async () => {
    render(<App />);
    const hint = await screen.findByText(/open a file or drag and drop/i);
    expect(hint).toBeInTheDocument();
  });
});

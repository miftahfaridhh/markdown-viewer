import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "./test-utils";
import { Toolbar } from "../src/features/toolbar/Toolbar";

describe("Toolbar", () => {
  it("renders Open button", async () => {
    render(<Toolbar />);
    const btn = await screen.findByRole("button", { name: /open/i });
    expect(btn).toBeInTheDocument();
  });

  it("renders Reload button", async () => {
    render(<Toolbar />);
    const btn = await screen.findByRole("button", { name: /reload/i });
    expect(btn).toBeInTheDocument();
  });

  it("renders the Dark theme toggle button when theme is light", async () => {
    render(<Toolbar />);
    const btn = await screen.findByRole("button", { name: /dark/i });
    expect(btn).toBeInTheDocument();
  });

  it("clicking Dark button dispatches THEME_CHANGED to dark", async () => {
    const { container } = render(<Toolbar />);
    const btn = await screen.findByRole("button", { name: /dark/i });
    fireEvent.click(btn);
    // After toggling from light -> dark, the button should now say "Light"
    const lightBtn = await screen.findByRole("button", { name: /light/i });
    expect(lightBtn).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });
});

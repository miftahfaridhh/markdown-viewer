import { describe, it, expect } from "vitest";
import { appReducer, initialState } from "../src/app/reducer";

describe("appReducer", () => {
  it("returns initial state unchanged for unknown action", () => {
    const result = appReducer(initialState, { type: "ERROR_CLEARED" });
    expect(result.error).toBeNull();
  });

  it("sets loading state on FILE_LOADING", () => {
    const result = appReducer(initialState, { type: "FILE_LOADING" });
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it("sets file content on FILE_LOADED", () => {
    const loading = appReducer(initialState, { type: "FILE_LOADING" });
    const payload = { content: "# Hello", sizeBytes: 7, path: "/tmp/test.md" };
    const result = appReducer(loading, { type: "FILE_LOADED", payload });
    expect(result.isLoading).toBe(false);
    expect(result.currentFile).toEqual(payload);
  });

  it("sets error on FILE_ERROR", () => {
    const result = appReducer(initialState, {
      type: "FILE_ERROR",
      payload: "File not found",
    });
    expect(result.error).toBe("File not found");
    expect(result.isLoading).toBe(false);
  });

  it("clamps zoom between 0.5 and 2.0", () => {
    const tooSmall = appReducer(initialState, { type: "ZOOM_CHANGED", payload: 0.1 });
    expect(tooSmall.prefs.zoom).toBe(0.5);
    const tooBig = appReducer(initialState, { type: "ZOOM_CHANGED", payload: 5.0 });
    expect(tooBig.prefs.zoom).toBe(2.0);
  });

  it("changes theme", () => {
    const result = appReducer(initialState, { type: "THEME_CHANGED", payload: "dark" });
    expect(result.prefs.theme).toBe("dark");
  });

  it("prepends recent file and deduplicates", () => {
    const file = { path: "/a.md", name: "a.md", openedAt: 1 };
    const first = appReducer(initialState, { type: "RECENT_FILE_ADDED", payload: file });
    expect(first.prefs.recentFiles).toHaveLength(1);

    const second = appReducer(first, { type: "RECENT_FILE_ADDED", payload: { ...file, openedAt: 2 } });
    expect(second.prefs.recentFiles).toHaveLength(1);
    expect(second.prefs.recentFiles[0].openedAt).toBe(2);
  });
});

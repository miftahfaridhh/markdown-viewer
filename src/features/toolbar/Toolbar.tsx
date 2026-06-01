import { useCallback } from "react";
import { useApp } from "../../app/AppContext";
import { openFileDialog, readMarkdownFile } from "../../shared/ipc";
import type { Theme } from "../../shared/types";

export function Toolbar() {
  const { state, dispatch } = useApp();
  const { prefs, currentFile, isLoading } = state;

  const handleOpen = useCallback(async () => {
    const path = await openFileDialog();
    if (!path) return;
    dispatch({ type: "FILE_LOADING" });
    try {
      const file = await readMarkdownFile(path);
      dispatch({ type: "FILE_LOADED", payload: file });
      dispatch({
        type: "RECENT_FILE_ADDED",
        payload: { path, name: path.split(/[\\/]/).pop() ?? path, openedAt: Date.now() },
      });
    } catch (err) {
      dispatch({ type: "FILE_ERROR", payload: String(err) });
    }
  }, [dispatch]);

  const handleReload = useCallback(async () => {
    if (!currentFile) return;
    dispatch({ type: "FILE_LOADING" });
    try {
      const file = await readMarkdownFile(currentFile.path);
      dispatch({ type: "FILE_LOADED", payload: file });
    } catch (err) {
      dispatch({ type: "FILE_ERROR", payload: String(err) });
    }
  }, [currentFile, dispatch]);

  const handleZoom = useCallback(
    (delta: number) => {
      dispatch({ type: "ZOOM_CHANGED", payload: prefs.zoom + delta });
    },
    [prefs.zoom, dispatch],
  );

  const handleTheme = useCallback(() => {
    const next: Theme = prefs.theme === "light" ? "dark" : "light";
    dispatch({ type: "THEME_CHANGED", payload: next });
  }, [prefs.theme, dispatch]);

  return (
    <div className="layout__toolbar">
      <button className="toolbar-btn" onClick={handleOpen} title="Open file (Ctrl+O)">
        Open
      </button>
      <button
        className="toolbar-btn"
        onClick={handleReload}
        disabled={!currentFile || isLoading}
        title="Reload current file"
      >
        Reload
      </button>
      <div className="toolbar-separator" />
      <button
        className="toolbar-btn toolbar-btn--icon"
        onClick={() => handleZoom(0.1)}
        title="Zoom in"
      >
        A+
      </button>
      <button
        className="toolbar-btn toolbar-btn--icon"
        onClick={() => handleZoom(-0.1)}
        title="Zoom out"
      >
        A−
      </button>
      <div className="toolbar-separator" />
      <button className="toolbar-btn" onClick={handleTheme} title="Toggle theme">
        {prefs.theme === "light" ? "Dark" : "Light"}
      </button>
      {currentFile && (
        <span className="toolbar-filename" title={currentFile.path}>
          {currentFile.path.split(/[\\/]/).pop()}
        </span>
      )}
    </div>
  );
}

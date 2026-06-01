import { useEffect, useCallback } from "react";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { AppProvider, useApp } from "./app/AppContext";
import { Toolbar } from "./features/toolbar/Toolbar";
import { Sidebar } from "./features/explorer/Sidebar";
import { MarkdownRenderer } from "./features/markdown/MarkdownRenderer";
import { openFileDialog, readMarkdownFile } from "./shared/ipc";

function AppShell() {
  const { state, dispatch } = useApp();
  const { currentFile, prefs, isLoading, error } = state;

  const openFile = useCallback(async () => {
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

  const reloadFile = useCallback(async () => {
    if (!currentFile) return;
    dispatch({ type: "FILE_LOADING" });
    try {
      const file = await readMarkdownFile(currentFile.path);
      dispatch({ type: "FILE_LOADED", payload: file });
    } catch (err) {
      dispatch({ type: "FILE_ERROR", payload: String(err) });
    }
  }, [currentFile, dispatch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "o") {
        e.preventDefault();
        openFile();
      }
      if (ctrl && e.key === "r") {
        e.preventDefault();
        reloadFile();
      }
      if (ctrl && e.key === "=") {
        e.preventDefault();
        dispatch({ type: "ZOOM_CHANGED", payload: prefs.zoom + 0.1 });
      }
      if (ctrl && e.key === "-") {
        e.preventDefault();
        dispatch({ type: "ZOOM_CHANGED", payload: prefs.zoom - 0.1 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openFile, reloadFile, prefs.zoom, dispatch]);

  useEffect(() => {
    const webview = getCurrentWebview();
    const unlistenPromise = webview.onDragDropEvent((event) => {
      const drag = event.payload;
      if (drag.type !== "drop") return;
      const paths: string[] = drag.paths;
      const mdPath = paths.find((p) => p.endsWith(".md") || p.endsWith(".markdown"));
      if (!mdPath) return;
      dispatch({ type: "FILE_LOADING" });
      readMarkdownFile(mdPath)
        .then((file) => {
          dispatch({ type: "FILE_LOADED", payload: file });
          dispatch({
            type: "RECENT_FILE_ADDED",
            payload: {
              path: mdPath,
              name: mdPath.split(/[\\/]/).pop() ?? mdPath,
              openedAt: Date.now(),
            },
          });
        })
        .catch((err) => dispatch({ type: "FILE_ERROR", payload: String(err) }));
    });

    return () => {
      unlistenPromise.then((fn) => fn());
    };
  }, [dispatch]);

  const contentStyle = { fontSize: `${prefs.zoom}rem` };

  return (
    <div className="layout">
      <Toolbar />
      <div className="layout__body">
        <div className="layout__sidebar">
          <Sidebar />
        </div>
        <main className="layout__content" style={contentStyle}>
          {isLoading && <p className="empty-state__hint">Loading…</p>}
          {error && (
            <div className="empty-state">
              <p className="empty-state__title">Error</p>
              <p className="empty-state__hint">{error}</p>
              <button onClick={() => dispatch({ type: "ERROR_CLEARED" })}>Dismiss</button>
            </div>
          )}
          {!isLoading && !error && currentFile && (
            <div className="content-area">
              <MarkdownRenderer content={currentFile.content} />
            </div>
          )}
          {!isLoading && !error && !currentFile && (
            <div className="empty-state">
              <p className="empty-state__title">Markdown Viewer</p>
              <p className="empty-state__hint">Open a file or drag and drop a .md file here</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

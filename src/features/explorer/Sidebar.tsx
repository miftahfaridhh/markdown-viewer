import { useCallback } from "react";
import { useApp } from "../../app/AppContext";
import { openDirectoryDialog, listDirectory, readMarkdownFile } from "../../shared/ipc";
import { FileTree } from "./FileTree";
import { RecentFiles } from "./RecentFiles";

export function Sidebar() {
  const { state, dispatch } = useApp();
  const { sidebarDirectory, fileTree, prefs } = state;

  const handleOpenDirectory = useCallback(async () => {
    const path = await openDirectoryDialog();
    if (!path) return;
    try {
      const tree = await listDirectory(path);
      dispatch({ type: "DIRECTORY_OPENED", payload: { path, tree } });
    } catch (err) {
      dispatch({ type: "FILE_ERROR", payload: String(err) });
    }
  }, [dispatch]);

  const handleFileClick = useCallback(
    async (path: string) => {
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
    },
    [dispatch],
  );

  return (
    <aside className="sidebar">
      <div className="sidebar__section">
        <div className="sidebar__header">
          <span className="sidebar__label">Explorer</span>
          <button className="sidebar__action-btn" onClick={handleOpenDirectory} title="Open folder">
            +
          </button>
        </div>
        {sidebarDirectory ? (
          <FileTree entries={fileTree} onFileClick={handleFileClick} />
        ) : (
          <p className="sidebar__empty">Open a folder to browse files</p>
        )}
      </div>

      <div className="sidebar__divider" />

      <div className="sidebar__section">
        <div className="sidebar__header">
          <span className="sidebar__label">Recent</span>
        </div>
        <RecentFiles files={prefs.recentFiles} onFileClick={handleFileClick} />
      </div>
    </aside>
  );
}

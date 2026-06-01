import type { RecentFile } from "../../shared/types";

interface Props {
  files: RecentFile[];
  onFileClick: (path: string) => void;
}

export function RecentFiles({ files, onFileClick }: Props) {
  if (files.length === 0) {
    return <p className="sidebar__empty">No recent files</p>;
  }
  return (
    <ul className="file-tree">
      {files.slice(0, 10).map((f) => (
        <li key={f.path}>
          <button
            className="file-tree__file-btn"
            onClick={() => onFileClick(f.path)}
            title={f.path}
          >
            {f.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

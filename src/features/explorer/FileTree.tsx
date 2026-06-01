import { useState } from "react";
import type { FileEntry } from "../../shared/types";
import { useApp } from "../../app/AppContext";

interface Props {
  entries: FileEntry[];
  onFileClick: (path: string) => void;
  depth?: number;
}

export function FileTree({ entries, onFileClick, depth = 0 }: Props) {
  return (
    <ul className="file-tree" style={{ paddingLeft: depth > 0 ? "12px" : "0" }}>
      {entries.map((entry) =>
        entry.isDir ? (
          <DirNode key={entry.path} entry={entry} onFileClick={onFileClick} depth={depth} />
        ) : (
          <FileNode key={entry.path} entry={entry} onFileClick={onFileClick} />
        ),
      )}
    </ul>
  );
}

function DirNode({
  entry,
  onFileClick,
  depth,
}: {
  entry: FileEntry;
  onFileClick: (path: string) => void;
  depth: number;
}) {
  const [open, setOpen] = useState(depth === 0);
  return (
    <li className="file-tree__dir">
      <button className="file-tree__dir-btn" onClick={() => setOpen((o) => !o)}>
        <span className="file-tree__chevron">{open ? "▾" : "▸"}</span>
        {entry.name}
      </button>
      {open && entry.children && (
        <FileTree entries={entry.children} onFileClick={onFileClick} depth={depth + 1} />
      )}
    </li>
  );
}

function FileNode({
  entry,
  onFileClick,
}: {
  entry: FileEntry;
  onFileClick: (path: string) => void;
}) {
  const { state } = useApp();
  const isActive = state.currentFile?.path === entry.path;
  return (
    <li>
      <button
        className={`file-tree__file-btn ${isActive ? "file-tree__file-btn--active" : ""}`}
        onClick={() => onFileClick(entry.path)}
        title={entry.path}
      >
        {entry.name}
      </button>
    </li>
  );
}

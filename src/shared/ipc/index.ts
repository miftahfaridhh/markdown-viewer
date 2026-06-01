import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import type { FileContent, FileEntry } from "../types";

export async function openFileDialog(): Promise<string | null> {
  const result = await open({
    multiple: false,
    filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
  });
  if (typeof result === "string") return result;
  return null;
}

export async function openDirectoryDialog(): Promise<string | null> {
  const result = await open({ directory: true, multiple: false });
  if (typeof result === "string") return result;
  return null;
}

export async function readMarkdownFile(path: string): Promise<FileContent> {
  const raw = await invoke<{ content: string; size_bytes: number; path: string }>(
    "read_markdown_file",
    { path },
  );
  return { content: raw.content, sizeBytes: raw.size_bytes, path: raw.path };
}

export async function listDirectory(path: string): Promise<FileEntry[]> {
  const raw = await invoke<Array<{
    name: string;
    path: string;
    is_dir: boolean;
    children?: Array<unknown>;
  }>>("list_directory", { path });

  return normalizeEntries(raw);
}

function normalizeEntries(raw: unknown[]): FileEntry[] {
  return (raw as Array<{ name: string; path: string; is_dir: boolean; children?: unknown[] }>).map(
    (e) => ({
      name: e.name,
      path: e.path,
      isDir: e.is_dir,
      children: e.children ? normalizeEntries(e.children) : undefined,
    }),
  );
}

export async function getHomeDir(): Promise<string> {
  return invoke<string>("get_home_dir");
}

export async function getFileModifiedTime(path: string): Promise<number> {
  return invoke<number>("get_file_modified_time", { path });
}

export interface FileContent {
  content: string;
  sizeBytes: number;
  path: string;
}

export interface FileEntry {
  name: string;
  path: string;
  isDir: boolean;
  children?: FileEntry[];
}

export interface RecentFile {
  path: string;
  name: string;
  openedAt: number;
}

export type Theme = "light" | "dark";

export interface Prefs {
  theme: Theme;
  zoom: number;
  lastDirectory: string | null;
  recentFiles: RecentFile[];
}

export interface AppState {
  currentFile: FileContent | null;
  prefs: Prefs;
  sidebarDirectory: string | null;
  fileTree: FileEntry[];
  isLoading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: "FILE_LOADED"; payload: FileContent }
  | { type: "FILE_LOADING" }
  | { type: "FILE_ERROR"; payload: string }
  | { type: "PREFS_LOADED"; payload: Prefs }
  | { type: "THEME_CHANGED"; payload: Theme }
  | { type: "ZOOM_CHANGED"; payload: number }
  | { type: "DIRECTORY_OPENED"; payload: { path: string; tree: FileEntry[] } }
  | { type: "RECENT_FILE_ADDED"; payload: RecentFile }
  | { type: "ERROR_CLEARED" };

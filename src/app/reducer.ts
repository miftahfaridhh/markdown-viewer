import type { AppState, AppAction, Prefs } from "../shared/types";

const DEFAULT_PREFS: Prefs = {
  theme: "light",
  zoom: 1.0,
  lastDirectory: null,
  recentFiles: [],
};

export const initialState: AppState = {
  currentFile: null,
  prefs: DEFAULT_PREFS,
  sidebarDirectory: null,
  fileTree: [],
  isLoading: false,
  error: null,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "FILE_LOADING":
      return { ...state, isLoading: true, error: null };

    case "FILE_LOADED":
      return { ...state, isLoading: false, currentFile: action.payload, error: null };

    case "FILE_ERROR":
      return { ...state, isLoading: false, error: action.payload };

    case "PREFS_LOADED":
      return { ...state, prefs: action.payload };

    case "THEME_CHANGED":
      return { ...state, prefs: { ...state.prefs, theme: action.payload } };

    case "ZOOM_CHANGED":
      return {
        ...state,
        prefs: { ...state.prefs, zoom: Math.min(2.0, Math.max(0.5, action.payload)) },
      };

    case "DIRECTORY_OPENED":
      return {
        ...state,
        sidebarDirectory: action.payload.path,
        fileTree: action.payload.tree,
      };

    case "RECENT_FILE_ADDED": {
      const filtered = state.prefs.recentFiles
        .filter((f) => f.path !== action.payload.path)
        .slice(0, 19);
      return {
        ...state,
        prefs: {
          ...state.prefs,
          recentFiles: [action.payload, ...filtered],
        },
      };
    }

    case "ERROR_CLEARED":
      return { ...state, error: null };

    default:
      return state;
  }
}

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import { Store } from "@tauri-apps/plugin-store";
import { appReducer, initialState } from "./reducer";
import type { AppState, AppAction, Prefs } from "../shared/types";

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

let store: Store | null = null;

async function getStore(): Promise<Store> {
  if (!store) {
    store = await Store.load("prefs.json");
  }
  return store;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    getStore().then(async (s) => {
      const saved = await s.get<Prefs>("prefs");
      if (saved) {
        dispatch({ type: "PREFS_LOADED", payload: saved });
      }
    });
  }, []);

  useEffect(() => {
    getStore().then((s) => s.set("prefs", state.prefs));
  }, [state.prefs]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.prefs.theme);
  }, [state.prefs.theme]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

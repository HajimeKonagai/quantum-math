import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface AppState {
  /** Currently open app id, or null */
  activeAppId: string | null;
  /** Params passed to the active app */
  params: Record<string, unknown>;
  /** Open an app with optional params */
  openApp: (appId: string, params?: Record<string, unknown>) => void;
  /** Close the active app */
  closeApp: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [params, setParams] = useState<Record<string, unknown>>({});

  const openApp = useCallback(
    (appId: string, p: Record<string, unknown> = {}) => {
      setActiveAppId(appId);
      setParams(p);
    },
    [],
  );

  const closeApp = useCallback(() => {
    setActiveAppId(null);
    setParams({});
  }, []);

  return (
    <AppContext value={{ activeAppId, params, openApp, closeApp }}>
      {children}
    </AppContext>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

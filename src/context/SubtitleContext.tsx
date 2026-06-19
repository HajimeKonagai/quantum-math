import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface SubtitleState {
  visible: boolean;
  toggle: () => void;
}

const SubtitleContext = createContext<SubtitleState | null>(null);

export function SubtitleProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const toggle = useCallback(() => setVisible((v) => !v), []);

  return (
    <SubtitleContext value={{ visible, toggle }}>{children}</SubtitleContext>
  );
}

export function useSubtitle(): SubtitleState {
  const ctx = useContext(SubtitleContext);
  if (!ctx)
    throw new Error("useSubtitle must be used within SubtitleProvider");
  return ctx;
}

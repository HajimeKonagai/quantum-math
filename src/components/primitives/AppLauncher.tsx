import { useApp } from "../../context/AppContext";
import styles from "./AppLauncher.module.scss";

interface Props {
  appId: string;
  params?: Record<string, unknown>;
  label?: string;
}

export function AppLauncher({
  appId,
  params = {},
  label = "Try it",
}: Props) {
  const { openApp } = useApp();

  return (
    <button
      className={styles.button}
      onClick={(e) => {
        e.stopPropagation();
        openApp(appId, params);
      }}
    >
      <span className={styles.icon}>&#9654;</span>
      {label}
    </button>
  );
}

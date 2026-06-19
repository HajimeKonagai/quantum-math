import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import type { AppEntry } from "../../types/app";
import styles from "./AppModal.module.scss";

interface Props {
  registry: AppEntry[];
}

export function AppModal({ registry }: Props) {
  const { activeAppId, params, closeApp } = useApp();

  // Escape key closes modal
  useEffect(() => {
    if (!activeAppId) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeApp();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeAppId, closeApp]);

  const entry = activeAppId
    ? registry.find((a) => a.id === activeAppId)
    : null;

  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeApp();
          }}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
          >
            <div className={styles.header}>
              <span className={styles.title}>{entry.title}</span>
              <button className={styles.closeBtn} onClick={closeApp}>
                ×
              </button>
            </div>
            <div className={styles.body}>
              <entry.component
                params={{ ...entry.defaultParams, ...params }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

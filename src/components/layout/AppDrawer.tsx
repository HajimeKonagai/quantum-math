import { AnimatePresence, motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import type { AppEntry } from "../../types/app";
import styles from "./AppDrawer.module.scss";

interface Props {
  registry: AppEntry[];
  open: boolean;
  onClose: () => void;
}

export function AppDrawer({ registry, open, onClose }: Props) {
  const { openApp } = useApp();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.nav
            className={styles.panel}
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className={styles.heading}>Interactive Apps</div>
            {registry.map((app) => (
              <button
                key={app.id}
                className={styles.card}
                onClick={() => {
                  openApp(app.id);
                  onClose();
                }}
              >
                <div className={styles.cardTitle}>{app.title}</div>
                <div className={styles.cardDesc}>{app.description}</div>
              </button>
            ))}
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

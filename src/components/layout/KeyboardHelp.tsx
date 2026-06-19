import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./KeyboardHelp.module.scss";

const SHORTCUTS = [
  { keys: ["→", "Space"], desc: "次へ" },
  { keys: ["←", "BS"], desc: "前へ" },
  { keys: ["S"], desc: "字幕 ON/OFF" },
  { keys: ["M"], desc: "目次" },
  { keys: ["A"], desc: "アプリ一覧" },
  { keys: ["Esc"], desc: "閉じる" },
];

export function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {SHORTCUTS.map((s) => (
              <div key={s.desc} className={styles.row}>
                <span className={styles.keys}>
                  {s.keys.map((k) => (
                    <span key={k} className={styles.key}>{k}</span>
                  ))}
                </span>
                <span className={styles.desc}>{s.desc}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        className={styles.toggleBtn}
        onClick={() => setOpen((v) => !v)}
        title="キーボードショートカット"
      >
        ?
      </button>
    </div>
  );
}

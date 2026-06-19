import { AnimatePresence, motion } from "motion/react";
import type { Chapter } from "../../types/slide";
import { useNav, useNavDispatch } from "../../context/NavigationContext";
import styles from "./Sidebar.module.scss";

interface Props {
  chapters: Chapter[];
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ chapters, open, onClose }: Props) {
  const { slideIndex } = useNav();
  const dispatch = useNavDispatch();

  // Build flat index for each slide
  let flatIndex = 0;
  const items: { chapterTitle: string; slideTitle: string; index: number }[] =
    [];
  for (const ch of chapters) {
    for (const slide of ch.slides) {
      items.push({
        chapterTitle: ch.title,
        slideTitle: slide.title,
        index: flatIndex++,
      });
    }
  }

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
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {items.map((item, i) => {
              const showChapter =
                i === 0 || items[i - 1].chapterTitle !== item.chapterTitle;
              return (
                <div key={item.index}>
                  {showChapter && (
                    <div className={styles.chapterTitle}>
                      {item.chapterTitle}
                    </div>
                  )}
                  <button
                    className={`${styles.slideItem} ${item.index === slideIndex ? styles.active : ""}`}
                    onClick={() => {
                      dispatch({ type: "GOTO", slideIndex: item.index });
                      onClose();
                    }}
                  >
                    {item.slideTitle}
                  </button>
                </div>
              );
            })}
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

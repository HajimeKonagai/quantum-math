import { AnimatePresence, motion } from "motion/react";
import { useSubtitle } from "../../context/SubtitleContext";
import styles from "./SubtitleBar.module.scss";

interface Props {
  text: string | undefined;
}

export function SubtitleBar({ text }: Props) {
  const { visible } = useSubtitle();
  const show = visible && !!text;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          key={text}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

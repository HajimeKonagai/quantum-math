import { motion } from "motion/react";
import styles from "./SectionTitle.module.scss";

/**
 * Factory for chapter title slides (1 step, title-only).
 */
export function createSectionTitle(title: string, subtitle?: string) {
  return function SectionTitleSlide() {
    return (
      <div className={styles.slide}>
        <motion.div
          className={styles.chapterName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.div>
        {subtitle && (
          <motion.div
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {subtitle}
          </motion.div>
        )}
      </div>
    );
  };
}

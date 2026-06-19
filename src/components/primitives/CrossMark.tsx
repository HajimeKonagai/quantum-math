import type { ReactNode } from "react";
import { motion } from "motion/react";
import styles from "./CrossMark.module.scss";

interface Props {
  children: ReactNode;
  visible?: boolean;
}

export function CrossMark({ children, visible = true }: Props) {
  return (
    <span className={styles.wrapper}>
      {children}
      {visible && (
        <svg className={styles.cross} viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.line
            x1="5" y1="5" x2="95" y2="95"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.line
            x1="95" y1="5" x2="5" y2="95"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          />
        </svg>
      )}
    </span>
  );
}

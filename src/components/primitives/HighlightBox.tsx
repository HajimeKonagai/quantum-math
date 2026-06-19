import type { ReactNode } from "react";
import { motion } from "motion/react";
import styles from "./HighlightBox.module.scss";

interface Props {
  children: ReactNode;
  className?: string;
}

export function HighlightBox({ children, className }: Props) {
  return (
    <motion.div
      className={`${styles.box} ${className ?? ""}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

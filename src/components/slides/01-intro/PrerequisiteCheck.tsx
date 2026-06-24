import { motion } from "motion/react";
import { Math } from "../../primitives/Math";
import styles from "./PrerequisiteCheck.module.scss";

const ITEMS = [
  { label: "2進数", tex: "0011 \\rightarrow \\;?\\,,\\quad 1101 \\rightarrow \\;?" },
  { label: "四則演算・分配法則", tex: "(1 + 2) \\times 3 = \\;?" },
  { label: "変数・定数・分数", tex: "4y = x,\\; x = 2 \\;\\Rightarrow\\; y = \\;?" },
  { label: "絶対値", tex: "|-3| = \\;?" },
  { label: "2乗とルート", tex: "(\\sqrt{2})^2 = \\;?" },
  { label: "ピタゴラスの定理", tex: "3^2 + 4^2 = c^2 \\;\\Rightarrow\\; c = \\;?" },
];

/**
 * PrerequisiteCheck — 1 step
 * 必要な前提知識の確認
 */
export function PrerequisiteCheck() {
  return (
    <div className={styles.slide}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        必要知識の確認
      </motion.div>

      <div className={styles.content}>
        {ITEMS.map((item, i) => (
          <motion.div
            key={i}
            className={styles.item}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className={styles.label}>{item.label}</span>
            <span className={styles.formula}>
              <Math tex={item.tex} />
            </span>
          </motion.div>
        ))}
        <motion.div
          className={styles.note}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          (サイン・コサイン、log、微分積分は不要です)
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import styles from "./NxtCommon.module.scss";

/**
 * NxtUse — 1 step
 *
 * step 0: もつれを使うと何ができるの？
 */
export function NxtUse() {
  useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        もつれを使うと何ができるの？
      </motion.div>

      <div className={styles.center}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
        >
          <div className={styles.listItem}>複数の状態を同時に計算</div>
          <div className={styles.listItem}>盗聴検知</div>
          <div className={styles.listItem}>量子テレポーテーション</div>
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import styles from "./NxtCommon.module.scss";

/**
 * NxtAlgorithms — 1 step
 *
 * step 0: 有名な量子アルゴリズムはもつれを利用
 */
export function NxtAlgorithms() {
  useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        そして…
      </motion.div>

      <div className={styles.center}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
        >
          <div className={styles.point} style={{ textAlign: "center", maxWidth: 520 }}>
            有名な量子アルゴリズムや量子通信技術の多くは「もつれ」を利用しています
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div className={styles.listItem}>量子暗号</div>
            <div className={styles.listItem}>量子テレポーテーション</div>
            <div className={styles.listItem}>グローバー探索</div>
            <div className={styles.listItem}>ショアの素因数分解</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

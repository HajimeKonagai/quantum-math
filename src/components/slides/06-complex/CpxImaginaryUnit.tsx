import { motion } from "motion/react";
import { Math as KMath } from "../../primitives/Math";
import styles from "./CpxCommon.module.scss";

/**
 * CpxImaginaryUnit — 1 step
 *
 * step 0: 「i」を虚数単位といいます
 */
export function CpxImaginaryUnit() {
  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        虚数単位
      </motion.div>

      <div className={styles.center}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={styles.bigFormula}
        >
          <KMath tex={String.raw`i`} display />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={styles.point} style={{ textAlign: "center" }}>
            「i」を虚数単位といいます
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={styles.equation}
        >
          <KMath tex={String.raw`i^2 = -1 \quad\Leftrightarrow\quad i = \sqrt{-1}`} display />
        </motion.div>
      </div>
    </div>
  );
}

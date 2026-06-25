import { motion } from "motion/react";
import { Math as KMath } from "../../primitives/Math";
import styles from "./CpxCommon.module.scss";

/**
 * CpxRealIsComplex — 1 step
 *
 * step 0: 3 = 3 + 0i — 実数も複素数
 */
export function CpxRealIsComplex() {
  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        実数も複素数
      </motion.div>

      <div className={styles.center}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={styles.bigFormula}
        >
          <KMath
            tex={String.raw`3 \;=\; 3 + {\color{#888888}{0i}}`}
            display
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.point} style={{ textAlign: "center" }}>
            実数も複素数です
          </div>
          <div className={styles.note} style={{ textAlign: "center", marginTop: "0.3rem" }}>
            虚部が 0 なので見えていないだけ
          </div>
        </motion.div>
      </div>
    </div>
  );
}

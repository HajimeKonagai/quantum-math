import { motion } from "motion/react";
import styles from "./BridgeCommon.module.scss";

/**
 * BridgePhase — 1 step
 *
 * step 0: "位相" displayed large.
 *         "What makes the difference? → Phase."
 */
export function BridgePhase() {
  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        何が違うのか？
      </motion.div>

      <div className={styles.center}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className={styles.bigText}
        >
          位相
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className={styles.note} style={{ textAlign: "center", maxWidth: 500 }}>
            量子状態には、観測したときの確率だけではなく、
            「位相」と呼ばれる情報も含まれています。
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from "motion/react";
import { Math as KMath } from "../../primitives/Math";
import { RAW_KET0, RAW_KET1, RAW_ACCENT } from "../../../utils/colors";
import styles from "./BridgeCommon.module.scss";

/**
 * BridgeMystery — 1 step
 *
 * step 0: |+⟩→H→|0⟩ / |−⟩→H→|1⟩ flow diagram.
 *         Same 50%/50% but different outcomes after H.
 */
export function BridgeMystery() {
  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        不可思議な現象
      </motion.div>

      <div className={styles.center}>
        {/* Row 1: |+⟩ → H → |0⟩ */}
        <motion.div
          className={styles.flowRow}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span style={{ color: RAW_ACCENT, fontFamily: "var(--font-mono)", fontSize: "1.3rem" }}>|+⟩</span>
          <span className={styles.note} style={{ fontSize: "0.85rem" }}>(50%/50%)</span>
          <span className={styles.flowArrow}>→</span>
          <span className={styles.flowBox}>H</span>
          <span className={styles.flowArrow}>→</span>
          <span className={styles.flowResult} style={{ color: RAW_KET0, fontSize: "1.3rem" }}>|0⟩</span>
        </motion.div>

        {/* Row 2: |−⟩ → H → |1⟩ */}
        <motion.div
          className={styles.flowRow}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span style={{ color: RAW_ACCENT, fontFamily: "var(--font-mono)", fontSize: "1.3rem" }}>|−⟩</span>
          <span className={styles.note} style={{ fontSize: "0.85rem" }}>(50%/50%)</span>
          <span className={styles.flowArrow}>→</span>
          <span className={styles.flowBox}>H</span>
          <span className={styles.flowArrow}>→</span>
          <span className={styles.flowResult} style={{ color: RAW_KET1, fontSize: "1.3rem" }}>|1⟩</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ marginTop: "1rem" }}
        >
          <div className={styles.equation}>
            <KMath
              tex={String.raw`|{+}\rangle = \tfrac{1}{\sqrt{2}}(|0\rangle \mathbin{\color{#ffff00}+} |1\rangle) \qquad |{-}\rangle = \tfrac{1}{\sqrt{2}}(|0\rangle \mathbin{\color{#ffff00}-} |1\rangle)`}
              display
            />
          </div>
          <div className={styles.note} style={{ textAlign: "center", marginTop: "0.8rem" }}>
            同じ 50%/50% なのに、Hゲートを通すと異なる結果になる
          </div>
        </motion.div>
      </div>
    </div>
  );
}

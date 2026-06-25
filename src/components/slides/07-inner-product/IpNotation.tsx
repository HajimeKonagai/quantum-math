import { motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import styles from "./IpCommon.module.scss";

/**
 * IpNotation — 1 step
 *
 * step 0: P(i) = |⟨i|ψ⟩|² — Probability の頭文字
 */
export function IpNotation() {
  useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        補足
      </motion.div>

      <div className={styles.center}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
        >
          <div className={styles.bigFormula}>
            <KMath
              tex={String.raw`P(i) = \bigl|\langle i | \psi \rangle\bigr|^2`}
              display
            />
          </div>
          <div className={styles.point} style={{ textAlign: "center" }}>
            P = Probability（確率）の頭文字
          </div>
          <div className={styles.note} style={{ textAlign: "center", maxWidth: 460 }}>
            「i 番目の基底で観測される確率は？」を表す式です
          </div>
        </motion.div>
      </div>
    </div>
  );
}

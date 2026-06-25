import { motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import styles from "./IpCommon.module.scss";

/**
 * IpDefinition — 1 step
 *
 * step 0: ⟨φ|ψ⟩ のブラケット記法、式の例
 */
export function IpDefinition() {
  useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        内積とは
      </motion.div>

      <div className={styles.center}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
        >
          <div className={styles.point} style={{ textAlign: "center" }}>
            内積はベクトル同士の演算です
          </div>
          <div className={styles.bigFormula}>
            <KMath tex={String.raw`\langle \varphi | \psi \rangle`} display />
          </div>
          <div className={styles.note} style={{ textAlign: "center", maxWidth: 500 }}>
            ブラケット記法では、左にブラ（横ベクトル）、右にケット（縦ベクトル）を並べて書きます
          </div>
          <div className={styles.equation}>
            <KMath
              tex={String.raw`\text{例:} \quad \langle + | \psi \rangle`}
              display
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

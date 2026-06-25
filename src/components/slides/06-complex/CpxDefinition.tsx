import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import styles from "./CpxCommon.module.scss";

/**
 * CpxDefinition — 2 steps
 *
 * step 0: a+bi, i²=-1 の定義
 * step 1: 3+4i の例
 */
export function CpxDefinition() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        複素数とは
      </motion.div>

      <div className={styles.center}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
            >
              <div className={styles.bigFormula}>
                <KMath tex={String.raw`a + bi`} display />
              </div>
              <div className={styles.point} style={{ textAlign: "center" }}>
                で表される数を複素数と呼びます
              </div>
              <div className={styles.equation}>
                <KMath tex={String.raw`i^2 = -1`} display />
              </div>
              <div className={styles.note} style={{ textAlign: "center", maxWidth: 460 }}>
                2乗すると −1 になる数を定義しました。
                実数の中には存在しないので、新しい数「i」を作りました。
              </div>
            </motion.div>
          )}

          {step >= 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
            >
              <div className={styles.bigFormula}>
                <KMath tex={String.raw`3 + 4i`} display />
              </div>
              <div className={styles.point} style={{ textAlign: "center" }}>
                実数と虚数を組み合わせた数 — これが複素数です
              </div>
              <div className={styles.note} style={{ textAlign: "center" }}>
                3 は実数部分、4i は虚数部分
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

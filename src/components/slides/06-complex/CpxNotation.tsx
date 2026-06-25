import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import styles from "./CpxCommon.module.scss";

/**
 * CpxNotation — 3 steps
 *
 * step 0: a+bi → re^{iθ} への書き換え、r=振幅, θ=位相
 * step 1: |e^{iθ}| = 1 — 絶対値で位相は消える
 * step 2: 観測確率 — 位相は消えるが、計算途中では影響する
 */
export function CpxNotation() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        表記の話
      </motion.div>

      <div className={styles.center}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}
            >
              <div className={styles.equation}>
                <KMath
                  tex={String.raw`a + bi \;=\; r\,e^{i\theta}`}
                  display
                />
              </div>
              <div className={styles.note} style={{ textAlign: "center" }}>
                書き換えることができる、くらいに思ってもらえれば大丈夫です
              </div>
              <div className={styles.equationRow}>
                <div className={styles.equation}>
                  <KMath tex={String.raw`r = |z| = \text{振幅}`} />
                </div>
                <div className={styles.equation}>
                  <KMath tex={String.raw`\theta = \arg(z) = \text{位相}`} />
                </div>
              </div>
              <div className={styles.equation} style={{ marginTop: "0.5rem" }}>
                <KMath tex={String.raw`3+4i = 5\,e^{i \cdot 0.927}`} display />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}
            >
              <div className={styles.bigFormula}>
                <KMath tex={String.raw`\bigl|e^{i\theta}\bigr| = 1`} display />
              </div>
              <div className={styles.point} style={{ textAlign: "center" }}>
                絶対値を取ると位相の項は消えて r だけが残ります
              </div>
              <div className={styles.equation}>
                <KMath
                  tex={String.raw`|r\,e^{i\theta}|^2 = r^2`}
                  display
                />
              </div>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}
            >
              <div className={styles.point} style={{ textAlign: "center" }}>
                観測確率を計算するとき、位相そのものは消えます
              </div>
              <div className={styles.equation}>
                <KMath
                  tex={String.raw`P = |\alpha|^2 \quad\leftarrow\quad \text{位相は残らない}`}
                  display
                />
              </div>
              <div className={styles.highlightBox} style={{ maxWidth: 500 }}>
                しかし計算途中では位相が振幅同士の足し算に影響するため、
                最終的な観測確率を変えることができます
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

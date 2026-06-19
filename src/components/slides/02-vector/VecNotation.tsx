import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import styles from "./VecNotation.module.scss";

/**
 * VecNotation — 2 steps
 *
 * step 0: 矢印表記と太字表記
 * step 1: ブラケット記法 (ケットとブラ)
 */
export function VecNotation() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ベクトルの記法
      </motion.div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="classic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
            >
              <div className={styles.notationGroup}>
                <div className={styles.notationBox}>
                  <div className={styles.notationLabel}>矢印表記</div>
                  <KMath
                    tex={String.raw`\vec{v} = \begin{pmatrix} 3 \\ 2 \end{pmatrix}`}
                    display
                  />
                </div>
                <div className={styles.notationBox}>
                  <div className={styles.notationLabel}>太字表記</div>
                  <KMath
                    tex={String.raw`\mathbf{v} = \begin{pmatrix} 3 \\ 2 \end{pmatrix}`}
                    display
                  />
                </div>
              </div>
              <div className={styles.note}>
                よくアルファベットの上に矢印をつけたり、太字で表されます
              </div>
            </motion.div>
          )}

          {step >= 1 && (
            <motion.div
              key="bracket"
              className={styles.bracketSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.note}>
                今回の講座ではブラケット記法を使います
              </div>
              <div className={styles.bracketRow}>
                <div className={`${styles.bracketBox} ${styles.highlight}`}>
                  <div className={styles.bracketLabel}>ケットベクトル（縦）</div>
                  <KMath
                    tex={String.raw`| v \rangle = \begin{pmatrix} 3 \\ 2 \end{pmatrix}`}
                    display
                  />
                </div>
                <div className={styles.bracketBox}>
                  <div className={styles.bracketLabel}>ブラベクトル（横）</div>
                  <KMath
                    tex={String.raw`\langle v | = \begin{pmatrix} 3 & 2 \end{pmatrix}`}
                    display
                  />
                </div>
              </div>
              <div className={styles.note}>
                縦なのか横なのかが表記だけで明確にわかるのがメリットです
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

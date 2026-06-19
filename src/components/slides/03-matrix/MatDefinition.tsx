import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import styles from "./MatCommon.module.scss";

/**
 * MatDefinition — 3 steps
 *
 * step 0: 行列とは — 数字を縦横に並べたもの
 * step 1: 記法 — 大文字で書く
 * step 2: ベクトルも行列の特殊ケース
 */
export function MatDefinition() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        行列とは
      </motion.div>

      <div className={styles.center}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className={styles.point}>
                数字を縦横に並べたものです。行と列を持っています。
              </div>
              <div className={styles.equationRow}>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}`}
                    display
                  />
                  <div className={styles.label}>2×2</div>
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`\begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}`}
                    display
                  />
                  <div className={styles.label}>3×3 (単位行列)</div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className={styles.point}>
                数学では大文字のアルファベットで書きます
              </div>
              <div className={styles.equationRow}>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}`}
                    display
                  />
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`I = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}`}
                    display
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className={styles.point}>
                実はベクトルも「行が1つ」「列が1つ」の行列です
              </div>
              <div className={styles.equationRow}>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`\begin{pmatrix} 1 \\ 0 \end{pmatrix} = |0\rangle`}
                    display
                  />
                  <div className={styles.label}>列が1つ → ケット</div>
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`\begin{pmatrix} 1 & 0 \end{pmatrix} = \langle 0|`}
                    display
                  />
                  <div className={styles.label}>行が1つ → ブラ</div>
                </div>
              </div>
              <div className={styles.note}>
                行列の計算ルールがそのままベクトルにも適用できます
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

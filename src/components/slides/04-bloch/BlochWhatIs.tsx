import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { InlineBloch } from "./InlineBloch";
import styles from "./BlochCommon.module.scss";

/**
 * BlochWhatIs — 2 steps
 *
 * step 0: ベクトル・行列・複素数を学んだが、イメージしにくい → 「？」
 * step 1: ブロッホ球 = 1量子ビットの状態を3次元で表現した図
 */
export function BlochWhatIs() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        ブロッホ球とは
      </motion.div>

      <div className={styles.twoCol}>
        <div className={styles.graphArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="g0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                  <div className={styles.topicList}>
                    {["ベクトル", "行列", "複素数"].map((t, i) => (
                      <motion.div
                        key={t}
                        className={styles.topicItem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                      >
                        <div className={styles.topicDot} />
                        {t}
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ fontSize: "1.5rem", color: "var(--color-ghost)", marginTop: "0.5rem" }}
                  >
                    →
                  </motion.div>
                  <motion.div
                    className={styles.question}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.5, scale: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    ？
                  </motion.div>
                </div>
              </motion.div>
            )}

            {step >= 1 && (
              <motion.div key="g1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <InlineBloch theta={Math.PI / 4} phi={Math.PI / 5} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.infoArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="i0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>
                  ここまでベクトル・行列・複素数を学んできました。
                </div>
                <div className={styles.note}>
                  しかし、これらを頭の中でイメージするのは大変です。
                </div>
              </motion.div>
            )}

            {step >= 1 && (
              <motion.div key="i1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.point}>
                  ブロッホ球は1量子ビットの状態を
                  3次元で表現した図です。
                </div>
                <div className={styles.equation} style={{ marginTop: "0.5rem" }}>
                  <KMath
                    tex={String.raw`|\psi\rangle = \cos\frac{\theta}{2}|0\rangle + e^{i\phi}\sin\frac{\theta}{2}|1\rangle`}
                    display
                  />
                </div>
                <div className={styles.note} style={{ marginTop: "0.5rem" }}>
                  球面上の1点が1つの量子状態に対応します
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

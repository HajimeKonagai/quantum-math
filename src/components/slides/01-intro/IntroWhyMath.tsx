import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { CrossMark } from "../../primitives/CrossMark";
import styles from "./IntroWhyMath.module.scss";

/**
 * IntroWhyMath — 7 steps (TSV: はじめに > なぜ数学が必要なの？)
 *
 * Screen A (step 0):
 *   Why? + 「数学」
 *
 * Screen B (steps 1–2):
 *   step 1: 「数学」→「量子力学」表示
 *   step 2: (+) バツ印追加
 *
 * Screen C (steps 3–4):
 *   step 3: 先にあったのは自然現象 (リスト)
 *   step 4: (+) 現象 → 数学 フロー追加
 *
 * Screen D (step 5):
 *   ベクトル・行列・複素数 + 採用フロー
 *
 * Screen E (step 6):
 *   数学は言葉
 */

const PHENOMENA = [
  "電子が波のように振る舞う",
  "重ね合わせが起こる",
  "干渉が起こる",
  "観測すると状態が変わる",
];

export function IntroWhyMath() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        なぜ数学が出てくるのか
      </motion.div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {/* Screen A: step 0 — Why? + 「数学」 */}
          {step === 0 && (
            <motion.div
              key="sA"
              className={styles.center}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.questionText}>Why?</div>
              <div className={styles.mathLabel}>数学</div>
            </motion.div>
          )}

          {/* Screen B: steps 1–2 — 数学→量子力学 → バツ印 */}
          {(step === 1 || step === 2) && (
            <motion.div
              key="sB"
              className={styles.center}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.questionText}>Why?</div>

              {step === 1 && (
                <div className={styles.flowRow}>
                  <span className={styles.mathLabel}>数学</span>
                  <span className={styles.arrow}>→</span>
                  <span className={styles.mathLabel}>量子力学</span>
                </div>
              )}

              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className={styles.crossBlock}>
                    <CrossMark>
                      <div className={styles.flowRow}>
                        <span className={styles.mathLabel}>数学</span>
                        <span className={styles.arrow}>→</span>
                        <span className={styles.mathLabel}>量子力学</span>
                      </div>
                    </CrossMark>
                  </div>
                  <div className={styles.caption}>
                    「数学で量子力学が作られている」わけではない
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Screen C: steps 3–4 — 現象リスト → フロー追加 */}
          {(step === 3 || step === 4) && (
            <motion.div
              key="sC"
              className={styles.center}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className={styles.sectionLabel}>
                先にあったのは自然現象です
              </div>
              <div className={styles.phenomenaList}>
                {PHENOMENA.map((p, i) => (
                  <motion.div
                    key={i}
                    className={styles.phenomenaItem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                  >
                    {p}
                  </motion.div>
                ))}
              </div>

              {step >= 4 && (
                <motion.div
                  className={styles.adoptionFlow}
                  style={{ marginTop: "1.5rem" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={styles.flowBox}>現象</div>
                  <div className={styles.flowArrowBlock}>
                    <span className={styles.bigArrow}>→</span>
                    <div className={styles.arrowLabels}>
                      <span>矛盾なく</span>
                      <span>記録し</span>
                      <span>予測する</span>
                    </div>
                  </div>
                  <div className={styles.flowBox} style={{ color: "var(--color-highlight)" }}>
                    数学
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Screen D: step 5 — ベクトル/行列/複素数 + 採用 */}
          {step === 5 && (
            <motion.div
              key="sD"
              className={styles.center}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className={styles.caption} style={{ marginBottom: "1rem" }}>
                なぜベクトルなの？ なぜ行列？ なぜ複素数？
              </div>
              <div className={styles.caption} style={{ color: "var(--color-ghost)", marginBottom: "1rem" }}>
                → 考える必要はありません
              </div>
              <div className={styles.toolList}>
                {["ベクトル", "行列", "複素数"].map((tool, i) => (
                  <motion.div
                    key={tool}
                    className={styles.toolItem}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.12 }}
                  >
                    {tool}
                  </motion.div>
                ))}
              </div>
              <div className={styles.adoptionFlow} style={{ marginTop: "1.5rem" }}>
                <div className={styles.flowBox}>実験結果を説明しよう</div>
                <span className={styles.bigArrow}>→</span>
                <div className={styles.flowBox} style={{ color: "var(--color-ket0)" }}>
                  ベクトルで書くと全部うまくいく
                </div>
                <span className={styles.bigArrow}>→</span>
                <div className={styles.flowBox} style={{ color: "var(--color-highlight)" }}>
                  採用!
                </div>
              </div>
            </motion.div>
          )}

          {/* Screen E: step 6 — 数学は言葉 */}
          {step >= 6 && (
            <motion.div
              key="sE"
              className={styles.center}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={styles.bigMessage}>
                数学は量子力学を説明するための<br />
                <span style={{ color: "var(--color-highlight)" }}>「言葉」</span>のようなもの
              </div>
              <div className={styles.caption} style={{ marginTop: "1.5rem" }}>
                今日はその言葉に少し触れてみましょう
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

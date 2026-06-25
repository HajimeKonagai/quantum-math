import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { InlineBloch } from "./InlineBloch";
import styles from "./BlochCommon.module.scss";

const KET0 = "#58c4dd";
const KET1 = "#83c167";
const ACCENT = "#ff862f";

/**
 * BlochStates — 2 steps
 *
 * step 0: 北極|0⟩、南極|1⟩、赤道|+⟩|−⟩ — 無数の状態
 * step 1: |+⟩と|−⟩は同じ50%50%だが球上では別の場所 → 位相の違い
 */
export function BlochStates() {
  const step = useStep();

  const highlights = [
    { theta: 0, phi: 0, color: KET0 },                   // |0⟩
    { theta: Math.PI, phi: 0, color: KET1 },              // |1⟩
    { theta: Math.PI / 2, phi: 0, color: ACCENT },        // |+⟩
    { theta: Math.PI / 2, phi: Math.PI, color: ACCENT },  // |−⟩
    { theta: Math.PI / 2, phi: Math.PI / 2, color: "#aaaacc" },  // |i⟩
    { theta: Math.PI / 2, phi: -Math.PI / 2, color: "#aaaacc" }, // |-i⟩
  ];

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        状態を見る
      </motion.div>

      <div className={styles.twoCol}>
        <div className={styles.graphArea}>
          <InlineBloch
            theta={Math.PI / 2}
            phi={0}
            showArrow={step >= 1}
            highlights={highlights}
            extraArrows={step >= 1 ? [{ theta: Math.PI / 2, phi: Math.PI, color: KET0 }] : undefined}
          />
        </div>

        <div className={styles.infoArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="i0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>
                  <span style={{ color: KET0 }}>|0⟩</span> と{" "}
                  <span style={{ color: KET1 }}>|1⟩</span> は球の両端
                </div>
                <div className={styles.note} style={{ marginTop: "0.3rem" }}>
                  北極 = |0⟩、南極 = |1⟩
                </div>
                <div className={styles.point} style={{ marginTop: "0.8rem" }}>
                  <span style={{ color: ACCENT }}>|+⟩</span> や{" "}
                  <span style={{ color: ACCENT }}>|−⟩</span> は赤道上
                </div>
                <div className={styles.note} style={{ marginTop: "0.3rem" }}>
                  北極と南極の間にも無数の状態があります
                </div>
              </motion.div>
            )}

            {step >= 1 && (
              <motion.div key="i1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.point}>
                  <span style={{ color: ACCENT }}>|+⟩</span> と{" "}
                  <span style={{ color: ACCENT }}>|−⟩</span> は
                  どちらも 50%/50%
                </div>
                <div className={styles.note} style={{ marginTop: "0.3rem" }}>
                  しかしブロッホ球上では別の場所に存在します
                </div>
                <div className={styles.highlightBox} style={{ marginTop: "1rem" }}>
                  位相の違いが位置の違いとして見える
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

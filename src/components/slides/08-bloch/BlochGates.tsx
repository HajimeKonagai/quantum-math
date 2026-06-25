import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { InlineBloch } from "./InlineBloch";
import styles from "./BlochCommon.module.scss";

const INV_SQRT2 = 1 / Math.sqrt(2);

/**
 * BlochGates — 3 steps
 *
 * step 0: 量子ゲートはブロッホ球上では回転。|0⟩に矢印
 * step 1: Xゲートは180°回転 → |0⟩が|1⟩へ
 * step 2: Hゲートも回転。回転軸を表示して|1⟩→|−⟩
 */
export function BlochGates() {
  const step = useStep();

  // step 0: arrow at |0⟩
  // step 1: arrow at |1⟩ (X gate applied), show X rotation axis
  // step 2: arrow at |−⟩ (H|1⟩ = |−⟩), show H rotation axis
  const theta = step === 0 ? 0 : step === 1 ? Math.PI : Math.PI / 2;
  const phi = step === 2 ? Math.PI : 0;
  const rotAxis: [number, number, number] | undefined =
    step === 1 ? [1, 0, 0] : step === 2 ? [INV_SQRT2, 0, INV_SQRT2] : undefined;

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        ゲートを見る
      </motion.div>

      <div className={styles.twoCol}>
        <div className={styles.graphArea}>
          <InlineBloch
            theta={theta}
            phi={phi}
            showArrow={true}
            rotationAxis={rotAxis}
          />
        </div>

        <div className={styles.infoArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="i0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>
                  量子ゲートはブロッホ球上では回転として表せます
                </div>
                <div className={styles.note} style={{ marginTop: "0.3rem" }}>
                  行列の計算が、球面上の回転として見えるようになります
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="i1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>
                  Xゲートは X軸まわりに 180° 回転
                </div>
                <div className={styles.equation} style={{ marginTop: "0.5rem" }}>
                  <KMath
                    tex={String.raw`X|0\rangle = |1\rangle`}
                    display
                  />
                </div>
                <div className={styles.note} style={{ marginTop: "0.5rem" }}>
                  北極 → 南極へ移動します
                </div>
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div key="i2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.point}>
                  Hゲートも回転として表せます
                </div>
                <div className={styles.equation} style={{ marginTop: "0.5rem" }}>
                  <KMath
                    tex={String.raw`H|1\rangle = |{-}\rangle`}
                    display
                  />
                </div>
                <div className={styles.note} style={{ marginTop: "0.5rem" }}>
                  (X+Z)/√2 軸まわりに 180° 回転
                </div>
                <div className={styles.highlightBox} style={{ marginTop: "0.8rem" }}>
                  行列の計算 = ブロッホ球の回転
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

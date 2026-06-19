import { AnimatePresence, motion } from "motion/react";
import { Vector, Circle, Text as MafsText } from "mafs";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { Graph2D } from "../../math-visuals/Graph2D";
import { AnimatedVector } from "../../math-visuals/AnimatedVector";
import { RAW_RESULT, RAW_ACCENT, RAW_GHOST } from "../../../utils/colors";
import styles from "./MatCommon.module.scss";

const INV_SQRT2 = 1 / Math.sqrt(2);

/**
 * MatGates — 3 steps
 *
 * step 0: 量子コンピュータでは行列 = ゲート
 * step 1: Xゲート — 0と1を反転
 * step 2: Hゲート — 重ね合わせを作る
 */
export function MatGates() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        量子ゲート
      </motion.div>

      <div className={styles.twoCol}>
        <div className={styles.graphArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="g0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className={styles.gateGrid}>
                  {["X", "Y", "Z", "H", "S", "T", "CNOT", "SWAP"].map((g, i) => (
                    <motion.div
                      key={g}
                      className={styles.gateChip}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      {g}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="g1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Graph2D width={300} height={300} xRange={[-0.3, 1.5]} yRange={[-0.3, 1.5]}>
                  <Circle center={[0, 0]} radius={1} color={RAW_GHOST} fillOpacity={0} strokeOpacity={0.25} />
                  {/* |0⟩ before */}
                  <Vector tip={[1, 0]} color={RAW_GHOST} weight={2} opacity={0.4} />
                  <MafsText x={1.1} y={-0.12} size={11} color={RAW_GHOST}>|0⟩</MafsText>
                  {/* X|0⟩ = |1⟩ */}
                  <AnimatedVector tip={[0, 1]} color={RAW_RESULT} weight={3} duration={0.6} />
                  <MafsText x={-0.18} y={1.12} size={11} color={RAW_RESULT}>|1⟩</MafsText>
                </Graph2D>
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div key="g2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Graph2D width={300} height={300} xRange={[-0.3, 1.5]} yRange={[-0.3, 1.5]}>
                  <Circle center={[0, 0]} radius={1} color={RAW_GHOST} fillOpacity={0} strokeOpacity={0.25} />
                  {/* |0⟩ before */}
                  <Vector tip={[1, 0]} color={RAW_GHOST} weight={2} opacity={0.4} />
                  <MafsText x={1.1} y={-0.12} size={11} color={RAW_GHOST}>|0⟩</MafsText>
                  {/* H|0⟩ = |+⟩ */}
                  <AnimatedVector tip={[INV_SQRT2, INV_SQRT2]} color={RAW_ACCENT} weight={3} duration={0.6} />
                  <MafsText x={INV_SQRT2 + 0.08} y={INV_SQRT2 + 0.12} size={11} color={RAW_ACCENT}>|+⟩</MafsText>
                </Graph2D>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.infoArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="i0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>
                  量子コンピュータでは行列 = ゲート
                </div>
                <div className={styles.note}>
                  ベクトル(状態)を変換する装置がゲートです
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="i1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>Xゲート — 0 と 1 を反転</div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`X = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}`}
                    display
                  />
                </div>
                <div className={styles.equation} style={{ marginTop: "0.5rem" }}>
                  <KMath
                    tex={String.raw`X|0\rangle = |1\rangle \quad X|1\rangle = |0\rangle`}
                    display
                  />
                </div>
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div key="i2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.point}>Hゲート — 重ね合わせを作る</div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`H = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}`}
                    display
                  />
                </div>
                <div className={styles.equation} style={{ marginTop: "0.5rem" }}>
                  <KMath
                    tex={String.raw`H|0\rangle = \frac{1}{\sqrt{2}}(|0\rangle + |1\rangle) = |{+}\rangle`}
                    display
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

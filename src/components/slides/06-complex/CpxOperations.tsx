import { AnimatePresence, motion } from "motion/react";
import { Vector, Text as MafsText, Circle, Plot } from "mafs";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { Graph2D } from "../../math-visuals/Graph2D";
import { AnimatedVector } from "../../math-visuals/AnimatedVector";
import { RAW_KET0, RAW_KET1, RAW_RESULT, RAW_ACCENT, RAW_GHOST } from "../../../utils/colors";
import styles from "./CpxCommon.module.scss";

/**
 * CpxOperations — 2 steps
 *
 * step 0: 足し算 — (1+2i) + (3+4i) = (4+6i)  on complex plane
 * step 1: 掛け算 — iをかけると90°回転、i² = -1 (180°)
 */
export function CpxOperations() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        複素数の演算
      </motion.div>

      <div className={styles.twoCol}>
        <div className={styles.graphArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Graph2D width={320} height={320} xRange={[-1, 7]} yRange={[-1, 7]}>
                  {/* a = 1+2i */}
                  <AnimatedVector tip={[1, 2]} color={RAW_KET0} weight={3} duration={0.5} />
                  <MafsText x={0.4} y={2.3} size={12} color={RAW_KET0}>1+2i</MafsText>
                  {/* b = 3+4i */}
                  <AnimatedVector tip={[3, 4]} color={RAW_KET1} weight={3} duration={0.5} delay={0.15} />
                  <MafsText x={3.4} y={3.6} size={12} color={RAW_KET1}>3+4i</MafsText>
                  {/* parallelogram guide */}
                  <AnimatedVector tail={[1, 2]} tip={[4, 6]} color={RAW_KET1} weight={1.5} opacity={0.4} duration={0.4} delay={0.4} />
                  {/* result = 4+6i */}
                  <AnimatedVector tip={[4, 6]} color={RAW_RESULT} weight={4} duration={0.5} delay={0.6} />
                  <MafsText x={4.4} y={6.2} size={14} color={RAW_RESULT}>4+6i</MafsText>
                  {/* axis labels */}
                  <MafsText x={6.5} y={-0.4} size={11} color={RAW_GHOST}>Re</MafsText>
                  <MafsText x={0.4} y={6.5} size={11} color={RAW_GHOST}>Im</MafsText>
                </Graph2D>
              </motion.div>
            )}

            {step >= 1 && (
              <motion.div key="mul" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Graph2D width={320} height={320} xRange={[-6, 6]} yRange={[-6, 6]}>
                  <Circle center={[0, 0]} radius={5} color={RAW_GHOST} fillOpacity={0} strokeOpacity={0.15} />
                  {/* original: 3+4i */}
                  <Vector tip={[3, 4]} color={RAW_KET0} weight={2} opacity={0.5} />
                  <MafsText x={3.4} y={4.4} size={12} color={RAW_KET0}>3+4i</MafsText>
                  {/* ×i → -4+3i (90° rotation) */}
                  <AnimatedVector tip={[-4, 3]} color={RAW_ACCENT} weight={3} duration={0.5} />
                  <MafsText x={-4.8} y={3.5} size={12} color={RAW_ACCENT}>−4+3i</MafsText>
                  {/* ×i² → -3-4i (180° rotation) */}
                  <AnimatedVector tip={[-3, -4]} color={RAW_RESULT} weight={3} duration={0.5} delay={0.3} />
                  <MafsText x={-3.5} y={-4.7} size={12} color={RAW_RESULT}>−3−4i</MafsText>
                  {/* 90° rotation arc from z to z×i */}
                  <Plot.Parametric
                    xy={(t) => [2.2 * Math.cos(t), 2.2 * Math.sin(t)]}
                    t={[Math.atan2(4, 3), Math.atan2(4, 3) + Math.PI / 2]}
                    color={RAW_ACCENT}
                    weight={1.5}
                    style="dashed"
                  />
                  {/* 180° rotation arc from z to z×i² */}
                  <Plot.Parametric
                    xy={(t) => [1.6 * Math.cos(t), 1.6 * Math.sin(t)]}
                    t={[Math.atan2(4, 3), Math.atan2(4, 3) + Math.PI]}
                    color={RAW_RESULT}
                    weight={1.5}
                    style="dashed"
                  />
                  <MafsText x={5.5} y={-0.4} size={11} color={RAW_GHOST}>Re</MafsText>
                  <MafsText x={0.4} y={5.5} size={11} color={RAW_GHOST}>Im</MafsText>
                </Graph2D>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.infoArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="i0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>足し算</div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`(1+2i) + (3+4i) = 4+6i`}
                    display
                  />
                </div>
                <div className={styles.note} style={{ marginTop: "0.5rem" }}>
                  実部同士、虚部同士を足すだけ。ベクトルの足し算と同じです。
                </div>
              </motion.div>
            )}

            {step >= 1 && (
              <motion.div key="i1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.point}>掛け算 = 回転</div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`(3{+}4i) \times i = -4{+}3i \quad(\text{90° 回転})`}
                    display
                  />
                </div>
                <div className={styles.equation} style={{ marginTop: "0.5rem" }}>
                  <KMath
                    tex={String.raw`(3{+}4i) \times i^2 = -3{-}4i \quad(\text{180° 回転})`}
                    display
                  />
                </div>
                <div className={styles.note} style={{ marginTop: "0.5rem" }}>
                  複素数の掛け算は複素平面上で「回転」として解釈できます
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

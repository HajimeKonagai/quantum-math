import { AnimatePresence, motion } from "motion/react";
import { Vector, Text as MafsText, Line } from "mafs";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { Graph2D } from "../../math-visuals/Graph2D";
import { AnimatedVector } from "../../math-visuals/AnimatedVector";
import { RAW_KET0, RAW_KET1, RAW_RESULT, RAW_ACCENT, RAW_GHOST } from "../../../utils/colors";
import styles from "./VecOperations.module.scss";

/**
 * VecOperations — 4 steps
 *
 * step 0: 足し算
 * step 1: スカラー倍
 * step 2: 基底のスカラー倍+足し算で全ベクトルが表せる
 * step 3: 今日の一言「分解する方が大事」
 */
export function VecOperations() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ベクトルの演算
      </motion.div>

      <div className={styles.content}>
        <div className={styles.graphArea}>
          <AnimatePresence mode="wait">
            {/* step 0: addition */}
            {step === 0 && (
              <motion.div key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Graph2D width={360} height={280}>
                  <AnimatedVector tip={[2, 1]} color={RAW_KET0} weight={3} duration={0.5} />
                  <MafsText x={2.2} y={0.6} size={14} color={RAW_KET0}>a</MafsText>
                  <AnimatedVector tip={[1, 2]} color={RAW_KET1} weight={3} duration={0.5} delay={0.15} />
                  <MafsText x={0.6} y={2.2} size={14} color={RAW_KET1}>b</MafsText>
                  <AnimatedVector tail={[2, 1]} tip={[3, 3]} color={RAW_KET1} weight={1.5} opacity={0.5} duration={0.4} delay={0.4} />
                  <AnimatedVector tip={[3, 3]} color={RAW_RESULT} weight={4} duration={0.5} delay={0.6} />
                  <MafsText x={3.3} y={3.2} size={14} color={RAW_RESULT}>a+b</MafsText>
                </Graph2D>
              </motion.div>
            )}

            {/* step 1: scalar multiplication */}
            {step === 1 && (
              <motion.div key="scalar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Graph2D width={360} height={280}>
                  <Vector tip={[1, 1.5]} color={RAW_GHOST} weight={2} opacity={0.4} />
                  <MafsText x={1.2} y={1.7} size={12} color={RAW_GHOST}>v</MafsText>
                  <AnimatedVector tip={[2, 3]} color={RAW_ACCENT} weight={3.5} duration={0.6} delay={0.2} />
                  <MafsText x={2.3} y={3.1} size={14} color={RAW_ACCENT}>2v</MafsText>
                </Graph2D>
              </motion.div>
            )}

            {/* step 2-3: basis decomposition */}
            {step >= 2 && (
              <motion.div key="basis" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Graph2D width={360} height={280} xRange={[-1, 5]} yRange={[-1, 4]}>
                  {/* basis vectors */}
                  <AnimatedVector tip={[1, 0]} color={RAW_KET0} weight={2.5} duration={0.4} />
                  <MafsText x={1.15} y={-0.25} size={12} color={RAW_KET0}>e₁</MafsText>
                  <AnimatedVector tip={[0, 1]} color={RAW_KET1} weight={2.5} duration={0.4} delay={0.1} />
                  <MafsText x={-0.3} y={1.15} size={12} color={RAW_KET1}>e₂</MafsText>

                  {/* component projections */}
                  <Line.Segment point1={[0, 0]} point2={[3, 0]} color={RAW_KET0} style="dashed" weight={1.5} />
                  <Line.Segment point1={[3, 0]} point2={[3, 2]} color={RAW_KET1} style="dashed" weight={1.5} />
                  <MafsText x={1.5} y={-0.3} size={11} color={RAW_KET0}>3</MafsText>
                  <MafsText x={3.3} y={1} size={11} color={RAW_KET1}>2</MafsText>

                  {/* result */}
                  <AnimatedVector tip={[3, 2]} color={RAW_RESULT} weight={3.5} duration={0.5} delay={0.3} />
                  <MafsText x={3.2} y={2.3} size={14} color={RAW_RESULT}>v</MafsText>
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
                    tex={String.raw`\begin{pmatrix}2\\1\end{pmatrix}+\begin{pmatrix}1\\2\end{pmatrix}=\begin{pmatrix}3\\3\end{pmatrix}`}
                    display
                  />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="i1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>スカラー倍</div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`2\begin{pmatrix}1\\1.5\end{pmatrix}=\begin{pmatrix}2\\3\end{pmatrix}`}
                    display
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="i2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>基底のスカラー倍 + 足し算</div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`\vec{v} = 3\begin{pmatrix}1\\0\end{pmatrix} + 2\begin{pmatrix}0\\1\end{pmatrix} = \begin{pmatrix}3\\2\end{pmatrix}`}
                    display
                  />
                </div>
                <div className={styles.note}>
                  平面上の全てのベクトルは、この2つの演算だけで表せます
                </div>
              </motion.div>
            )}

            {step >= 3 && (
              <motion.div key="i3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.point}>今日の一言</div>
                <div className={styles.quoteBox}>
                  ベクトルは足すより分解する方が大事です
                </div>
                <div className={styles.equation} style={{ marginTop: "1rem" }}>
                  <KMath
                    tex={String.raw`\begin{pmatrix}3\\2\end{pmatrix} = 3\begin{pmatrix}1\\0\end{pmatrix} + 2\begin{pmatrix}0\\1\end{pmatrix}`}
                    display
                  />
                </div>
                <div className={styles.note}>
                  どの基底にどれだけ含まれているか — これが量子の「測定」につながります
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

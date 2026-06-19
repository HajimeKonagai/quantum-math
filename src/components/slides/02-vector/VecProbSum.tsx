import { AnimatePresence, motion } from "motion/react";
import { Vector, Circle, Text as MafsText } from "mafs";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { CrossMark } from "../../primitives/CrossMark";
import { Graph2D } from "../../math-visuals/Graph2D";
import { RAW_KET0, RAW_GHOST } from "../../../utils/colors";
import styles from "./VecProbSum.module.scss";

/**
 * VecProbSum — 3 steps
 *
 * step 0: 確率の合計は1 — [10%, 40%] = 50% → ×
 * step 1: ベクトルの長さを1に固定 → 単位円
 * step 2: ピタゴラスの定理で長さ1を保つ
 */
export function VecProbSum() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        確率の合計は1
      </motion.div>

      <div className={styles.content}>
        <div className={styles.graphArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className={styles.equation} style={{ fontSize: "1.3rem" }}>
                  <CrossMark>
                    <KMath
                      tex={String.raw`\begin{pmatrix} 10\% \\ 40\% \end{pmatrix} \quad \Rightarrow \quad 10\% + 40\% = 50\%`}
                      display
                    />
                  </CrossMark>
                </div>
              </motion.div>
            )}

            {step >= 1 && (
              <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Graph2D width={340} height={340} xRange={[-1.5, 1.5]} yRange={[-1.5, 1.5]}>
                  <Circle center={[0, 0]} radius={1} color={RAW_KET0} fillOpacity={0} strokeOpacity={0.5} />

                  {/* Vector on unit circle */}
                  <Vector tip={[1, 0]} color={RAW_KET0} weight={3} />
                  <MafsText x={1.15} y={0.15} size={12} color={RAW_KET0}>|0⟩</MafsText>

                  <Vector tip={[0, 1]} color={RAW_GHOST} weight={2} opacity={0.5} />
                  <MafsText x={0.15} y={1.15} size={12} color={RAW_GHOST}>|1⟩</MafsText>

                  {step >= 2 && (
                    <>
                      <Vector tip={[Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)]} color={RAW_KET0} weight={3} opacity={0.7} />
                      <Vector tip={[Math.cos(Math.PI / 3), Math.sin(Math.PI / 3)]} color={RAW_KET0} weight={3} opacity={0.5} />
                      <Vector tip={[Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)]} color={RAW_KET0} weight={3} opacity={0.5} />
                    </>
                  )}
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
                  確率を足し合わせたときに 100% にならなければいけません
                </div>
                <div className={styles.warn} style={{ marginTop: "1rem" }}>
                  [10%, 40%] では残りの 50% に何が起きるのか説明できません
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="i1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>
                  ベクトルの長さを 1 に固定すれば、合計が常に1になります
                </div>
                <div className={styles.highlightBox} style={{ marginTop: "1rem" }}>
                  長さ1のベクトルは原点から距離1の円上を移動します。これを「単位円」と呼びます。
                </div>
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div key="i2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.point}>
                  ピタゴラスの定理を思い出してください
                </div>
                <div className={styles.equation} style={{ marginTop: "0.8rem" }}>
                  <KMath
                    tex={String.raw`a^2 + b^2 = 1`}
                    display
                  />
                </div>
                <div className={styles.note} style={{ marginTop: "0.8rem" }}>
                  単位円上でベクトルを動かす限り、成分の2乗の合計は常に1。
                  長さ1という約束を守れば確率は破綻しません。
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

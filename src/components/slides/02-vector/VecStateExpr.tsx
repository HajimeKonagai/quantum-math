import { AnimatePresence, motion } from "motion/react";
import { Circle, Text as MafsText, Line } from "mafs";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { Graph2D } from "../../math-visuals/Graph2D";
import { AnimatedVector } from "../../math-visuals/AnimatedVector";
import { RAW_KET0, RAW_KET1, RAW_RESULT, RAW_ACCENT, RAW_GHOST } from "../../../utils/colors";
import styles from "./VecStateExpr.module.scss";

const INV_SQRT2 = 1 / Math.sqrt(2);

/**
 * VecStateExpr — 4 steps
 *
 * step 0: 基底 |0⟩ |1⟩ をグラフに図示
 * step 1: スカラー倍 + 足し算で |ψ⟩ を表す
 * step 2: ∣ψ⟩=α∣0⟩+β∣1⟩ の式
 * step 3: 特殊ケース: 重ね合わさっていない場合
 */
export function VecStateExpr() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        状態表現
      </motion.div>

      <div className={styles.content}>
        <div className={styles.graphArea}>
          <Graph2D width={360} height={340} xRange={[-0.3, 1.5]} yRange={[-0.3, 1.5]}>
            <Circle center={[0, 0]} radius={1} color={RAW_GHOST} fillOpacity={0} strokeOpacity={0.25} />

            {/* Basis |0⟩ */}
            <AnimatedVector tip={[1, 0]} color={RAW_KET0} weight={2.5} duration={0.5} />
            <MafsText x={1.1} y={-0.12} size={13} color={RAW_KET0}>|0⟩</MafsText>

            {/* Basis |1⟩ */}
            <AnimatedVector tip={[0, 1]} color={RAW_KET1} weight={2.5} duration={0.5} delay={0.15} />
            <MafsText x={-0.15} y={1.1} size={13} color={RAW_KET1}>|1⟩</MafsText>

            {step >= 1 && (
              <>
                {/* State vector */}
                <AnimatedVector tip={[INV_SQRT2, INV_SQRT2]} color={RAW_RESULT} weight={3.5} duration={0.6} delay={0.1} />
                <MafsText x={INV_SQRT2 + 0.1} y={INV_SQRT2 + 0.1} size={13} color={RAW_RESULT}>|ψ⟩</MafsText>

                {/* Component projections */}
                <Line.Segment point1={[0, 0]} point2={[INV_SQRT2, 0]} color={RAW_KET0} style="dashed" weight={1.5} />
                <Line.Segment point1={[INV_SQRT2, 0]} point2={[INV_SQRT2, INV_SQRT2]} color={RAW_KET1} style="dashed" weight={1.5} />

                <MafsText x={INV_SQRT2 / 2} y={-0.1} size={10} color={RAW_KET0}>α</MafsText>
                <MafsText x={INV_SQRT2 + 0.12} y={INV_SQRT2 / 2} size={10} color={RAW_KET1}>β</MafsText>
              </>
            )}

            {step >= 3 && (
              <>
                {/* |0⟩ state (no superposition) */}
                <AnimatedVector tip={[1, 0]} color={RAW_ACCENT} weight={2} opacity={0.6} duration={0.4} />
              </>
            )}
          </Graph2D>
        </div>

        <div className={styles.infoArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="i0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>
                  各軸の長さ1のベクトルを基底と呼びます
                </div>
                <div className={styles.exampleRow}>
                  <div className={styles.exampleItem}>
                    <KMath tex={String.raw`\textcolor{#58C4DD}{|0\rangle} = \begin{pmatrix} 1 \\ 0 \end{pmatrix}`} /> — x軸方向
                  </div>
                  <div className={styles.exampleItem}>
                    <KMath tex={String.raw`\textcolor{#83C167}{|1\rangle} = \begin{pmatrix} 0 \\ 1 \end{pmatrix}`} /> — y軸方向
                  </div>
                </div>
                <div className={styles.note}>
                  |i⟩ の中に整数が入っていると、その軸だと考えてください
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="i1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>
                  基底のスカラー倍と足し算で表せます
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`|{\psi}\rangle = \alpha\,|0\rangle + \beta\,|1\rangle`}
                    display
                  />
                </div>
                <div className={styles.note}>
                  αとβ は「2乗すると確率になる数」(振幅)です
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="i2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>
                  50%/50% の例
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`|{\psi}\rangle = \frac{1}{\sqrt{2}}\,|0\rangle + \frac{1}{\sqrt{2}}\,|1\rangle`}
                    display
                  />
                </div>
                <div className={styles.note}>
                  これは |0⟩ と |1⟩ の重ね合わせ状態です
                </div>
              </motion.div>
            )}

            {step >= 3 && (
              <motion.div key="i3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.point}>
                  重ね合わさっていない場合
                </div>
                <div className={styles.exampleRow}>
                  <div className={styles.exampleItem}>
                    <KMath tex={String.raw`|{\psi}\rangle = |0\rangle`} />
                    <span className={styles.note}> — 100% の確率で 0 が観測される</span>
                  </div>
                  <div className={styles.exampleItem}>
                    <KMath tex={String.raw`|{\psi}\rangle = |1\rangle`} />
                    <span className={styles.note}> — 100% の確率で 1 が観測される</span>
                  </div>
                </div>
                <div className={styles.note} style={{ marginTop: "0.8rem" }}>
                  片方の振幅が 0 のとき重ね合わせではなく、観測結果は確定します
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

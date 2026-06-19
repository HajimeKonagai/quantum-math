import { AnimatePresence, motion } from "motion/react";
import { Vector, Circle, Plot, Text as MafsText, Line } from "mafs";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { AppLauncher } from "../../primitives/AppLauncher";
import { Graph2D } from "../../math-visuals/Graph2D";
import { RAW_KET0, RAW_KET1, RAW_RESULT, RAW_ACCENT, RAW_GHOST } from "../../../utils/colors";
import styles from "./NormalizationWhy.module.scss";

/**
 * NormalizationWhy — 4 steps
 *
 * step 0: (0.5, 0.5) をプロットし、単位円の内側に落ちることを示す
 *         → p₁+p₂=1 でも p₁²+p₂²≠1
 * step 1: 他の p₁+p₂=1 の例: (0.7, 0.3), (0.9, 0.1) も円の内側
 *         + 軌跡 (直線 p₁+p₂=1) をプロット → 単位円弧と対比
 * step 2: 正しい例: (1/√2, 1/√2) は円上にある → 合計 = 1
 * step 3: まとめ: 正規化条件 |α₀|² + |α₁|² = 1 → アプリへの導線
 */

const RAW_LINE = "#c678dd"; // purple for the p₁+p₂=1 line

export function NormalizationWhy() {
  const step = useStep();

  const invSqrt2 = 1 / Math.sqrt(2);

  return (
    <div className={styles.slide}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        なぜ正規化が必要か
      </motion.div>

      {step >= 1 && (
        <motion.div
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {step < 3 ? "確率の合計が1でも、単位円上には乗らない" : "正規化条件"}
        </motion.div>
      )}

      <div className={styles.content}>
        <div className={styles.graphArea}>
          <AnimatePresence mode="wait">
            {/* step 0: (0.5, 0.5) — p₁+p₂=1 but inside the circle */}
            {step === 0 && (
              <motion.div
                key="s0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Graph2D width={380} height={340} xRange={[-0.3, 1.5]} yRange={[-0.3, 1.5]}>
                  <Circle center={[0, 0]} radius={1} color={RAW_GHOST} fillOpacity={0} strokeOpacity={0.3} />

                  {/* (0.5, 0.5) — inside the circle */}
                  <Vector tip={[0.5, 0.5]} color={RAW_RESULT} weight={3} />
                  <MafsText x={0.58} y={0.63} size={13} color={RAW_RESULT}>(0.5, 0.5)</MafsText>

                  {/* dashed projections */}
                  <Line.Segment point1={[0, 0]} point2={[0.5, 0]} color={RAW_KET0} style="dashed" weight={1.5} />
                  <Line.Segment point1={[0.5, 0]} point2={[0.5, 0.5]} color={RAW_KET1} style="dashed" weight={1.5} />

                  {/* Axis labels */}
                  <MafsText x={1.35} y={-0.12} size={12} color={RAW_GHOST}>|0⟩</MafsText>
                  <MafsText x={0.08} y={1.35} size={12} color={RAW_GHOST}>|1⟩</MafsText>
                </Graph2D>
              </motion.div>
            )}

            {/* step 1: multiple examples with p₁+p₂=1, all inside circle + locus */}
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Graph2D width={380} height={340} xRange={[-0.3, 1.5]} yRange={[-0.3, 1.5]}>
                  <Circle center={[0, 0]} radius={1} color={RAW_GHOST} fillOpacity={0} strokeOpacity={0.3} />

                  {/* Locus: straight line p₁+p₂=1 from (1,0) to (0,1) */}
                  <Line.Segment
                    point1={[1, 0]}
                    point2={[0, 1]}
                    color={RAW_LINE}
                    weight={2}
                    opacity={0.7}
                  />
                  <MafsText x={0.65} y={0.55} size={10} color={RAW_LINE}>p₀+p₁=1</MafsText>

                  {/* Unit circle arc (first quadrant) for contrast */}
                  <Plot.Parametric
                    xy={(t) => [Math.cos(t), Math.sin(t)]}
                    t={[0, Math.PI / 2]}
                    color={RAW_ACCENT}
                    weight={2.5}
                    opacity={0.8}
                  />
                  <MafsText x={0.55} y={0.95} size={10} color={RAW_ACCENT}>|α₀|²+|α₁|²=1</MafsText>

                  {/* (0.7, 0.3) */}
                  <Vector tip={[0.7, 0.3]} color={RAW_RESULT} weight={3} />
                  <MafsText x={0.82} y={0.22} size={11} color={RAW_RESULT}>(0.7, 0.3)</MafsText>

                  {/* (0.9, 0.1) */}
                  <Vector tip={[0.9, 0.1]} color={RAW_KET0} weight={3} />
                  <MafsText x={1.02} y={0.05} size={11} color={RAW_KET0}>(0.9, 0.1)</MafsText>

                  {/* (0.2, 0.8) */}
                  <Vector tip={[0.2, 0.8]} color={RAW_KET1} weight={3} />
                  <MafsText x={0.05} y={0.9} size={11} color={RAW_KET1}>(0.2, 0.8)</MafsText>

                  {/* (0.5, 0.5) ghost from step 0 */}
                  <Vector tip={[0.5, 0.5]} color={RAW_GHOST} weight={2} opacity={0.5} />

                  <MafsText x={1.35} y={-0.12} size={12} color={RAW_GHOST}>|0⟩</MafsText>
                  <MafsText x={0.08} y={1.35} size={12} color={RAW_GHOST}>|1⟩</MafsText>
                </Graph2D>
              </motion.div>
            )}

            {/* step 2: correct normalized vector */}
            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Graph2D width={380} height={340} xRange={[-0.3, 1.5]} yRange={[-0.3, 1.5]}>
                  {/* Locus line (ghost) */}
                  <Line.Segment
                    point1={[1, 0]}
                    point2={[0, 1]}
                    color={RAW_LINE}
                    weight={1.5}
                    opacity={0.3}
                  />

                  {/* Unit circle arc (correct locus) */}
                  <Plot.Parametric
                    xy={(t) => [Math.cos(t), Math.sin(t)]}
                    t={[0, Math.PI / 2]}
                    color={RAW_ACCENT}
                    weight={2.5}
                    opacity={0.7}
                  />

                  {/* Ghost of (0.5, 0.5) for comparison */}
                  <Vector tip={[0.5, 0.5]} color={RAW_GHOST} weight={2} opacity={0.3} />
                  <MafsText x={0.35} y={0.58} size={10} color={RAW_GHOST}>(0.5, 0.5)</MafsText>

                  {/* Correct: (1/√2, 1/√2) — on the circle */}
                  <Vector tip={[invSqrt2, invSqrt2]} color={RAW_KET0} weight={3.5} />
                  <Line.Segment point1={[0, 0]} point2={[invSqrt2, 0]} color={RAW_KET0} style="dashed" weight={1} />
                  <Line.Segment point1={[invSqrt2, 0]} point2={[invSqrt2, invSqrt2]} color={RAW_KET1} style="dashed" weight={1} />

                  {/* Angle arc */}
                  <Plot.Parametric
                    xy={(t) => [0.25 * Math.cos(t), 0.25 * Math.sin(t)]}
                    t={[0, Math.PI / 4]}
                    color={RAW_ACCENT}
                    weight={1.5}
                  />
                  <MafsText x={0.35} y={0.12} size={10} color={RAW_ACCENT}>45°</MafsText>

                  <MafsText x={invSqrt2 + 0.08} y={invSqrt2 + 0.1} size={12} color={RAW_KET0}>
                    (1/√2, 1/√2)
                  </MafsText>

                  <MafsText x={1.35} y={-0.12} size={12} color={RAW_GHOST}>|0⟩</MafsText>
                  <MafsText x={0.08} y={1.35} size={12} color={RAW_GHOST}>|1⟩</MafsText>
                </Graph2D>
              </motion.div>
            )}

            {/* step 3: summary */}
            {step >= 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Graph2D width={380} height={340} xRange={[-0.3, 1.5]} yRange={[-0.3, 1.5]}>
                  {/* Locus line (ghost) */}
                  <Line.Segment
                    point1={[1, 0]}
                    point2={[0, 1]}
                    color={RAW_LINE}
                    weight={1.5}
                    opacity={0.25}
                  />
                  <MafsText x={0.65} y={0.55} size={9} color={RAW_LINE}>p₀+p₁=1</MafsText>

                  {/* Unit circle arc (correct locus) */}
                  <Plot.Parametric
                    xy={(t) => [Math.cos(t), Math.sin(t)]}
                    t={[0, Math.PI / 2]}
                    color={RAW_ACCENT}
                    weight={2.5}
                    opacity={0.7}
                  />
                  <MafsText x={0.55} y={0.95} size={9} color={RAW_ACCENT}>|α₀|²+|α₁|²=1</MafsText>

                  <Vector tip={[invSqrt2, invSqrt2]} color={RAW_KET0} weight={3.5} />
                  <MafsText x={invSqrt2 + 0.08} y={invSqrt2 + 0.1} size={12} color={RAW_KET0}>|ψ⟩</MafsText>

                  {/* Basis vectors on the circle */}
                  <Vector tip={[1, 0]} color={RAW_GHOST} weight={2} opacity={0.4} />
                  <MafsText x={1.08} y={0.1} size={10} color={RAW_GHOST}>|0⟩</MafsText>
                  <Vector tip={[0, 1]} color={RAW_GHOST} weight={2} opacity={0.4} />
                  <MafsText x={0.1} y={1.1} size={10} color={RAW_GHOST}>|1⟩</MafsText>

                  <MafsText x={1.35} y={-0.12} size={12} color={RAW_GHOST}>|0⟩</MafsText>
                  <MafsText x={0.08} y={1.35} size={12} color={RAW_GHOST}>|1⟩</MafsText>
                </Graph2D>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.infoArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="info0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={styles.point}>
                  確率を「そのまま」成分に入れるとどうなる？
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`\begin{pmatrix} 0.5 \\ 0.5 \end{pmatrix} \quad \Rightarrow \quad 0.5^2 + 0.5^2 = 0.5 \neq 1`}
                    display
                  />
                </div>
                <div className={styles.note}>
                  確率の合計は 0.5 + 0.5 = 1 だが…
                </div>
                <div className={styles.warn}>
                  単位円上にない = 有効な量子状態ではない
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="info1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={styles.point}>
                  確率の合計が1でも全て円の内側に落ちる
                </div>
                <div className={styles.exampleList}>
                  <div className={styles.exampleItem}>
                    <span style={{ color: RAW_RESULT }}>(0.7, 0.3)</span>
                    <KMath tex={String.raw`0.49 + 0.09 = 0.58`} />
                  </div>
                  <div className={styles.exampleItem}>
                    <span style={{ color: RAW_KET0 }}>(0.9, 0.1)</span>
                    <KMath tex={String.raw`0.81 + 0.01 = 0.82`} />
                  </div>
                  <div className={styles.exampleItem}>
                    <span style={{ color: RAW_KET1 }}>(0.2, 0.8)</span>
                    <KMath tex={String.raw`0.04 + 0.64 = 0.68`} />
                  </div>
                </div>
                <div className={styles.legend}>
                  <span style={{ color: RAW_LINE }}>━</span>{" "}
                  <KMath tex="p_0 + p_1 = 1" /> の軌跡(直線)
                </div>
                <div className={styles.legend}>
                  <span style={{ color: RAW_ACCENT }}>━</span>{" "}
                  <KMath tex={String.raw`|\alpha_0|^2 + |\alpha_1|^2 = 1`} /> の軌跡(円弧)
                </div>
                <div className={styles.note}>
                  直線は常に円弧の内側 → 確率をそのまま入れると「足りない」
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="info2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={styles.point}>
                  正しくは「確率の平方根」を成分にする
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`\begin{pmatrix} \frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}} \end{pmatrix} \quad \Rightarrow \quad \left(\frac{1}{\sqrt{2}}\right)^{\!2} + \left(\frac{1}{\sqrt{2}}\right)^{\!2} = 1 \;\checkmark`}
                    display
                  />
                </div>
                <div className={styles.note}>
                  50%ずつの確率 → 成分は 0.5 ではなく{" "}
                  <KMath tex={String.raw`\frac{1}{\sqrt{2}} \approx 0.707`} />
                </div>
              </motion.div>
            )}

            {step >= 3 && (
              <motion.div
                key="info3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={styles.point}>
                  正規化条件
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`|\alpha_0|^2 + |\alpha_1|^2 = 1`}
                    display
                  />
                </div>
                <div className={styles.note}>
                  有効な量子状態ベクトルは必ず単位円(球)上にある
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <AppLauncher
                    appId="probability-vector"
                    params={{ tab: "2d" }}
                    label="確率ベクトルで試す"
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

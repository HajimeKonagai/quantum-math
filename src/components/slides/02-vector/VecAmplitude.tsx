import { AnimatePresence, motion } from "motion/react";
import { Vector, Circle, Plot, Text as MafsText, Line } from "mafs";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { AppLauncher } from "../../primitives/AppLauncher";
import { Graph2D } from "../../math-visuals/Graph2D";
import { RAW_KET0, RAW_KET1, RAW_ACCENT, RAW_GHOST } from "../../../utils/colors";
import styles from "./VecAmplitude.module.scss";

const INV_SQRT2 = 1 / Math.sqrt(2);

/**
 * VecAmplitude — 3 steps
 *
 * step 0: 1/√2 の2乗 = 1/2 = 50% の例
 * step 1: 他の例 (25%, 75%) → 単位円上での対応
 * step 2: まとめ: 2乗すると確率になる数 + 単位円 + アプリ導線
 */
export function VecAmplitude() {
  const step = useStep();

  const angle25 = Math.asin(Math.sqrt(0.25)); // arcsin(0.5) = π/6
  const cos25 = Math.cos(angle25);
  const sin25 = Math.sin(angle25);

  return (
    <div className={styles.slide}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        振幅 — 2乗すると確率になる数
      </motion.div>

      <div className={styles.content}>
        <div className={styles.graphArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="g0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Graph2D width={340} height={340} xRange={[-0.3, 1.5]} yRange={[-0.3, 1.5]}>
                  <Circle center={[0, 0]} radius={1} color={RAW_GHOST} fillOpacity={0} strokeOpacity={0.3} />
                  <Vector tip={[INV_SQRT2, INV_SQRT2]} color={RAW_KET0} weight={3.5} />
                  <Line.Segment point1={[0, 0]} point2={[INV_SQRT2, 0]} color={RAW_KET0} style="dashed" weight={1} />
                  <Line.Segment point1={[INV_SQRT2, 0]} point2={[INV_SQRT2, INV_SQRT2]} color={RAW_KET1} style="dashed" weight={1} />
                  <MafsText x={INV_SQRT2 / 2} y={-0.1} size={11} color={RAW_KET0}>1/√2</MafsText>
                  <MafsText x={INV_SQRT2 + 0.12} y={INV_SQRT2 / 2} size={11} color={RAW_KET1}>1/√2</MafsText>
                  <Plot.Parametric
                    xy={(t) => [0.25 * Math.cos(t), 0.25 * Math.sin(t)]}
                    t={[0, Math.PI / 4]}
                    color={RAW_ACCENT}
                    weight={1.5}
                  />
                  <MafsText x={0.35} y={0.12} size={10} color={RAW_ACCENT}>45°</MafsText>
                  <MafsText x={1.35} y={-0.1} size={12} color={RAW_GHOST}>|0⟩</MafsText>
                  <MafsText x={0.08} y={1.35} size={12} color={RAW_GHOST}>|1⟩</MafsText>
                </Graph2D>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="g1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Graph2D width={340} height={340} xRange={[-0.3, 1.5]} yRange={[-0.3, 1.5]}>
                  <Circle center={[0, 0]} radius={1} color={RAW_ACCENT} fillOpacity={0} strokeOpacity={0.4} />
                  {/* 50/50 */}
                  <Vector tip={[INV_SQRT2, INV_SQRT2]} color={RAW_GHOST} weight={2} opacity={0.4} />
                  <MafsText x={INV_SQRT2 + 0.08} y={INV_SQRT2 + 0.1} size={10} color={RAW_GHOST}>50/50</MafsText>
                  {/* 75/25 */}
                  <Vector tip={[cos25, sin25]} color={RAW_KET0} weight={3} />
                  <Line.Segment point1={[0, 0]} point2={[cos25, 0]} color={RAW_KET0} style="dashed" weight={1} />
                  <Line.Segment point1={[cos25, 0]} point2={[cos25, sin25]} color={RAW_KET1} style="dashed" weight={1} />
                  <MafsText x={cos25 + 0.12} y={sin25 + 0.08} size={10} color={RAW_KET0}>75/25</MafsText>
                  {/* 25/75 */}
                  <Vector tip={[sin25, cos25]} color={RAW_KET1} weight={3} />
                  <MafsText x={sin25 - 0.05} y={cos25 + 0.1} size={10} color={RAW_KET1}>25/75</MafsText>
                  <MafsText x={1.35} y={-0.1} size={12} color={RAW_GHOST}>|0⟩</MafsText>
                  <MafsText x={0.08} y={1.35} size={12} color={RAW_GHOST}>|1⟩</MafsText>
                </Graph2D>
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div key="g2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Graph2D width={340} height={340} xRange={[-0.3, 1.5]} yRange={[-0.3, 1.5]}>
                  <Circle center={[0, 0]} radius={1} color={RAW_ACCENT} fillOpacity={0} strokeOpacity={0.5} />
                  <Vector tip={[INV_SQRT2, INV_SQRT2]} color={RAW_KET0} weight={3.5} />
                  <MafsText x={INV_SQRT2 + 0.08} y={INV_SQRT2 + 0.1} size={12} color={RAW_KET0}>|ψ⟩</MafsText>
                  <Vector tip={[1, 0]} color={RAW_GHOST} weight={2} opacity={0.4} />
                  <MafsText x={1.08} y={0.1} size={10} color={RAW_GHOST}>|0⟩</MafsText>
                  <Vector tip={[0, 1]} color={RAW_GHOST} weight={2} opacity={0.4} />
                  <MafsText x={0.1} y={1.1} size={10} color={RAW_GHOST}>|1⟩</MafsText>
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
                  50%ずつの場合
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`a^2 + a^2 = 1 \;\Rightarrow\; a = \frac{1}{\sqrt{2}} \approx 0.707`}
                    display
                  />
                </div>
                <div className={styles.equation} style={{ marginTop: "0.5rem" }}>
                  <KMath
                    tex={String.raw`\left(\frac{1}{\sqrt{2}}\right)^{\!2} = \frac{1}{2} = 50\%`}
                    display
                  />
                </div>
                <div className={styles.note}>
                  成分は 0.5 ではなく 1/√2 ≈ 0.707 です
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="i1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>
                  他の確率でも同じ仕組み
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`25\%\;\Rightarrow\; \frac{1}{\sqrt{4}} = 0.5 \quad\left(0.5^2 = 0.25\right)`}
                    display
                  />
                </div>
                <div className={styles.equation} style={{ marginTop: "0.5rem" }}>
                  <KMath
                    tex={String.raw`75\%\;\Rightarrow\; \sqrt{0.75} \approx 0.866`}
                    display
                  />
                </div>
                <div className={styles.note}>
                  全てのパターンで単位円上に乗ります
                </div>
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div key="i2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.highlightBox}>
                  ベクトルの中身は確率がそのまま入っているわけではなく、
                  「2乗すると確率になる数」が入っています
                </div>
                <div className={styles.equation} style={{ marginTop: "0.8rem" }}>
                  <KMath
                    tex={String.raw`|\alpha_0|^2 + |\alpha_1|^2 = 1`}
                    display
                  />
                </div>
                <div className={styles.note}>
                  単位円上でベクトルを動かす限り、成分の2乗の合計は常に1になります
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

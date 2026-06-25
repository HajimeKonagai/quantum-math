import { AnimatePresence, motion } from "motion/react";
import { Text as MafsText, Line, Polygon } from "mafs";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { Graph2D } from "../../math-visuals/Graph2D";
import { RAW_KET0, RAW_RESULT, RAW_GHOST } from "../../../utils/colors";
import styles from "./IpCommon.module.scss";

/**
 * IpProbability — 6 steps
 *
 * step 0: 内積 ≠ 観測結果
 * step 1: ピタゴラスの定理復習 (3-4-5)
 * step 2: 正規化 → |成分|² 合計 = 1
 * step 3: 合計1 = 確率条件
 * step 4: |·|² 適用 → 観測確率
 * step 5: まとめ — なぜ |·|² か
 */
export function IpProbability() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        観測確率
      </motion.div>

      <AnimatePresence mode="wait">
        {/* step 0: 内積 ≠ 観測結果 */}
        {step === 0 && (
          <motion.div
            key="s0"
            className={styles.center}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.point} style={{ textAlign: "center", maxWidth: 520 }}>
              内積で求まるのは「0が出る確率」「1が出る確率」です
            </div>
            <div className={styles.equationRow}>
              <div className={styles.equation}>
                <KMath tex={String.raw`P(0) = |\langle 0|\psi\rangle|^2`} />
              </div>
              <div className={styles.equation}>
                <KMath tex={String.raw`P(1) = |\langle 1|\psi\rangle|^2`} />
              </div>
            </div>
            <div className={styles.highlightBox} style={{ maxWidth: 500 }}>
              実際の観測結果（0か1か）はその後に決まります
            </div>
          </motion.div>
        )}

        {/* step 1: ピタゴラスの定理 */}
        {step === 1 && (
          <motion.div
            key="s1"
            className={styles.twoCol}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.graphArea}>
              <Graph2D width={320} height={320} xRange={[-0.5, 5.5]} yRange={[-0.5, 5.5]}>
                {/* 3-4-5 right triangle */}
                <Polygon
                  points={[[0, 0], [3, 0], [3, 4]]}
                  color={RAW_KET0}
                  fillOpacity={0.08}
                  strokeOpacity={0.6}
                />
                {/* side labels */}
                <MafsText x={1.5} y={-0.3} size={14} color={RAW_KET0}>3</MafsText>
                <MafsText x={3.3} y={2} size={14} color={RAW_KET0}>4</MafsText>
                {/* hypotenuse */}
                <Line.Segment point1={[0, 0]} point2={[3, 4]} color={RAW_RESULT} weight={3} />
                <MafsText x={1.2} y={2.4} size={14} color={RAW_RESULT}>5</MafsText>
                {/* right angle mark */}
                <Polygon
                  points={[[2.6, 0], [2.6, 0.4], [3, 0.4]]}
                  color={RAW_GHOST}
                  fillOpacity={0}
                  strokeOpacity={0.5}
                />
              </Graph2D>
            </div>

            <div className={styles.infoArea}>
              <div className={styles.point}>ピタゴラスの定理</div>
              <div className={styles.equation}>
                <KMath tex={String.raw`a^2 + b^2 = c^2`} display />
              </div>
              <div className={styles.equation}>
                <KMath tex={String.raw`3^2 + 4^2 = 5^2`} display />
              </div>
              <div className={styles.equation}>
                <KMath tex={String.raw`9 + 16 = 25`} display />
              </div>
            </div>
          </motion.div>
        )}

        {/* step 2: 正規化条件 */}
        {step === 2 && (
          <motion.div
            key="s2"
            className={styles.center}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.point} style={{ textAlign: "center" }}>
              量子状態は長さ1（正規化）
            </div>
            <div className={styles.equation}>
              <KMath
                tex={String.raw`\left(\frac{1}{\sqrt{2}}\right)^2 + \left(\frac{1}{\sqrt{2}}\right)^2 = \frac{1}{2} + \frac{1}{2} = 1`}
                display
              />
            </div>
            <div className={styles.note} style={{ textAlign: "center", maxWidth: 500 }}>
              各成分の絶対値の2乗の合計は必ず1になります
            </div>
          </motion.div>
        )}

        {/* step 3: 合計1 = 確率条件 */}
        {step === 3 && (
          <motion.div
            key="s3"
            className={styles.center}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.point} style={{ textAlign: "center" }}>
              合計が1 — これはまさに確率の条件です
            </div>
            <div className={styles.bigFormula}>
              <KMath
                tex={String.raw`\frac{1}{2}\;(50\%) \;+\; \frac{1}{2}\;(50\%) \;=\; 1\;(100\%)`}
                display
              />
            </div>
            <div className={styles.note} style={{ textAlign: "center", maxWidth: 480 }}>
              全ての結果の確率を足すと100%になる — 確率の基本条件と一致します
            </div>
          </motion.div>
        )}

        {/* step 4: |·|² → 観測確率 */}
        {step === 4 && (
          <motion.div
            key="s4"
            className={styles.center}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.point} style={{ textAlign: "center" }}>
              内積の結果に |·|² を適用して観測確率にする
            </div>
            <div className={styles.stepFlow}>
              <div className={styles.equation}>
                <KMath tex={String.raw`\langle i | \psi \rangle`} />
              </div>
              <div className={styles.stepArrow}>→</div>
              <div className={styles.equation}>
                <KMath tex={String.raw`\bigl|\langle i | \psi \rangle\bigr|^2`} />
              </div>
              <div className={styles.stepArrow}>→</div>
              <div className={styles.equation}>
                <KMath tex={String.raw`P(i)`} />
              </div>
            </div>
            <div className={styles.label}>内積</div>
            <div className={styles.note} style={{ textAlign: "center", marginTop: "0.5rem" }}>
              絶対値の2乗を取ることで、結果が必ず0以上の実数になり、確率として使えます
            </div>
          </motion.div>
        )}

        {/* step 5: まとめ */}
        {step >= 5 && (
          <motion.div
            key="s5"
            className={styles.center}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={styles.point} style={{ textAlign: "center", maxWidth: 520 }}>
              絶対値の2乗を取るのは「確率をプラスにする」だけではありません
            </div>
            <div className={styles.highlightBox} style={{ maxWidth: 520 }}>
              ベクトルの長さのルール（ピタゴラスの定理）と一致するからこそ、確率として解釈できるのです
            </div>
            <div className={styles.equation} style={{ marginTop: "0.5rem" }}>
              <KMath
                tex={String.raw`|\alpha|^2 + |\beta|^2 = 1 \quad \Leftrightarrow \quad P(0) + P(1) = 1`}
                display
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

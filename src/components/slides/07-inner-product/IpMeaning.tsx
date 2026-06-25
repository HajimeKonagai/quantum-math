import { AnimatePresence, motion } from "motion/react";
import { Vector, Text as MafsText, Line } from "mafs";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { Graph2D } from "../../math-visuals/Graph2D";
import { AnimatedVector } from "../../math-visuals/AnimatedVector";
import { RAW_KET0, RAW_KET1, RAW_RESULT, RAW_GHOST } from "../../../utils/colors";
import styles from "./IpCommon.module.scss";

const INV_SQRT2 = 1 / Math.sqrt(2);

/**
 * IpMeaning — 2 steps
 *
 * step 0: 行列積として計算 → スカラー
 * step 1: 意味の解釈 + Graph2D 投影
 */
export function IpMeaning() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        内積の意味
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="s0"
            className={styles.center}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.point} style={{ textAlign: "center" }}>
              行列積のルールで計算できます
            </div>
            <div className={styles.equation}>
              <KMath
                tex={String.raw`\langle 0 | + \rangle = \begin{pmatrix} 1 & 0 \end{pmatrix} \begin{pmatrix} \frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}} \end{pmatrix} = \frac{1}{\sqrt{2}}`}
                display
              />
            </div>
            <div className={styles.highlightBox} style={{ maxWidth: 460 }}>
              答えは 1×1 行列 = ただの数（スカラー）
            </div>
          </motion.div>
        )}

        {step >= 1 && (
          <motion.div
            key="s1"
            className={styles.twoCol}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={styles.graphArea}>
              <Graph2D width={340} height={340} xRange={[-0.3, 1.5]} yRange={[-0.3, 1.5]}>
                {/* |0⟩ axis */}
                <Vector tip={[1, 0]} color={RAW_KET0} weight={2} opacity={0.5} />
                <MafsText x={1.15} y={-0.12} size={14} color={RAW_KET0}>|0⟩</MafsText>
                {/* |1⟩ axis */}
                <Vector tip={[0, 1]} color={RAW_KET1} weight={2} opacity={0.5} />
                <MafsText x={-0.12} y={1.15} size={14} color={RAW_KET1}>|1⟩</MafsText>
                {/* |+⟩ vector */}
                <AnimatedVector tip={[INV_SQRT2, INV_SQRT2]} color={RAW_RESULT} weight={3} duration={0.5} />
                <MafsText x={INV_SQRT2 + 0.12} y={INV_SQRT2 + 0.1} size={14} color={RAW_RESULT}>|+⟩</MafsText>
                {/* projection onto |0⟩ */}
                <Line.Segment
                  point1={[INV_SQRT2, INV_SQRT2]}
                  point2={[INV_SQRT2, 0]}
                  color={RAW_GHOST}
                  style="dashed"
                  weight={1.5}
                />
                {/* projection onto |1⟩ */}
                <Line.Segment
                  point1={[INV_SQRT2, INV_SQRT2]}
                  point2={[0, INV_SQRT2]}
                  color={RAW_GHOST}
                  style="dashed"
                  weight={1.5}
                />
              </Graph2D>
            </div>

            <div className={styles.infoArea}>
              <div className={styles.point}>
                ある状態が、別の状態に<br />どれだけ含まれているか
              </div>
              <div className={styles.equation}>
                <KMath
                  tex={String.raw`\langle 0 | + \rangle = \frac{1}{\sqrt{2}}`}
                  display
                />
              </div>
              <div className={styles.equation}>
                <KMath
                  tex={String.raw`\langle 1 | + \rangle = \frac{1}{\sqrt{2}}`}
                  display
                />
              </div>
              <div className={styles.note} style={{ marginTop: "0.5rem" }}>
                |+⟩ は |0⟩ と |1⟩ を同じ割合で含んでいます
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

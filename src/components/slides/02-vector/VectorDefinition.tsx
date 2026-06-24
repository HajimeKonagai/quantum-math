import { AnimatePresence, motion } from "motion/react";
import { Text as MafsText } from "mafs";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { Graph2D } from "../../math-visuals/Graph2D";
import { AnimatedVector } from "../../math-visuals/AnimatedVector";
import { RAW_KET0, RAW_ACCENT } from "../../../utils/colors";
import styles from "./VectorDefinition.module.scss";

/**
 * VectorDefinition — 2 steps (TSV: ベクトル > ベクトルとは > 定義)
 *
 * step 0: 2D ベクトル [3, 2] — 「向き」と「大きさ」をもった矢印
 * step 1: 各成分の説明 (x=3, y=2) — 破線表示
 */
export function VectorDefinition() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ベクトルとは
      </motion.div>

      <div className={styles.content}>
        <div className={styles.graphArea}>
          <Graph2D width={380} height={280}>
            <AnimatedVector tip={[3, 2]} color={RAW_KET0} weight={3} duration={0.6} />
            <MafsText x={3.3} y={2.2} size={14} color={RAW_KET0}>|v⟩</MafsText>
            {step >= 1 && (
              <>
                <AnimatedVector tip={[3, 0]} color={RAW_ACCENT} weight={1.5} duration={0.4} />
                <AnimatedVector tip={[3, 2]} tail={[3, 0]} color={RAW_ACCENT} weight={1.5} duration={0.4} delay={0.2} />
                <MafsText x={1.5} y={-0.3} size={12} color={RAW_ACCENT}>3</MafsText>
                <MafsText x={3.3} y={1} size={12} color={RAW_ACCENT}>2</MafsText>
              </>
            )}
          </Graph2D>
        </div>

        <div className={styles.infoArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="i0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>
                  「向き」と「大きさ」をもった矢印、いくつかの数字の組
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`| v \rangle = \begin{pmatrix} 3 \\ 2 \end{pmatrix}`}
                    display
                  />
                </div>
              </motion.div>
            )}

            {step >= 1 && (
              <motion.div key="i1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.point}>
                  各成分はx方向に3、y方向に2を表しています
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`| v \rangle = \begin{pmatrix} \textcolor{#FF862F}{3} \\ \textcolor{#FF862F}{2} \end{pmatrix}`}
                    display
                  />
                </div>
                <div className={styles.note}>
                  成分の数だけ次元があります（この場合は2次元）
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

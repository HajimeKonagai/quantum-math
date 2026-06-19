import { AnimatePresence, motion } from "motion/react";
import { Vector, Text as MafsText } from "mafs";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { Graph2D } from "../../math-visuals/Graph2D";
import { AnimatedVector } from "../../math-visuals/AnimatedVector";
import { RAW_KET0, RAW_KET1, RAW_ACCENT, RAW_GHOST } from "../../../utils/colors";
import styles from "./VectorDefinition.module.scss";

/**
 * VectorDefinition — 4 steps (TSV: ベクトル > ベクトルとは)
 *
 * step 0: 2D ベクトル [3, 2] — 「向き」と「大きさ」をもった矢印
 * step 1: 各成分の説明 (x=3, y=2) — 破線表示
 * step 2: 足し算 [2,1] + [1,2] = [3,3] — 合力
 * step 3: スカラー倍 2 * [1, 1.5] = [2, 3]
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
          <AnimatePresence mode="wait">
            {/* steps 0-1: definition + components */}
            {step < 2 && (
              <motion.div
                key="g-def"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Graph2D width={380} height={280}>
                  <AnimatedVector tip={[3, 2]} color={RAW_KET0} weight={3} duration={0.6} />
                  <MafsText x={3.3} y={2.2} size={14} color={RAW_KET0}>v</MafsText>
                  {step >= 1 && (
                    <>
                      <AnimatedVector tip={[3, 0]} color={RAW_ACCENT} weight={1.5} duration={0.4} />
                      <AnimatedVector tip={[3, 2]} tail={[3, 0]} color={RAW_ACCENT} weight={1.5} duration={0.4} delay={0.2} />
                      <MafsText x={1.5} y={-0.3} size={12} color={RAW_ACCENT}>3</MafsText>
                      <MafsText x={3.3} y={1} size={12} color={RAW_ACCENT}>2</MafsText>
                    </>
                  )}
                </Graph2D>
              </motion.div>
            )}

            {/* step 2: addition */}
            {step === 2 && (
              <motion.div
                key="g-add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Graph2D width={380} height={280}>
                  <AnimatedVector tip={[2, 1]} color={RAW_KET0} weight={3} duration={0.5} />
                  <MafsText x={2.2} y={0.6} size={14} color={RAW_KET0}>a</MafsText>

                  <AnimatedVector tip={[1, 2]} color={RAW_KET1} weight={3} duration={0.5} delay={0.15} />
                  <MafsText x={0.6} y={2.2} size={14} color={RAW_KET1}>b</MafsText>

                  {/* shifted b from tip of a */}
                  <AnimatedVector tail={[2, 1]} tip={[3, 3]} color={RAW_KET1} weight={1.5} opacity={0.5} duration={0.4} delay={0.4} />

                  {/* resultant */}
                  <AnimatedVector tip={[3, 3]} color={RAW_ACCENT} weight={3.5} duration={0.5} delay={0.6} />
                  <MafsText x={3.3} y={3.2} size={14} color={RAW_ACCENT}>a+b</MafsText>
                </Graph2D>
              </motion.div>
            )}

            {/* step 3: scalar multiplication */}
            {step >= 3 && (
              <motion.div
                key="g-scalar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Graph2D width={380} height={280}>
                  <Vector tip={[1, 1.5]} color={RAW_GHOST} weight={2} opacity={0.4} />
                  <MafsText x={1.2} y={1.7} size={12} color={RAW_GHOST}>v</MafsText>

                  <AnimatedVector tip={[2, 3]} color={RAW_ACCENT} weight={3.5} duration={0.6} delay={0.2} />
                  <MafsText x={2.3} y={3.1} size={14} color={RAW_ACCENT}>2v</MafsText>
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
                  「向き」と「大きさ」をもった矢印、いくつかの数字の組
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`\vec{v} = \begin{pmatrix} 3 \\ 2 \end{pmatrix}`}
                    display
                  />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="i1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>
                  各成分はx方向に3、y方向に2を表しています
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`\vec{v} = \begin{pmatrix} \textcolor{#FF862F}{3} \\ \textcolor{#FF862F}{2} \end{pmatrix}`}
                    display
                  />
                </div>
                <div className={styles.note}>
                  成分の数だけ次元があります（この場合は2次元）
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="i2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>
                  足し算 — 合力として考えることができます
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`\begin{pmatrix}2\\1\end{pmatrix}+\begin{pmatrix}1\\2\end{pmatrix}=\begin{pmatrix}3\\3\end{pmatrix}`}
                    display
                  />
                </div>
              </motion.div>
            )}

            {step >= 3 && (
              <motion.div key="i3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.point}>
                  スカラー倍 — 数字をかけて大きさを変える
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`2\begin{pmatrix}1\\1.5\end{pmatrix}=\begin{pmatrix}2\\3\end{pmatrix}`}
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

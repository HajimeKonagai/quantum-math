import { useState, useEffect } from "react";
import { animate } from "motion";
import { AnimatePresence, motion } from "motion/react";
import { Vector, Circle, Text as MafsText } from "mafs";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { Graph2D } from "../../math-visuals/Graph2D";
import { AnimatedVector } from "../../math-visuals/AnimatedVector";
import { RAW_RESULT, RAW_ACCENT, RAW_GHOST } from "../../../utils/colors";
import styles from "./MatCommon.module.scss";

/**
 * MatTransform — 2 steps
 *
 * step 0: 2D でベクトルが行列によって変化する様子
 * step 1: (+) 複数のベクトルで空間ごと変化するイメージ
 */

// Apply 2x2 matrix to vector
function matVec(m: number[], v: [number, number]): [number, number] {
  return [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]];
}

// Rotation matrix (90° counterclockwise)
const ROT90 = [0, -1, 1, 0];

export function MatTransform() {
  const step = useStep();

  // Animate a single vector being transformed
  const original: [number, number] = [1, 0];
  const transformed = matVec(ROT90, original);
  const [tip, setTip] = useState<[number, number]>(original);

  useEffect(() => {
    const cx = animate(original[0], transformed[0], {
      duration: 0.8,
      delay: 0.5,
      ease: "easeInOut",
      onUpdate: (v) => setTip((prev) => [v, prev[1]]),
    });
    const cy = animate(original[1], transformed[1], {
      duration: 0.8,
      delay: 0.5,
      ease: "easeInOut",
      onUpdate: (v) => setTip((prev) => [prev[0], v]),
    });
    return () => { cx.stop(); cy.stop(); };
  }, []);

  // Additional vectors for step 1
  const extras: [number, number][] = [
    [0.8, 0.3],
    [0.5, 0.7],
    [0.3, 0.9],
  ];

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        行列によるベクトル変換
      </motion.div>

      <div className={styles.twoCol}>
        <div className={styles.graphArea}>
          <Graph2D width={340} height={340} xRange={[-1.5, 1.5]} yRange={[-1.5, 1.5]}>
            <Circle center={[0, 0]} radius={1} color={RAW_GHOST} fillOpacity={0} strokeOpacity={0.25} />

            {/* Ghost original */}
            <Vector tip={original} color={RAW_GHOST} weight={2} opacity={0.4} />
            <MafsText x={1.1} y={-0.12} size={11} color={RAW_GHOST}>|ψ⟩</MafsText>

            {/* Animated transformed */}
            <Vector tip={tip} color={RAW_RESULT} weight={3} />
            <MafsText x={transformed[0] - 0.2} y={transformed[1] + 0.12} size={11} color={RAW_RESULT}>|ψ'⟩</MafsText>

            {step >= 1 && extras.map((v, i) => {
              const t = matVec(ROT90, v);
              return (
                <g key={i}>
                  <Vector tip={v} color={RAW_GHOST} weight={1.5} opacity={0.3} />
                  <AnimatedVector tip={t} color={RAW_ACCENT} weight={2} opacity={0.6} duration={0.5} delay={i * 0.15} />
                </g>
              );
            })}
          </Graph2D>
        </div>

        <div className={styles.infoArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="i0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>行列をかけるとベクトルが変換されます</div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`\underset{\text{90°回転}}{\begin{pmatrix} 0 & -1 \\ 1 & 0 \end{pmatrix}} \begin{pmatrix} 1 \\ 0 \end{pmatrix} = \begin{pmatrix} 0 \\ 1 \end{pmatrix}`}
                    display
                  />
                </div>
              </motion.div>
            )}

            {step >= 1 && (
              <motion.div key="i1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.point}>
                  全てのベクトルが同じルールで変換されます
                </div>
                <div className={styles.note}>
                  空間全体が一様に変換される — これが行列の本質です
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

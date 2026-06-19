import { motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math } from "../../primitives/Math";
import styles from "./GoalFormula.module.scss";

/**
 * GoalFormula — 2 steps
 *
 * step 0: P(i)=|⟨i|U|ψ⟩|² を大きく表示
 * step 1: 各パーツに色と意味をつける
 */
export function GoalFormula() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        今日のゴール
      </motion.div>

      <div className={styles.content}>
        <motion.div
          className={styles.formulaBox}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {step === 0 && (
            <Math
              tex={String.raw`P(i) = \left| \langle i | \, U \, | \psi \rangle \right|^2`}
              display
            />
          )}
          {step >= 1 && (
            <Math
              tex={String.raw`P(i) = \left| \textcolor{#FFFF00}{\langle i |} \; \textcolor{#FF862F}{U} \; \textcolor{#58C4DD}{| \psi \rangle} \right|^{\textcolor{#83C167}{2}}`}
              display
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: step >= 0 ? 1 : 0 }}
          style={{ fontSize: "1.1rem", color: "var(--color-ghost)" }}
        >
          この式を抵抗なく読めるようになることが目標です
        </motion.div>

        {step >= 1 && (
          <motion.div
            className={styles.annotationGrid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.annotationItem}>
              <span style={{ color: "#58C4DD", fontSize: "1.2rem" }}>
                <Math tex={String.raw`| \psi \rangle`} />
              </span>
              <span className={styles.annotationLabel}>→ 状態</span>
            </div>
            <div className={styles.annotationItem}>
              <span style={{ color: "#FF862F", fontSize: "1.2rem" }}>
                <Math tex="U" />
              </span>
              <span className={styles.annotationLabel}>→ 操作</span>
            </div>
            <div className={styles.annotationItem}>
              <span style={{ color: "#FFFF00", fontSize: "1.2rem" }}>
                <Math tex={String.raw`\langle i |`} />
              </span>
              <span className={styles.annotationLabel}>→ 測定</span>
            </div>
            <div className={styles.annotationItem}>
              <span style={{ color: "#83C167", fontSize: "1.2rem" }}>
                <Math tex={String.raw`| \cdot |^2`} />
              </span>
              <span className={styles.annotationLabel}>→ 確率</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

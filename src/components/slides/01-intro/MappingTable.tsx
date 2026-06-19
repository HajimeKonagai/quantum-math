import { motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import styles from "./MappingTable.module.scss";

const ROWS = [
  { quantum: "状態", math: "ベクトル", cs: "メモリ", color: "var(--color-ket0)" },
  { quantum: "操作", math: "行列", cs: "CPU演算", color: "var(--color-accent)" },
  { quantum: "測定", math: "内積", cs: "読み取り", color: "var(--color-highlight)" },
  { quantum: "位相", math: "複素数", cs: "値", color: "var(--color-ket1)" },
  { quantum: "可視化", math: "ブロッホ球", cs: "キュビット", color: "var(--color-result)" },
];

/**
 * MappingTable — 3 steps
 *
 * step 0: 量子の概念を表示
 * step 1: → 数学ツール を追加
 * step 2: → コンピューター用語 を追加 (補足)
 */
export function MappingTable() {
  const step = useStep();

  const showMath = step >= 1;
  const showCS = step >= 2;
  const cols = showCS ? styles.cols3 : showMath ? styles.cols2 : styles.cols2;

  return (
    <div className={styles.slide}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        対応表
      </motion.div>

      {step >= 2 && (
        <motion.div
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ※理解の補助として（若干の間違いを含みます）
        </motion.div>
      )}

      <div className={styles.content}>
        <motion.div
          className={`${styles.table} ${cols}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          layout
        >
          {/* Header */}
          <div className={styles.headerCell}>量子</div>
          {showMath && (
            <motion.div
              className={styles.headerCell}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              数学
            </motion.div>
          )}
          {showCS && (
            <motion.div
              className={styles.headerCell}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              コンピューター
            </motion.div>
          )}

          {/* Rows */}
          {ROWS.map((row, i) => (
            <motion.div
              key={`q-${i}`}
              style={{ display: "contents" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className={styles.cell} style={{ color: row.color }}>
                {row.quantum}
              </div>
              {showMath && (
                <motion.div
                  className={styles.cell}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <span className={styles.arrow}>→</span> {row.math}
                </motion.div>
              )}
              {showCS && (
                <motion.div
                  className={styles.cell}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <span className={styles.arrow}>→</span> {row.cs}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import styles from "./TocTopicList.module.scss";

const TOPICS = [
  { name: "ベクトル", cs: "メモリ", color: "var(--color-ket0)" },
  { name: "複素数", cs: "値", color: "var(--color-ket1)" },
  { name: "行列", cs: "演算", color: "var(--color-accent)" },
  { name: "内積", cs: "読み取り (READ)", color: "var(--color-highlight)" },
];

/**
 * TocTopicList — 3 steps
 *
 * step 0: タイトル + 4トピック
 * step 1: CS用語との対応（矢印 + 右カラム）
 * step 2: 補足注釈
 */
export function TocTopicList() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        今日のトピック
      </motion.div>

      <div className={styles.grid}>
        {/* Left: topics */}
        <div className={styles.column}>
          <AnimatePresence>
            {TOPICS.map((t, i) => (
              <motion.div
                key={t.name}
                className={styles.topicItem}
                style={{ color: t.color }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {t.name}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Arrows */}
        {step >= 1 && (
          <div className={styles.arrowCol}>
            {TOPICS.map((_, i) => (
              <motion.div
                key={`arrow-${i}`}
                className={styles.arrowItem}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                →
              </motion.div>
            ))}
          </div>
        )}

        {/* Right: CS terms */}
        {step >= 1 && (
          <div className={styles.column}>
            {TOPICS.map((t, i) => (
              <motion.div
                key={`cs-${i}`}
                className={styles.topicItem}
                style={{ color: t.color }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
              >
                {t.cs}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* step 2: 注釈 */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            className={styles.note}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ※ 理解のための対応表です（実際の定義とは異なります）
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import styles from "./VecAsState.module.scss";

/**
 * VecAsState — 3 steps
 *
 * step 0: ベクトル = 状態
 * step 1: 古典ビット 0 or 1
 * step 2: 量子ビット(キュビット) — 重ね合わせ
 */
export function VecAsState() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        量子コンピュータにおけるベクトル
      </motion.div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
            >
              <div className={styles.bigEquation}>
                ベクトル = 状態
              </div>
              <div className={styles.point}>
                量子コンピュータでは、ベクトルは「状態」を表します
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
            >
              <div className={styles.point}>
                そもそも「状態」とは？
              </div>
              <div className={styles.point}>
                古典コンピュータでいうところの 0 や 1 のこと
              </div>
              <div className={styles.bitRow}>
                <div style={{ textAlign: "center" }}>
                  <div className={`${styles.bitBox} ${styles.bit0}`}>0</div>
                  <div className={styles.bitLabel}>OFF</div>
                </div>
                <div style={{ fontSize: "1.5rem", color: "var(--color-ghost)" }}>or</div>
                <div style={{ textAlign: "center" }}>
                  <div className={`${styles.bitBox} ${styles.bit1}`}>1</div>
                  <div className={styles.bitLabel}>ON</div>
                </div>
              </div>
              <div className={styles.note}>
                ビットは 0 か 1 かいずれかの「状態」になります
              </div>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
            >
              <div className={styles.point}>
                量子ビット（キュビット）
              </div>
              <div className={styles.bitRow}>
                <div style={{ textAlign: "center" }}>
                  <div className={`${styles.bitBox} ${styles.bit0}`}>0</div>
                </div>
                <div style={{ fontSize: "1.2rem", color: "var(--color-ghost)" }}>+</div>
                <div style={{ textAlign: "center" }}>
                  <div className={`${styles.bitBox} ${styles.bit1}`}>1</div>
                </div>
                <div style={{ fontSize: "1.2rem", color: "var(--color-ghost)" }}>=</div>
                <div style={{ textAlign: "center" }}>
                  <div className={styles.qubitBox}>?</div>
                  <div className={styles.bitLabel}>重ね合わせ</div>
                </div>
              </div>
              <div className={styles.point}>
                0 でもあり 1 でもある状態を作れます
              </div>
              <div className={styles.note}>
                量子ビットのことをキュビット (qubit) といいます
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

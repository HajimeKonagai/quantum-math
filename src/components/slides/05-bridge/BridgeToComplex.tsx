import { motion } from "motion/react";
import styles from "./BridgeCommon.module.scss";

/**
 * BridgeToComplex — 1 step
 *
 * step 0: Phase arrow rotating 360° continuously.
 *         |+⟩ and |−⟩ are special cases (0°, 180°).
 *         Complex numbers can represent arbitrary phase.
 */
export function BridgeToComplex() {
  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        実数から複素数へ
      </motion.div>

      <div className={styles.twoCol}>
        <div className={styles.graphArea}>
          <div className={styles.phaseCircle}>
            <div className={styles.phaseRing} />
            <div className={styles.phaseArrow} />
            {/* 0° label */}
            <span style={{
              position: "absolute", right: -30, top: "50%", transform: "translateY(-50%)",
              fontSize: "0.8rem", color: "var(--color-ghost)",
            }}>0°</span>
            {/* 90° label */}
            <span style={{
              position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)",
              fontSize: "0.8rem", color: "var(--color-ghost)",
            }}>90°</span>
            {/* 180° label */}
            <span style={{
              position: "absolute", left: -35, top: "50%", transform: "translateY(-50%)",
              fontSize: "0.8rem", color: "var(--color-ghost)",
            }}>180°</span>
            {/* 270° label */}
            <span style={{
              position: "absolute", bottom: -20, left: "50%", transform: "translateX(-50%)",
              fontSize: "0.8rem", color: "var(--color-ghost)",
            }}>270°</span>
          </div>
        </div>

        <div className={styles.infoArea}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.point}>
              |+⟩ と |−⟩ は位相の中の<br />
              0° と 180° という特殊なケース
            </div>
            <div className={styles.note} style={{ marginTop: "0.5rem" }}>
              45°, 90° など、実際にはそれ以外の角度も「位相」には存在します。
            </div>
            <div className={styles.highlightBox} style={{ marginTop: "1rem" }}>
              複素数を使うことで、その位相を表すことができます
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

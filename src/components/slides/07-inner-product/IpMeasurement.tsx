import { motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import styles from "./IpCommon.module.scss";

/**
 * IpMeasurement — 1 step
 *
 * step 0: 内積 → |·|² → 観測確率 の連鎖
 */
export function IpMeasurement() {
  useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        測定
      </motion.div>

      <div className={styles.center}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
        >
          <div className={styles.point} style={{ textAlign: "center" }}>
            量子力学では、内積を使って観測確率を計算します
          </div>

          <div className={styles.stepFlow}>
            <div className={styles.equation}>
              <KMath tex={String.raw`\langle 0 | + \rangle = \frac{1}{\sqrt{2}}`} />
            </div>
            <div className={styles.stepArrow}>→</div>
            <div className={styles.equation}>
              <KMath tex={String.raw`\left|\frac{1}{\sqrt{2}}\right|^2 = \frac{1}{2}`} />
            </div>
            <div className={styles.stepArrow}>→</div>
            <div className={styles.equation}>
              <KMath tex={String.raw`50\%`} />
            </div>
          </div>

          <div className={styles.highlightBox} style={{ maxWidth: 500 }}>
            内積の結果に絶対値の2乗を取ると観測確率になります
          </div>
        </motion.div>
      </div>
    </div>
  );
}

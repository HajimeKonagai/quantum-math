import { motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import styles from "./NxtCommon.module.scss";

/**
 * NxtSummary — 1 step
 *
 * step 0: 最後の一言 — 数学は量子コンピューターの共通言語
 */
export function NxtSummary() {
  useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        最後の一言
      </motion.div>

      <div className={styles.center}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
        >
          <div className={styles.point} style={{ textAlign: "center", maxWidth: 520 }}>
            本日学んだベクトル・複素数・行列・内積は、
            全てもつれを正しく記述するための道具でした
          </div>
          <div className={styles.highlightBox} style={{ maxWidth: 520 }}>
            今日学んだ数学は、量子コンピューターそのものではありません。
            しかし、量子コンピューターを理解するための共通言語です。
          </div>
          <div className={styles.note} style={{ textAlign: "center", maxWidth: 480 }}>
            次回からは、この言葉を使って量子コンピューターが実際にどう動いているのかを見ていきましょう
          </div>
        </motion.div>
      </div>
    </div>
  );
}

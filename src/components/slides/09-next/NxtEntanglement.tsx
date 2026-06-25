import { motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import styles from "./NxtCommon.module.scss";

/**
 * NxtEntanglement — 1 step
 *
 * step 0: 多重キュビットの重ね合わせ → もつれの導入
 */
export function NxtEntanglement() {
  useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        もつれ
      </motion.div>

      <div className={styles.center}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
        >
          <div className={styles.point} style={{ textAlign: "center", maxWidth: 520 }}>
            多重キュビットでも重ね合わせを状態として持てます
          </div>
          <div className={styles.highlightBox} style={{ maxWidth: 520 }}>
            ここから、多重キュビットの重ね合わせと、
            なぜ重ね合わせが必要なのかをみていきます
          </div>
        </motion.div>
      </div>
    </div>
  );
}

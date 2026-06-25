import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import styles from "./NxtCommon.module.scss";

/**
 * NxtMultiQubit — 2 steps
 *
 * step 0: ここまでの復習 — 状態→ベクトル, 操作→行列, etc.
 * step 1: 全て1キュビットだった → 複数キュビットの世界へ
 */
export function NxtMultiQubit() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        多重キュビット
      </motion.div>

      <div className={styles.center}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
            >
              <div className={styles.point} style={{ textAlign: "center" }}>
                ここまで学んできた量子力学の道具
              </div>
              <div className={styles.mappingTable}>
                <span>状態</span>
                <span className={styles.mappingArrow}>→</span>
                <span>ベクトル</span>
                <span>操作</span>
                <span className={styles.mappingArrow}>→</span>
                <span>行列</span>
                <span>位相</span>
                <span className={styles.mappingArrow}>→</span>
                <span>複素数</span>
                <span>観測確率</span>
                <span className={styles.mappingArrow}>→</span>
                <span>内積</span>
              </div>
            </motion.div>
          )}

          {step >= 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
            >
              <div className={styles.point} style={{ textAlign: "center", maxWidth: 520 }}>
                ここまで扱っていたのは全て「1つの量子ビット」の話です
              </div>
              <div className={styles.highlightBox} style={{ maxWidth: 520 }}>
                実際の量子コンピューターは複数の量子ビットを扱います。
                そこから量子コンピューターらしさが本格的に現れます。
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

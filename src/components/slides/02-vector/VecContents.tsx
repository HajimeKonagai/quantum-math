import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { AppLauncher } from "../../primitives/AppLauncher";
import styles from "./VecContents.module.scss";

/**
 * VecContents — 3 steps
 *
 * step 0: ベクトルの中身 = 確率を決めるための値
 * step 1: 確率アプリで触ってみる
 * step 2: 重ね合わせに対して操作できる
 */
export function VecContents() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ベクトルの中身
      </motion.div>

      <div className={styles.content}>
        <div className={styles.infoArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="s0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={styles.point}>
                  キュビットも最終的に観測される状態は 0 か 1 のどちらかですが、
                  観測するまでの間は「重ね合わせ」にできます。
                </div>
                <div className={styles.point} style={{ marginTop: "1rem" }}>
                  観測後に 0 か 1 のどちらかになるかは<strong>確率</strong>によって決まります。
                </div>
                <div className={styles.highlightBox} style={{ marginTop: "1rem" }}>
                  ベクトルの各成分には、その確率を決めるための値が入っています。
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={styles.point}>
                  今は確率を表していると思ってください。
                  まずはさわってイメージを掴んでください。
                </div>
                <div className={styles.note} style={{ marginTop: "0.5rem" }}>
                  ※この図は間違いも含んでいますが、後ほど修正します。
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <AppLauncher
                    appId="probability-vector"
                    params={{ tab: "2d" }}
                    label="確率ベクトルを触ってみる"
                  />
                </div>
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.highlightBox}>
                  観測するまでは、「重ね合わせ」に対して操作・演算を行うことができます。
                </div>
                <div className={styles.point} style={{ marginTop: "1rem" }}>
                  ここが量子コンピュータの面白いところです。
                </div>
                <div className={styles.note} style={{ marginTop: "1rem" }}>
                  0 と 1 の重ね合わせ状態のまま、ゲート(行列)を適用して計算を進められます。
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

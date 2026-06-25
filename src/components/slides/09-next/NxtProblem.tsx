import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { CrossMark } from "../../primitives/CrossMark";
import styles from "./NxtCommon.module.scss";

/**
 * NxtProblem — 5 steps
 *
 * step 0: ビットが増えると情報が増える
 * step 1: 複数ビットで重ね合わせをどう表現する？
 * step 2: 問題なしケース — 0(00) と 2(10) が 50%
 * step 3: 問題ありケース — 0(00) と 3(11) が 50% → 独立だと01,10が出る
 * step 4: もつれが解決する
 */
export function NxtProblem() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        シンプルな問題
      </motion.div>

      <div className={styles.center}>
        <AnimatePresence mode="wait">
          {/* step 0: ビット数と情報量 */}
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}
            >
              <div className={styles.point} style={{ textAlign: "center" }}>
                ビットが増えると、表せる情報が増えます
              </div>
              <div className={styles.bitTable}>
                <span className={styles.bitHeader}>ビット数</span>
                <span className={styles.bitHeader}>範囲</span>
                <span className={styles.bitHeader}>パターン数</span>
                <span>1</span><span>0 〜 1</span><span>2</span>
                <span>2</span><span>0 〜 3</span><span>4</span>
                <span>3</span><span>0 〜 7</span><span>8</span>
                <span>4</span><span>0 〜 15</span><span>16</span>
              </div>
              <div className={styles.note} style={{ textAlign: "center" }}>
                キュビットでも同様です
              </div>
            </motion.div>
          )}

          {/* step 1: 問題提起 */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
            >
              <div className={styles.point} style={{ textAlign: "center", maxWidth: 500 }}>
                複数のキュビットで「重ね合わせ」を表現するにはどうすればいいでしょうか
              </div>
              <div className={styles.note} style={{ textAlign: "center" }}>
                2進数表記で問題が出るケースを考えてみます
              </div>
            </motion.div>
          )}

          {/* step 2: 問題なしケース */}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}
            >
              <div className={styles.point} style={{ textAlign: "center" }}>
                問題がないケース
              </div>
              <div className={styles.equation}>
                <KMath tex={String.raw`0\,(00) \;\text{と}\; 2\,(10) \;\text{が 50\% ずつ}`} display />
              </div>
              <div className={styles.note} style={{ textAlign: "center", maxWidth: 500 }}>
                1桁目は 100% で「0」が出ます。
                問題は2桁目だけで、50%:50% なので全体も問題なく表現できます。
              </div>
              <div className={styles.equationRow}>
                <div className={styles.equation}>
                  <KMath tex={String.raw`|00\rangle \;\to\; 50\%`} />
                </div>
                <div className={styles.equation}>
                  <KMath tex={String.raw`|10\rangle \;\to\; 50\%`} />
                </div>
              </div>
            </motion.div>
          )}

          {/* step 3: 問題ありケース */}
          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}
            >
              <div className={styles.point} style={{ textAlign: "center" }}>
                問題があるケース
              </div>
              <div className={styles.equation}>
                <KMath tex={String.raw`0\,(00) \;\text{と}\; 3\,(11) \;\text{が 50\% ずつ}`} display />
              </div>
              <div className={styles.note} style={{ textAlign: "center", maxWidth: 520 }}>
                各桁を独立に 50%:50% で観測すると、01 や 10 も出てしまいます
              </div>
              <CrossMark>
                <div className={styles.equationRow}>
                  <div className={styles.equation}>
                    <KMath tex={String.raw`|00\rangle\;25\%`} />
                  </div>
                  <div className={styles.equation}>
                    <KMath tex={String.raw`|01\rangle\;25\%`} />
                  </div>
                  <div className={styles.equation}>
                    <KMath tex={String.raw`|10\rangle\;25\%`} />
                  </div>
                  <div className={styles.equation}>
                    <KMath tex={String.raw`|11\rangle\;25\%`} />
                  </div>
                </div>
              </CrossMark>
              <div className={styles.highlightBox} style={{ maxWidth: 500 }}>
                2つのビットがそれぞれ独立では困る → 「もつれ」を使います
              </div>
            </motion.div>
          )}

          {/* step 4: もつれが解決 */}
          {step >= 4 && (
            <motion.div
              key="s4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}
            >
              <div className={styles.point} style={{ textAlign: "center", maxWidth: 520 }}>
                もつれによって、複数ビットでも単一ビットと同じように表現できます
              </div>
              <div className={styles.equation}>
                <KMath
                  tex={String.raw`|\psi\rangle = \frac{1}{\sqrt{2}}|00\rangle + \frac{1}{\sqrt{2}}|11\rangle`}
                  display
                />
              </div>
              <div className={styles.note} style={{ textAlign: "center", maxWidth: 480 }}>
                一方を観測した時点で、もう一方も確定します
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

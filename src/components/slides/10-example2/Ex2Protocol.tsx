import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import styles from "./Ex2Common.module.scss";

/**
 * Ex2Protocol — 3 steps (BB84 量子暗号プロトコル)
 *
 * step 0: Alice は量子ビットをランダムな基底で送る
 * step 1: Bob は受け取るが、正しい測り方を知らない
 * step 2: Alice が基底を伝え、Bob が正しく測定
 */
export function Ex2Protocol() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        BB84
      </motion.div>

      <div className={styles.center}>
        {/* Actor diagram — always visible */}
        <motion.div
          className={styles.actorRow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className={styles.actor}>
            <div className={styles.actorIcon} style={{ background: "var(--color-ket0)" }}>A</div>
            <div className={styles.actorName}>Alice</div>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.basisList}>
            <KMath tex={String.raw`|0\rangle,\,|1\rangle,\,|{+}\rangle,\,|{-}\rangle`} />
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.actor}>
            <div className={styles.actorIcon} style={{ background: "var(--color-ket1)" }}>B</div>
            <div className={styles.actorName}>Bob</div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* step 0: Alice sends */}
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
            >
              <div className={styles.point} style={{ textAlign: "center", maxWidth: 520 }}>
                Alice は Bob に 0 または 1 を送りたい
              </div>
              <div className={styles.note} style={{ textAlign: "center", maxWidth: 480 }}>
                普通のコンピューターなら 0 や 1 をそのまま送れますが、
                それだと途中で Eve（盗聴者）が見ても気付けません
              </div>
              <div className={styles.speechBubble}>
                ランダムに <KMath tex={String.raw`|0\rangle,\,|1\rangle,\,|{+}\rangle,\,|{-}\rangle`} /> のいずれかで送ります
              </div>
            </motion.div>
          )}

          {/* step 1: Bob receives */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
            >
              <div className={styles.point} style={{ textAlign: "center", maxWidth: 480 }}>
                Bob は受け取りますが、正しい測り方を知りません
              </div>
              <div className={styles.basisList}>
                <div className={styles.basisGroup}>
                  <KMath tex={String.raw`|0\rangle,\,|1\rangle`} />
                  <div style={{ fontSize: "0.8rem", color: "var(--color-ghost)" }}>基底?</div>
                </div>
                <div className={styles.basisGroup}>
                  <KMath tex={String.raw`|{+}\rangle,\,|{-}\rangle`} />
                  <div style={{ fontSize: "0.8rem", color: "var(--color-ghost)" }}>基底?</div>
                </div>
              </div>
              <div className={styles.note} style={{ textAlign: "center" }}>
                一旦おいておきます
              </div>
            </motion.div>
          )}

          {/* step 2: Alice reveals basis */}
          {step >= 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
            >
              <div className={styles.speechBubble} style={{ borderColor: "var(--color-ket0)" }}>
                Alice:「今回は <KMath tex={String.raw`|{+}\rangle,\,|{-}\rangle`} /> 基底で送りました」
              </div>
              <div className={styles.speechBubble} style={{ borderColor: "var(--color-ket1)" }}>
                Bob:「OK、その基底で測定します」
              </div>
              <div className={styles.highlightBox} style={{ maxWidth: 500 }}>
                Bob は適切な基底で測定し、Alice の情報を正しく取り出します
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

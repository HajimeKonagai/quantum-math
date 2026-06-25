import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import styles from "./Ex2Common.module.scss";

/**
 * Ex2Eavesdrop — 3 steps (BB84 盗聴検知)
 *
 * step 0: Eve（盗聴者）の登場
 * step 1: Eve は基底を知らない → 間違った測定で状態が壊れる
 * step 2: Alice と Bob が照合 → 盗聴を検知
 */
export function Ex2Eavesdrop() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        盗聴検知
      </motion.div>

      <div className={styles.center}>
        {/* Actor diagram with Eve */}
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
          <div className={styles.actor}>
            <div className={styles.actorIcon} style={{ background: "var(--color-result)" }}>E</div>
            <div className={styles.actorName}>Eve</div>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.actor}>
            <div className={styles.actorIcon} style={{ background: "var(--color-ket1)" }}>B</div>
            <div className={styles.actorName}>Bob</div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* step 0: Eve enters */}
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
            >
              <div className={styles.point} style={{ textAlign: "center" }}>
                では盗聴者はどうでしょうか
              </div>
              <div className={styles.note} style={{ textAlign: "center", maxWidth: 480 }}>
                Eve は途中で量子ビットを盗み見したい
              </div>
            </motion.div>
          )}

          {/* step 1: Eve doesn't know basis */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
            >
              <div className={styles.point} style={{ textAlign: "center", maxWidth: 500 }}>
                Eve はどの基底で送られたか知らないため、ランダムに選ぶしかありません
              </div>
              <div className={styles.basisList}>
                <div className={styles.basisGroup}>
                  <KMath tex={String.raw`|0\rangle,\,|1\rangle`} />
                  <div style={{ fontSize: "0.8rem", color: "var(--color-ghost)" }}>?</div>
                </div>
                <div className={styles.basisGroup}>
                  <KMath tex={String.raw`|{+}\rangle,\,|{-}\rangle`} />
                  <div style={{ fontSize: "0.8rem", color: "var(--color-ghost)" }}>?</div>
                </div>
              </div>
              <div className={styles.highlightBox} style={{ maxWidth: 500 }}>
                間違った基底で測定すると、量子状態は壊れてしまいます
              </div>
              <div className={styles.note} style={{ textAlign: "center", maxWidth: 480 }}>
                例: Alice が <KMath tex={String.raw`|{+}\rangle`} /> を送ったのに Eve が <KMath tex={String.raw`|0\rangle,|1\rangle`} /> 基底で観測
                → 元の <KMath tex={String.raw`|{+}\rangle`} /> の情報は失われます
              </div>
            </motion.div>
          )}

          {/* step 2: Detection */}
          {step >= 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
            >
              <div className={styles.point} style={{ textAlign: "center", maxWidth: 500 }}>
                Alice と Bob は一部のデータを照合します
              </div>
              <div className={styles.equation} style={{ maxWidth: 460 }}>
                盗聴なし → 結果はほぼ一致
              </div>
              <div className={styles.equation} style={{ maxWidth: 460, borderColor: "var(--color-result)", color: "var(--color-result)" }}>
                盗聴あり → 結果に誤りが混ざる
              </div>
              <div className={styles.highlightBox} style={{ maxWidth: 520 }}>
                量子ビットは盗聴されると状態が変化するため、
                盗聴そのものを検知できます
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

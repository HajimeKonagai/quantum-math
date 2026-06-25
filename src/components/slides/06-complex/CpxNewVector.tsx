import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import { InlineBloch } from "../08-bloch/InlineBloch";
import { RAW_ACCENT } from "../../../utils/colors";
import styles from "./CpxCommon.module.scss";

const KET0 = "#58c4dd";
const KET1 = "#83c167";
const ACCENT = "#ff862f";

/**
 * CpxNewVector — 2 steps
 *
 * step 0: 複素振幅 — 位相を持った新たなベクトル
 * step 1: |+⟩ vs |−⟩ 再訪 — ブロッホ球で位相の違いを可視化
 */
export function CpxNewVector() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        新たなベクトル
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={styles.center}
          >
            <div className={styles.point} style={{ textAlign: "center" }}>
              複素数を用いると位相を持った新たなベクトルを表せます
            </div>
            <div className={styles.equation}>
              <KMath
                tex={String.raw`|\psi\rangle = \alpha|0\rangle + \beta|1\rangle \qquad \alpha,\beta \in \mathbb{C}`}
                display
              />
            </div>
            <div className={styles.note} style={{ textAlign: "center" }}>
              振幅 α, β が複素数になり、位相の情報も持てるようになります
            </div>
          </motion.div>
        )}

        {step >= 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={styles.twoCol}
          >
            <div className={styles.graphArea}>
              <InlineBloch
                theta={Math.PI / 2}
                phi={0}
                showArrow
                arrowColor={KET0}
                extraArrows={[{ theta: Math.PI / 2, phi: Math.PI, color: ACCENT }]}
                highlights={[
                  { theta: 0, phi: 0, color: KET0 },
                  { theta: Math.PI, phi: 0, color: KET1 },
                ]}
                width={320}
                height={300}
              />
            </div>

            <div className={styles.infoArea}>
              <div className={styles.equationRow} style={{ marginTop: 0 }}>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`|{+}\rangle = \tfrac{1}{\sqrt{2}}|0\rangle \mathbin{\color{${RAW_ACCENT}}+} \tfrac{1}{\sqrt{2}}|1\rangle`}
                    display
                  />
                </div>
                <div className={styles.equation}>
                  <KMath
                    tex={String.raw`|{-}\rangle = \tfrac{1}{\sqrt{2}}|0\rangle \mathbin{\color{${RAW_ACCENT}}-} \tfrac{1}{\sqrt{2}}|1\rangle`}
                    display
                  />
                </div>
              </div>
              <div className={styles.point}>
                確率は同じでも「位相」が違う
              </div>
              <div className={styles.note}>
                符号の違い = 位相 0° と 180° の違い。
                ブロッホ球上では赤道の反対側に位置します。
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

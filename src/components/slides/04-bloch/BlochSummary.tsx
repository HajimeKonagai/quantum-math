import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { AppLauncher } from "../../primitives/AppLauncher";
import { InlineBloch } from "./InlineBloch";
import styles from "./BlochCommon.module.scss";

const KET0 = "#58c4dd";
const HIGHLIGHT = "#ffff00";

/**
 * BlochSummary — 3 steps
 *
 * step 0: まとめ — 状態→ベクトル、操作→行列、位相→複素数、測定確率→内積
 * step 1: ブロッホ球ではこれら全てが 点・回転・角度 として見える
 * step 2: アプリを触って体感してみてください
 */
export function BlochSummary() {
  const step = useStep();

  const mappings = [
    { label: "状態", value: "ベクトル", bloch: "点" },
    { label: "操作", value: "行列", bloch: "回転" },
    { label: "位相", value: "複素数", bloch: "経度" },
    { label: "測定確率", value: "内積", bloch: "緯度" },
  ];

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        量子コンピュータを見る
      </motion.div>

      <div className={styles.twoCol}>
        <div className={styles.graphArea}>
          <InlineBloch
            theta={Math.PI / 3}
            phi={Math.PI / 4}
            showArrow={true}
            highlights={[
              { theta: 0, phi: 0, color: KET0 },
            ]}
          />
        </div>

        <div className={styles.infoArea}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="i0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>ここまでの対応</div>
                <div className={styles.mappingGrid} style={{ marginTop: "0.5rem" }}>
                  {mappings.map((m, i) => (
                    <motion.div
                      key={m.label}
                      style={{ display: "contents" }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className={styles.mappingLabel}>{m.label}</div>
                      <div className={styles.mappingArrow}>→</div>
                      <div className={styles.mappingValue}>{m.value}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="i1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className={styles.point}>ブロッホ球ではこれら全てが見えます</div>
                <div className={styles.mappingGrid} style={{ marginTop: "0.5rem" }}>
                  {mappings.map((m, i) => (
                    <motion.div
                      key={m.label}
                      style={{ display: "contents" }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className={styles.mappingLabel}>{m.value}</div>
                      <div className={styles.mappingArrow}>→</div>
                      <div className={styles.mappingValue} style={{ color: HIGHLIGHT }}>{m.bloch}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div key="i2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.point}>
                  触って体感してみてください
                </div>
                <div className={styles.note} style={{ marginTop: "0.3rem" }}>
                  ブロッホ球は動かしてみた方が理解が深まります
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <AppLauncher appId="bloch-sphere" label="ブロッホ球を開く" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

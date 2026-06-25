import { motion } from "motion/react";
import { Math as KMath } from "../../primitives/Math";
import { RAW_KET0, RAW_ACCENT } from "../../../utils/colors";
import styles from "./CpxCommon.module.scss";

/**
 * CpxRealImag — 1 step
 *
 * step 0: 3+4i の分解 — 実部と虚部
 */
export function CpxRealImag() {
  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        実部と虚部
      </motion.div>

      <div className={styles.center}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={styles.bigFormula}
        >
          <KMath
            tex={String.raw`\underbrace{\color{${RAW_KET0}}{3}}_{\text{実部 (Re)}} + \underbrace{\color{${RAW_ACCENT}}{4}}_{\text{虚部 (Im)}} \, i`}
            display
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}
        >
          <div className={styles.equation}>
            <KMath tex={String.raw`\text{Re}(3+4i) = \color{${RAW_KET0}}{3}`} />
          </div>
          <div className={styles.equation}>
            <KMath tex={String.raw`\text{Im}(3+4i) = \color{${RAW_ACCENT}}{4}`} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

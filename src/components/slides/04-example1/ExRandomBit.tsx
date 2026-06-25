import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Math as KMath } from "../../primitives/Math";
import { RAW_KET0, RAW_KET1, RAW_ACCENT } from "../../../utils/colors";
import styles from "./ExCommon.module.scss";

/**
 * ExRandomBit — 1 step
 *
 * step 0: |+⟩ state dot at 50% position, random observation loop
 *         animating between |0⟩ and |1⟩
 */
export function ExRandomBit() {
  const [observed, setObserved] = useState<0 | 1 | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setObserved(null);
      pendingRef.current = setTimeout(() => {
        setObserved(Math.random() < 0.5 ? 0 : 1);
      }, 600);
    }, 1800);

    // initial observation after a short delay
    pendingRef.current = setTimeout(() => {
      setObserved(Math.random() < 0.5 ? 0 : 1);
    }, 800);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pendingRef.current) clearTimeout(pendingRef.current);
    };
  }, []);

  const dotTop = observed === null ? "50%" : observed === 0 ? "10%" : "90%";
  const dotColor = observed === null ? RAW_ACCENT : observed === 0 ? RAW_KET0 : RAW_KET1;

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        完全ランダム
      </motion.div>

      <div className={styles.twoCol}>
        <div className={styles.graphArea}>
          <div className={styles.randomTrack}>
            <div className={styles.trackLine} />
            <span className={styles.trackLabel} style={{ color: RAW_KET0 }}>|0⟩</span>

            <motion.div
              className={styles.trackDot}
              animate={{ top: dotTop, background: dotColor }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />

            <span className={styles.trackLabel} style={{ color: RAW_KET1 }}>|1⟩</span>
          </div>
        </div>

        <div className={styles.infoArea}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.point}>
              Hゲートで重ね合わせ状態を作り、観測すると
            </div>
            <div className={styles.equation} style={{ marginTop: "0.5rem" }}>
              <KMath
                tex={String.raw`H|0\rangle = \frac{1}{\sqrt{2}}(|0\rangle + |1\rangle) = |{+}\rangle`}
                display
              />
            </div>
            <div className={styles.note} style={{ marginTop: "0.5rem" }}>
              0 と 1 が観測される確率は 50%/50%
            </div>
            <div className={styles.highlightBox} style={{ marginTop: "1rem" }}>
              人類初の「完全なランダム」
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { CrossMark } from "../../primitives/CrossMark";
import { RAW_KET0, RAW_KET1, RAW_ACCENT } from "../../../utils/colors";
import styles from "./BridgeCommon.module.scss";

/**
 * BridgeRealLimit — 1 step
 *
 * step 0: Random anim (reused from ExRandomBit) + cross mark overlay.
 *         "実数だけでは量子状態を表しきれない"
 */
export function BridgeRealLimit() {
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
        実数の限界
      </motion.div>

      <div className={styles.twoCol}>
        <div className={styles.graphArea}>
          <CrossMark>
            <div style={{ position: "relative", width: 60, height: 300 }}>
              <div style={{
                position: "absolute", left: "50%", top: 0, bottom: 0,
                width: 2, background: "rgba(255,255,255,0.1)",
              }} />
              <span style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                fontFamily: "var(--font-mono)", fontSize: "1.2rem", color: RAW_KET0,
              }}>|0⟩</span>
              <motion.div
                style={{
                  position: "absolute", left: "50%", transform: "translate(-50%,-50%)",
                  width: 16, height: 16, borderRadius: "50%",
                }}
                animate={{ top: dotTop, background: dotColor }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
              <span style={{
                position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                fontFamily: "var(--font-mono)", fontSize: "1.2rem", color: RAW_KET1,
              }}>|1⟩</span>
            </div>
          </CrossMark>
        </div>

        <div className={styles.infoArea}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.point}>
              実は少し嘘をついていました
            </div>
            <div className={styles.note} style={{ marginTop: "0.5rem" }}>
              ここまで扱っていた実数だけでは
              量子キュビットの状態は表しきれていません。
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

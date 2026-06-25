import { motion } from "motion/react";
import { Vector, Text as MafsText, Plot, Circle } from "mafs";
import { Math as KMath } from "../../primitives/Math";
import { CrossMark } from "../../primitives/CrossMark";
import { Graph2D } from "../../math-visuals/Graph2D";
import { RAW_KET0, RAW_ACCENT, RAW_GHOST, RAW_HIGHLIGHT } from "../../../utils/colors";
import styles from "./CpxCommon.module.scss";

/**
 * CpxMisconception — 1 step
 *
 * step 0: 実部≠振幅, 虚部≠位相 — よくある誤解
 *         Complex plane showing 3+4i with magnitude and angle annotations.
 */
export function CpxMisconception() {
  const mag = 5; // |3+4i| = 5
  const theta = Math.atan2(4, 3); // ≈ 0.927 rad ≈ 53°

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        よくある誤解
      </motion.div>

      <div className={styles.twoCol}>
        <div className={styles.graphArea}>
          <Graph2D width={320} height={320} xRange={[-1, 6]} yRange={[-1, 6]}>
            <Circle center={[0, 0]} radius={mag} color={RAW_GHOST} fillOpacity={0} strokeOpacity={0.1} />
            <Vector tip={[3, 4]} color={RAW_KET0} weight={3} />
            <MafsText x={3.3} y={4.3} size={14} color={RAW_KET0}>3+4i</MafsText>
            {/* magnitude label */}
            <MafsText x={1} y={2.5} size={12} color={RAW_HIGHLIGHT}>|z|=5</MafsText>
            {/* angle arc */}
            <Plot.Parametric
              xy={(t) => [1.2 * Math.cos(t), 1.2 * Math.sin(t)]}
              t={[0, theta]}
              color={RAW_ACCENT}
              weight={2}
              style="dashed"
            />
            <MafsText x={1.5} y={0.5} size={11} color={RAW_ACCENT}>θ≈53°</MafsText>
            <MafsText x={5.5} y={-0.4} size={11} color={RAW_GHOST}>Re</MafsText>
            <MafsText x={0.4} y={5.5} size={11} color={RAW_GHOST}>Im</MafsText>
          </Graph2D>
        </div>

        <div className={styles.infoArea}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <CrossMark>
              <div className={styles.equation}>
                <KMath tex={String.raw`\text{実部} = \text{振幅},\;\text{虚部} = \text{位相}`} />
              </div>
            </CrossMark>

            <div style={{ marginTop: "1.5rem" }}>
              <div className={styles.point}>正しくは</div>
              <div className={styles.equation} style={{ marginTop: "0.5rem" }}>
                <KMath tex={String.raw`\text{大きさ}\;|z| = \sqrt{3^2+4^2} = 5 \;\to\; \text{振幅}`} display />
              </div>
              <div className={styles.equation} style={{ marginTop: "0.5rem" }}>
                <KMath tex={String.raw`\text{角度}\;\theta = \arctan\tfrac{4}{3} \approx 53° \;\to\; \text{位相}`} display />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

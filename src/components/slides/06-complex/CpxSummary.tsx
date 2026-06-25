import { motion } from "motion/react";
import { Vector, Text as MafsText, Plot, Circle } from "mafs";
import { Math as KMath } from "../../primitives/Math";
import { Graph2D } from "../../math-visuals/Graph2D";
import { RAW_KET0, RAW_ACCENT, RAW_GHOST } from "../../../utils/colors";
import styles from "./CpxCommon.module.scss";

const theta = Math.atan2(4, 3); // ≈ 53°

/**
 * CpxSummary — 1 step
 *
 * step 0: まとめ — 複素平面に3+4iを描き、長さ(振幅)と方向(位相)を図示
 */
export function CpxSummary() {
  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        まとめ
      </motion.div>

      <div className={styles.twoCol}>
        <div className={styles.graphArea}>
          <Graph2D width={300} height={300} xRange={[-1, 6]} yRange={[-1, 6]}>
            <Circle center={[0, 0]} radius={5} color={RAW_GHOST} fillOpacity={0} strokeOpacity={0.1} />
            <Vector tip={[3, 4]} color={RAW_KET0} weight={3} />
            <MafsText x={3.4} y={4.4} size={13} color={RAW_KET0}>3+4i</MafsText>
            {/* magnitude annotation */}
            <MafsText x={0.8} y={2.5} size={11} color={RAW_ACCENT}>|z|=5</MafsText>
            {/* angle arc */}
            <Plot.Parametric
              xy={(t) => [1.3 * Math.cos(t), 1.3 * Math.sin(t)]}
              t={[0, theta]}
              color={RAW_ACCENT}
              weight={1.5}
              style="dashed"
            />
            <MafsText x={1.6} y={0.5} size={11} color={RAW_ACCENT}>θ</MafsText>
            <MafsText x={5.5} y={-0.4} size={11} color={RAW_GHOST}>Re</MafsText>
            <MafsText x={0.4} y={5.5} size={11} color={RAW_GHOST}>Im</MafsText>
          </Graph2D>
        </div>

        <div className={styles.infoArea}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className={styles.highlightBox} style={{ fontSize: "1.3rem", padding: "1.2rem 2rem" }}>
              一つの数で「長さ」と「方向」を表せる
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={styles.equation}
            style={{ marginTop: "0.8rem" }}
          >
            <KMath tex={String.raw`z = 3+4i = 5\,e^{i\theta}`} display />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: "0.5rem" }}
          >
            <div className={styles.note} style={{ textAlign: "center" }}>
              方向(角度)の計算が掛け算で簡単にできます
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

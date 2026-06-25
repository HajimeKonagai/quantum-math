import { motion } from "motion/react";
import { Vector, Text as MafsText, Circle } from "mafs";
import { Math as KMath } from "../../primitives/Math";
import { Graph2D } from "../../math-visuals/Graph2D";
import { AnimatedVector } from "../../math-visuals/AnimatedVector";
import { RAW_KET0, RAW_GHOST } from "../../../utils/colors";
import styles from "./CpxCommon.module.scss";

/**
 * CpxPlane — 1 step
 *
 * step 0: Graph2D showing 3+4i plotted on the complex plane.
 *         Re axis horizontal, Im axis vertical.
 */
export function CpxPlane() {
  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        複素平面
      </motion.div>

      <div className={styles.twoCol}>
        <div className={styles.graphArea}>
          <Graph2D width={340} height={340} xRange={[-1, 6]} yRange={[-1, 6]}>
            <Circle center={[0, 0]} radius={5} color={RAW_GHOST} fillOpacity={0} strokeOpacity={0.1} />
            {/* 3+4i vector */}
            <AnimatedVector tip={[3, 4]} color={RAW_KET0} weight={3} duration={0.6} />
            {/* dashed projections */}
            <Vector tip={[3, 0]} color={RAW_GHOST} weight={1} opacity={0.3} />
            <Vector tip={[0, 4]} color={RAW_GHOST} weight={1} opacity={0.3} />
            {/* labels */}
            <MafsText x={3.3} y={4.3} size={14} color={RAW_KET0}>3+4i</MafsText>
            <MafsText x={5.5} y={-0.4} size={12} color={RAW_GHOST}>Re</MafsText>
            <MafsText x={0.4} y={5.5} size={12} color={RAW_GHOST}>Im</MafsText>
            <MafsText x={3} y={-0.4} size={11} color={RAW_GHOST}>3</MafsText>
            <MafsText x={-0.4} y={4} size={11} color={RAW_GHOST}>4</MafsText>
          </Graph2D>
        </div>

        <div className={styles.infoArea}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.point}>
              実部を横軸、虚部を縦軸とした平面
            </div>
            <div className={styles.note} style={{ marginTop: "0.3rem" }}>
              複素数を平面上の点(矢印)として表現できます
            </div>
            <div className={styles.equation} style={{ marginTop: "1rem" }}>
              <KMath tex={String.raw`3 + 4i \;\longleftrightarrow\; (3,\,4)`} display />
            </div>
            <div className={styles.note} style={{ marginTop: "0.5rem" }}>
              これを複素平面(ガウス平面)と呼びます
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

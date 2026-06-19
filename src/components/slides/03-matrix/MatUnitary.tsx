import { motion } from "motion/react";
import { Vector, Plot, Text as MafsText } from "mafs";
import { Math as KMath } from "../../primitives/Math";
import { Graph2D } from "../../math-visuals/Graph2D";
import { RAW_KET0, RAW_KET1, RAW_ACCENT, RAW_GHOST } from "../../../utils/colors";
import styles from "./MatCommon.module.scss";

const INV_SQRT2 = 1 / Math.sqrt(2);

/**
 * MatUnitary — 1 step
 *
 * step 0: ユニタリ変換 — 長さを保つ = 単位円上にとどまる
 */
export function MatUnitary() {
  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        ユニタリ変換
      </motion.div>

      <div className={styles.twoCol}>
        <div className={styles.graphArea}>
          <Graph2D width={340} height={340} xRange={[-1.5, 1.5]} yRange={[-1.5, 1.5]}>
            {/* Unit circle */}
            <Plot.Parametric
              xy={(t) => [Math.cos(t), Math.sin(t)]}
              t={[0, 2 * Math.PI]}
              color={RAW_ACCENT}
              weight={2}
              opacity={0.5}
            />

            {/* Various gate results — all on the circle */}
            <Vector tip={[1, 0]} color={RAW_KET0} weight={2.5} />
            <MafsText x={1.12} y={-0.12} size={11} color={RAW_KET0}>|0⟩</MafsText>

            <Vector tip={[0, 1]} color={RAW_KET1} weight={2.5} />
            <MafsText x={-0.18} y={1.12} size={11} color={RAW_KET1}>|1⟩</MafsText>

            <Vector tip={[INV_SQRT2, INV_SQRT2]} color={RAW_ACCENT} weight={2.5} />
            <MafsText x={INV_SQRT2 + 0.08} y={INV_SQRT2 + 0.12} size={11} color={RAW_ACCENT}>|+⟩</MafsText>

            <Vector tip={[INV_SQRT2, -INV_SQRT2]} color={RAW_GHOST} weight={2} opacity={0.6} />
            <MafsText x={INV_SQRT2 + 0.08} y={-INV_SQRT2 - 0.12} size={11} color={RAW_GHOST}>|−⟩</MafsText>
          </Graph2D>
        </div>

        <div className={styles.infoArea}>
          <div className={styles.point}>
            全てのゲートはベクトルの長さを保ちます
          </div>
          <div className={styles.equation} style={{ marginTop: "1rem" }}>
            <KMath
              tex={String.raw`U^\dagger U = I \quad \Rightarrow \quad \|U|\psi\rangle\| = \||\psi\rangle\|`}
              display
            />
          </div>
          <div className={styles.highlightBox} style={{ marginTop: "1rem" }}>
            確率の合計が1という約束を守るため
          </div>
          <div className={styles.note} style={{ marginTop: "0.8rem" }}>
            どのゲートを適用しても、ベクトルは単位円(球)上から出ません。
            このような変換を「ユニタリ変換」と呼びます。
          </div>
        </div>
      </div>
    </div>
  );
}

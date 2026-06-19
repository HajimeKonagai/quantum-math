import { useState, useCallback } from "react";
import { Mafs, Coordinates, Vector, Text, Plot, Circle } from "mafs";
import "mafs/core.css";
import { Math as KMath } from "../primitives/Math";
import { RAW_KET0, RAW_KET1, RAW_ACCENT, RAW_GHOST, RAW_RESULT } from "../../utils/colors";
import styles from "./InnerProduct.module.scss";

export interface InnerProductParams {
  /** Initial angle of vector a (radians) */
  angleA?: number;
  /** Initial angle of vector b (radians) */
  angleB?: number;
}

function fmtAngle(rad: number): string {
  return `${((rad * 180) / Math.PI).toFixed(1)}°`;
}

function fmtVal(v: number): string {
  return v.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

export function InnerProduct({ params }: { params: InnerProductParams }) {
  const [angleA, setAngleA] = useState(params.angleA ?? 0);
  const [angleB, setAngleB] = useState(params.angleB ?? Math.PI / 3);

  // Unit vectors from angles
  const ax = Math.cos(angleA);
  const ay = Math.sin(angleA);
  const bx = Math.cos(angleB);
  const by = Math.sin(angleB);

  // Inner product = cos(θ_between)
  const dot = ax * bx + ay * by;

  // Angle between the two vectors
  const between = Math.acos(Math.max(-1, Math.min(1, dot)));

  // Projection of b onto a
  const projX = dot * ax;
  const projY = dot * ay;

  const resetA = useCallback(() => setAngleA(0), []);

  // Angle arc: draw from angleA to angleB (shorter arc)
  const arcStart = angleA;
  const arcEnd = angleB;
  const arcR = 0.35;

  // Tex formulas
  const dotTex = `\\vec{a} \\cdot \\vec{b} = ${fmtVal(ax)} \\cdot ${fmtVal(bx)} + ${fmtVal(ay)} \\cdot ${fmtVal(by)} = ${fmtVal(dot)}`;
  const cosTex = `\\cos\\theta = ${fmtVal(dot)}`;

  return (
    <div className={styles.container}>
      {/* Graph */}
      <div className={styles.graphArea}>
        <Mafs
          width={400}
          height={400}
          viewBox={{ x: [-1.5, 1.5], y: [-1.5, 1.5] }}
        >
          <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={{ lines: 1 }} />

          {/* Unit circle */}
          <Circle
            center={[0, 0]}
            radius={1}
            color={RAW_GHOST}
            fillOpacity={0}
            strokeOpacity={0.25}
          />

          {/* Projection dashed line (b tip to projection point) */}
          <Plot.Parametric
            xy={(t) => [bx + t * (projX - bx), by + t * (projY - by)]}
            t={[0, 1]}
            color={RAW_GHOST}
            style="dashed"
            weight={1}
            opacity={0.5}
          />

          {/* Projection vector (along a) */}
          <Vector tip={[projX, projY]} color={RAW_RESULT} weight={2} opacity={0.7} />

          {/* Vector a */}
          <Vector tip={[ax, ay]} color={RAW_KET0} weight={3} />

          {/* Vector b */}
          <Vector tip={[bx, by]} color={RAW_KET1} weight={3} />

          {/* Angle arc between the two vectors */}
          {Math.abs(between) > 0.02 && (
            <Plot.Parametric
              xy={(t) => [arcR * Math.cos(t), arcR * Math.sin(t)]}
              t={[arcStart, arcEnd]}
              color={RAW_ACCENT}
              weight={2}
            />
          )}

          {/* Angle label */}
          {Math.abs(between) > 0.05 && (
            <Text
              x={0.5 * Math.cos((angleA + angleB) / 2)}
              y={0.5 * Math.sin((angleA + angleB) / 2)}
              size={12}
              color={RAW_ACCENT}
            >
              {fmtAngle(between)}
            </Text>
          )}

          {/* Labels */}
          <Text x={ax * 1.15} y={ay * 1.15 + 0.08} size={14} color={RAW_KET0}>a</Text>
          <Text x={bx * 1.15} y={by * 1.15 + 0.08} size={14} color={RAW_KET1}>b</Text>
          {Math.abs(dot) > 0.01 && (
            <Text
              x={projX + (projX >= 0 ? 0.1 : -0.1)}
              y={projY - 0.12}
              size={11}
              color={RAW_RESULT}
            >
              proj
            </Text>
          )}
        </Mafs>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {/* Formula */}
        <div className={styles.formulaBox}>
          <KMath tex={dotTex} />
        </div>

        {/* Vector a */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.aColor}>a</span> (ベクトル1)
          </div>
          <div className={styles.sliderRow}>
            <span className={styles.sliderLabel} style={{ color: RAW_KET0 }}>θ</span>
            <input
              className={styles.slider}
              type="range"
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              value={angleA}
              onChange={(e) => setAngleA(parseFloat(e.target.value))}
            />
            <span className={styles.sliderValue}>{fmtAngle(angleA)}</span>
          </div>
          <div className={styles.stateRow}>
            <span className={styles.aColor}>
              ({fmtVal(ax)}, {fmtVal(ay)})
            </span>
          </div>
          <button className={styles.resetBtn} onClick={resetA}>
            (1, 0) にリセット
          </button>
        </div>

        {/* Vector b */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.bColor}>b</span> (ベクトル2)
          </div>
          <div className={styles.sliderRow}>
            <span className={styles.sliderLabel} style={{ color: RAW_KET1 }}>θ</span>
            <input
              className={styles.slider}
              type="range"
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              value={angleB}
              onChange={(e) => setAngleB(parseFloat(e.target.value))}
            />
            <span className={styles.sliderValue}>{fmtAngle(angleB)}</span>
          </div>
          <div className={styles.stateRow}>
            <span className={styles.bColor}>
              ({fmtVal(bx)}, {fmtVal(by)})
            </span>
          </div>
        </div>

        {/* Result */}
        <div className={styles.resultSection}>
          <div className={styles.sectionTitle}>内積 / コサイン類似度</div>
          <div className={styles.resultValue}>
            {fmtVal(dot)}
          </div>
          <div className={styles.formulaBox}>
            <KMath tex={cosTex} />
          </div>
          <div className={styles.resultDetail}>
            ベクトル間の角度: {fmtAngle(between)}
          </div>
          <div className={styles.resultDetail}>
            {dot > 0.99
              ? "同じ方向 (完全一致)"
              : dot > 0.5
                ? "似た方向"
                : dot > -0.01 && dot < 0.01
                  ? "直交 (無関係)"
                  : dot < -0.99
                    ? "反対方向"
                    : dot < -0.5
                      ? "逆寄り"
                      : dot > 0
                        ? "やや似た方向"
                        : "やや逆方向"}
          </div>
        </div>
      </div>
    </div>
  );
}

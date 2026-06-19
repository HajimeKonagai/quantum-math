import { useState, useCallback } from "react";
import { Mafs, Coordinates, Vector, Text, Plot, Circle } from "mafs";
import "mafs/core.css";
import { Math as KMath } from "../primitives/Math";
import { RAW_KET0, RAW_ACCENT, RAW_RESULT, RAW_GHOST } from "../../utils/colors";
import styles from "./ComplexPlane.module.scss";

export interface ComplexPlaneParams {
  /** Initial z = a + bi */
  a?: number;
  b?: number;
  /** Initial multiplier w = r * e^(iθ) in polar form */
  r?: number;
  theta?: number;
}

interface HistoryEntry {
  label: string;
  re: number;
  im: number;
}

// ── Helpers ──

function fmtComplex(re: number, im: number): string {
  const rs = Math.abs(re) < 0.0005 ? "0" : re.toFixed(3).replace(/\.?0+$/, "");
  const is = Math.abs(im) < 0.0005 ? "0" : Math.abs(im).toFixed(3).replace(/\.?0+$/, "");
  if (is === "0") return rs;
  if (rs === "0") return im < 0 ? `-${is}i` : `${is}i`;
  return `${rs} ${im < 0 ? "−" : "+"} ${is}i`;
}

function fmtAngle(rad: number): string {
  return `${((rad * 180) / Math.PI).toFixed(0)}°`;
}

function texComplex(re: number, im: number): string {
  const rs = Math.abs(re) < 0.0005 ? "0" : re.toFixed(2).replace(/\.?0+$/, "");
  const absIm = Math.abs(im);
  const is = absIm < 0.0005 ? "" : absIm.toFixed(2).replace(/\.?0+$/, "");
  if (!is) return rs;
  const sign = im < 0 ? "-" : rs === "0" ? "" : "+";
  if (rs === "0") return `${sign}${is}i`;
  return `${rs}${sign}${is}i`;
}

// ── Main Component ──

export function ComplexPlane({ params }: { params: ComplexPlaneParams }) {
  // z = a + bi (cartesian)
  const [a, setA] = useState(params.a ?? 1);
  const [b, setB] = useState(params.b ?? 0.5);

  // w = r * e^(iθ) (polar — more intuitive for rotation)
  const [wR, setWR] = useState(params.r ?? 1);
  const [wTheta, setWTheta] = useState(params.theta ?? Math.PI / 4);

  // History of multiplications
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Derived
  const wRe = wR * Math.cos(wTheta);
  const wIm = wR * Math.sin(wTheta);

  // z × w
  const resRe = a * wRe - b * wIm;
  const resIm = a * wIm + b * wRe;

  // Polar form of z
  const zR = Math.sqrt(a * a + b * b);
  const zTheta = Math.atan2(b, a);

  // Polar form of result
  const resR = zR * wR;
  const resTheta = zTheta + wTheta;

  const applyMultiply = useCallback(() => {
    setHistory((h) => [
      ...h,
      { label: fmtComplex(a, b), re: a, im: b },
    ]);
    setA(resRe);
    setB(resIm);
  }, [a, b, resRe, resIm]);

  // Dynamic view range
  const maxCoord = Math.max(
    Math.abs(a), Math.abs(b),
    Math.abs(resRe), Math.abs(resIm),
    2,
  ) * 1.4;
  const range: [number, number] = [-maxCoord, maxCoord];

  // Tex
  const texZ = texComplex(a, b);
  const texW = texComplex(wRe, wIm);
  const texRes = texComplex(resRe, resIm);
  const formulaTex = `z \\cdot w = (${texZ})(${texW}) = ${texRes}`;

  // Angle arc radius (adaptive)
  const zArcR = Math.min(0.5, zR * 0.35);
  const resArcR = Math.min(0.7, resR * 0.4);

  // Presets for w
  const W_PRESETS = [
    { label: "i", r: 1, theta: Math.PI / 2 },
    { label: "−1", r: 1, theta: Math.PI },
    { label: "−i", r: 1, theta: -Math.PI / 2 },
    { label: "e^{iπ/6}", r: 1, theta: Math.PI / 6 },
    { label: "e^{iπ/4}", r: 1, theta: Math.PI / 4 },
    { label: "e^{iπ/3}", r: 1, theta: Math.PI / 3 },
    { label: "2", r: 2, theta: 0 },
    { label: "1+i", r: Math.SQRT2, theta: Math.PI / 4 },
  ];

  return (
    <div className={styles.container}>
      {/* Graph */}
      <div className={styles.graphArea}>
        <Mafs
          width={420}
          height={420}
          viewBox={{ x: range, y: range }}
          preserveAspectRatio={false}
        >
          <Coordinates.Cartesian
            xAxis={{ lines: 1 }}
            yAxis={{ lines: 1 }}
          />

          {/* Unit circle */}
          <Circle
            center={[0, 0]}
            radius={1}
            strokeStyle="dashed"
            color={RAW_GHOST}
            fillOpacity={0}
            strokeOpacity={0.3}
          />

          {/* Ghost history arrows */}
          {history.map((h, i) => (
            <Vector
              key={`hist-${i}`}
              tip={[h.re, h.im]}
              color={RAW_GHOST}
              opacity={0.3}
              weight={1.5}
            />
          ))}

          {/* z arrow (blue) */}
          {zR > 0.01 && (
            <Vector tip={[a, b]} color={RAW_KET0} weight={3} />
          )}

          {/* z angle arc */}
          {zR > 0.15 && Math.abs(zTheta) > 0.02 && (
            <Plot.Parametric
              xy={(t) => [zArcR * Math.cos(t), zArcR * Math.sin(t)]}
              t={[0, zTheta]}
              color={RAW_KET0}
              opacity={0.6}
              weight={1.5}
              style="dashed"
            />
          )}

          {/* Result arrow (red) */}
          {resR > 0.01 && (
            <Vector tip={[resRe, resIm]} color={RAW_RESULT} weight={4} />
          )}

          {/* Rotation arc from z angle to result angle (orange) */}
          {resR > 0.15 && Math.abs(wTheta) > 0.02 && (
            <Plot.Parametric
              xy={(t) => [resArcR * Math.cos(t), resArcR * Math.sin(t)]}
              t={[zTheta, resTheta]}
              color={RAW_ACCENT}
              weight={2}
              style="dashed"
            />
          )}

          {/* Labels */}
          {zR > 0.01 && (
            <Text
              x={a + (a >= 0 ? 0.2 : -0.2)}
              y={b + 0.2}
              size={14}
              color={RAW_KET0}
              attach={a >= 0 ? "w" : "e"}
            >
              z
            </Text>
          )}
          {resR > 0.01 && (
            <Text
              x={resRe + (resRe >= 0 ? 0.2 : -0.2)}
              y={resIm + 0.2}
              size={14}
              color={RAW_RESULT}
              attach={resRe >= 0 ? "w" : "e"}
            >
              z·w
            </Text>
          )}

          {/* Axis labels */}
          <Text x={maxCoord * 0.9} y={-0.3} size={12} color={RAW_GHOST}>Re</Text>
          <Text x={0.3} y={maxCoord * 0.9} size={12} color={RAW_GHOST}>Im</Text>
        </Mafs>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {/* Formula */}
        <div className={styles.section}>
          <div className={styles.stateBox}>
            <KMath tex={formulaTex} />
          </div>
        </div>

        {/* z inputs */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.zColor}>z</span> (入力)
          </div>
          <div className={styles.sliderRow}>
            <span className={styles.sliderLabel} style={{ color: RAW_KET0 }}>Re</span>
            <input
              className={styles.slider}
              type="range" min={-3} max={3} step={0.05}
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
            />
            <span className={styles.sliderValue}>{a.toFixed(2)}</span>
          </div>
          <div className={styles.sliderRow}>
            <span className={styles.sliderLabel} style={{ color: RAW_KET0 }}>Im</span>
            <input
              className={styles.slider}
              type="range" min={-3} max={3} step={0.05}
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
            />
            <span className={styles.sliderValue}>{b.toFixed(2)}</span>
          </div>
          <div className={styles.stateRow}>
            <span className={styles.zColor}>|z| = {zR.toFixed(2)}</span>
            <span className={styles.zColor}>arg = {fmtAngle(zTheta)}</span>
          </div>
        </div>

        {/* w inputs (polar) */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.wColor}>w</span> (掛ける数)
          </div>
          <div className={styles.sliderRow}>
            <span className={styles.sliderLabel} style={{ color: RAW_ACCENT }}>r</span>
            <input
              className={styles.slider}
              type="range" min={0.1} max={3} step={0.05}
              value={wR}
              onChange={(e) => setWR(parseFloat(e.target.value))}
            />
            <span className={styles.sliderValue}>{wR.toFixed(2)}</span>
          </div>
          <div className={styles.sliderRow}>
            <span className={styles.sliderLabel} style={{ color: RAW_ACCENT }}>θ</span>
            <input
              className={styles.slider}
              type="range" min={-Math.PI} max={Math.PI} step={0.01}
              value={wTheta}
              onChange={(e) => setWTheta(parseFloat(e.target.value))}
            />
            <span className={styles.sliderValue}>{fmtAngle(wTheta)}</span>
          </div>
          <div className={styles.stateRow}>
            <span className={styles.wColor}>w = {fmtComplex(wRe, wIm)}</span>
          </div>

          {/* Presets */}
          <div className={styles.presetGrid}>
            {W_PRESETS.map((p) => (
              <button
                key={p.label}
                className={styles.presetBtn}
                onClick={() => { setWR(p.r); setWTheta(p.theta); }}
              >
                <KMath tex={`w=${p.label}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.resultColor}>結果</span>
          </div>
          <div className={styles.stateRow}>
            <span className={styles.resultColor}>|z·w| = {resR.toFixed(2)}</span>
            <span className={styles.resultColor}>arg = {fmtAngle(resTheta)}</span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ghost)", lineHeight: 1.5 }}>
            大きさ: ×{wR.toFixed(2)}倍 / 回転: {fmtAngle(wTheta)}
          </div>
        </div>

        {/* Apply button */}
        <button className={styles.multiplyBtn} onClick={applyMultiply}>
          z ← z·w を適用 (連続回転)
        </button>

        {/* History */}
        {history.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>履歴</div>
            <div className={styles.historyList}>
              {history.map((h, i) => (
                <div key={i} className={styles.historyItem}>
                  {i}: {h.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

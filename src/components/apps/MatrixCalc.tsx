import { useState, useCallback } from "react";
import { Math as KMath } from "../primitives/Math";
import styles from "./MatrixCalc.module.scss";

export interface MatrixCalcParams {
  /** Initial 2x2 matrix as [row0col0, row0col1, row1col0, row1col1] */
  matrix?: number[];
  /** Initial 2-element vector */
  vector?: number[];
  /** Title shown above the calculator */
  title?: string;
}

// ── Complex number helpers ──

type C = [number, number]; // [re, im]

function cAdd(a: C, b: C): C {
  return [a[0] + b[0], a[1] + b[1]];
}

function cMul(a: C, b: C): C {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}

const EPS = 1e-10;

function fmtNum(n: number): string {
  if (Math.abs(n - Math.round(n)) < EPS) return String(Math.round(n));
  return n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

function fmtC(c: C): string {
  const [re, im] = c;
  const hasRe = Math.abs(re) > EPS;
  const hasIm = Math.abs(im) > EPS;
  if (!hasRe && !hasIm) return "0";
  if (hasRe && !hasIm) return fmtNum(re);
  if (!hasRe) {
    if (Math.abs(im - 1) < EPS) return "i";
    if (Math.abs(im + 1) < EPS) return "-i";
    return fmtNum(im) + "i";
  }
  let s = fmtNum(re);
  if (Math.abs(im - 1) < EPS) s += "+i";
  else if (Math.abs(im + 1) < EPS) s += "-i";
  else if (im > 0) s += "+" + fmtNum(im) + "i";
  else s += fmtNum(im) + "i";
  return s;
}

function parseComplex(s: string): C {
  s = s.trim().replace(/\s/g, "");
  if (!s) return [0, 0];

  // No imaginary part
  if (!s.includes("i")) {
    return [parseFloat(s) || 0, 0];
  }

  // Remove 'i' marker
  s = s.replace(/i/g, "");

  // Find the last +/- that splits real and imaginary parts (skip index 0)
  let splitIdx = -1;
  for (let k = s.length - 1; k > 0; k--) {
    if (s[k] === "+" || s[k] === "-") {
      splitIdx = k;
      break;
    }
  }

  if (splitIdx > 0) {
    const re = parseFloat(s.slice(0, splitIdx)) || 0;
    const imStr = s.slice(splitIdx);
    let im: number;
    if (imStr === "+" || imStr === "") im = 1;
    else if (imStr === "-") im = -1;
    else im = parseFloat(imStr) || 0;
    return [re, im];
  }

  // Pure imaginary
  if (s === "" || s === "+") return [0, 1];
  if (s === "-") return [0, -1];
  return [0, parseFloat(s) || 0];
}

// ── Presets ──

interface Preset {
  label: string;
  matrix: C[];
  vector: C[];
}

const S2 = 1 / Math.sqrt(2);

const PRESETS: Preset[] = [
  { label: "I", matrix: [[1, 0], [0, 0], [0, 0], [1, 0]], vector: [[1, 0], [0, 0]] },
  { label: "X", matrix: [[0, 0], [1, 0], [1, 0], [0, 0]], vector: [[1, 0], [0, 0]] },
  { label: "Y", matrix: [[0, 0], [0, -1], [0, 1], [0, 0]], vector: [[1, 0], [0, 0]] },
  { label: "Z", matrix: [[1, 0], [0, 0], [0, 0], [-1, 0]], vector: [[1, 0], [0, 0]] },
  { label: "H", matrix: [[S2, 0], [S2, 0], [S2, 0], [-S2, 0]], vector: [[1, 0], [0, 0]] },
  { label: "S", matrix: [[1, 0], [0, 0], [0, 0], [0, 1]], vector: [[1, 0], [0, 0]] },
  { label: "T", matrix: [[1, 0], [0, 0], [0, 0], [S2, S2]], vector: [[1, 0], [0, 0]] },
  { label: "√X", matrix: [[0.5, 0.5], [0.5, -0.5], [0.5, -0.5], [0.5, 0.5]], vector: [[1, 0], [0, 0]] },
];

// ── Component ──

export function MatrixCalc({ params }: { params: MatrixCalcParams }) {
  const initMat = params.matrix ?? [1, 0, 0, 1];
  const initVec = params.vector ?? [1, 0];

  const [matText, setMatText] = useState<string[]>(initMat.map(String));
  const [vecText, setVecText] = useState<string[]>(initVec.map(String));

  const updateMat = useCallback((idx: number, val: string) => {
    setMatText((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  }, []);

  const updateVec = useCallback((idx: number, val: string) => {
    setVecText((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  }, []);

  const applyPreset = useCallback((p: Preset) => {
    setMatText(p.matrix.map(fmtC));
    setVecText(p.vector.map(fmtC));
  }, []);

  // Parse and compute
  const matrix = matText.map(parseComplex);
  const vector = vecText.map(parseComplex);
  const result: C[] = [
    cAdd(cMul(matrix[0], vector[0]), cMul(matrix[1], vector[1])),
    cAdd(cMul(matrix[2], vector[0]), cMul(matrix[3], vector[1])),
  ];

  const texFormula = String.raw`\begin{pmatrix} ${fmtC(matrix[0])} & ${fmtC(matrix[1])} \\ ${fmtC(matrix[2])} & ${fmtC(matrix[3])} \end{pmatrix} \begin{pmatrix} ${fmtC(vector[0])} \\ ${fmtC(vector[1])} \end{pmatrix} = \begin{pmatrix} ${fmtC(result[0])} \\ ${fmtC(result[1])} \end{pmatrix}`;

  return (
    <div className={styles.container}>
      {params.title && (
        <div style={{ fontSize: "1rem", fontWeight: 600 }}>
          {params.title}
        </div>
      )}

      {/* Presets */}
      <div className={styles.presetRow}>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={styles.presetBtn}
            onClick={() => applyPreset(p)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Editable inputs */}
      <div className={styles.section}>
        <span className={styles.label}>Matrix</span>
        <div
          className={styles.matrixGrid}
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          {matText.map((v, i) => (
            <input
              key={i}
              className={styles.cell}
              type="text"
              value={v}
              onChange={(e) => updateMat(i, e.target.value)}
            />
          ))}
        </div>

        <span className={styles.operator}>×</span>

        <span className={styles.label}>Vector</span>
        <div
          className={styles.matrixGrid}
          style={{ gridTemplateColumns: "1fr" }}
        >
          {vecText.map((v, i) => (
            <input
              key={i}
              className={styles.cell}
              type="text"
              value={v}
              onChange={(e) => updateVec(i, e.target.value)}
            />
          ))}
        </div>

        <span className={styles.operator}>=</span>

        <div className={styles.resultVector}>
          {result.map((v, i) => (
            <div key={i} className={styles.resultCell}>
              {fmtC(v)}
            </div>
          ))}
        </div>
      </div>

      {/* KaTeX formula display */}
      <div className={styles.formulaRow}>
        <KMath tex={texFormula} display />
      </div>
    </div>
  );
}

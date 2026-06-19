import { useState, useCallback } from "react";
import { Math } from "../primitives/Math";
import styles from "./MatrixCalc.module.scss";

export interface MatrixCalcParams {
  /** Initial 2x2 matrix as [row0col0, row0col1, row1col0, row1col1] */
  matrix?: number[];
  /** Initial 2-element vector */
  vector?: number[];
  /** Title shown above the calculator */
  title?: string;
}

interface Preset {
  label: string;
  matrix: number[];
  vector: number[];
}

const PRESETS: Preset[] = [
  { label: "Identity (I)", matrix: [1, 0, 0, 1], vector: [1, 0] },
  { label: "Pauli-X", matrix: [0, 1, 1, 0], vector: [1, 0] },
  { label: "Pauli-Z", matrix: [1, 0, 0, -1], vector: [1, 0] },
  {
    label: "Hadamard (H)",
    matrix: [0.7071, 0.7071, 0.7071, -0.7071],
    vector: [1, 0],
  },
];

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

export function MatrixCalc({ params }: { params: MatrixCalcParams }) {
  const [matrix, setMatrix] = useState<number[]>(
    params.matrix ?? [1, 0, 0, 1],
  );
  const [vector, setVector] = useState<number[]>(
    params.vector ?? [1, 0],
  );

  const updateMatrix = useCallback((idx: number, val: string) => {
    setMatrix((m) => {
      const next = [...m];
      next[idx] = parseFloat(val) || 0;
      return next;
    });
  }, []);

  const updateVector = useCallback((idx: number, val: string) => {
    setVector((v) => {
      const next = [...v];
      next[idx] = parseFloat(val) || 0;
      return next;
    });
  }, []);

  const applyPreset = useCallback((p: Preset) => {
    setMatrix([...p.matrix]);
    setVector([...p.vector]);
  }, []);

  // Matrix × Vector multiplication
  const result = [
    matrix[0] * vector[0] + matrix[1] * vector[1],
    matrix[2] * vector[0] + matrix[3] * vector[1],
  ];

  const texFormula = String.raw`\begin{pmatrix} ${fmt(matrix[0])} & ${fmt(matrix[1])} \\ ${fmt(matrix[2])} & ${fmt(matrix[3])} \end{pmatrix} \begin{pmatrix} ${fmt(vector[0])} \\ ${fmt(vector[1])} \end{pmatrix} = \begin{pmatrix} ${fmt(result[0])} \\ ${fmt(result[1])} \end{pmatrix}`;

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
          {matrix.map((v, i) => (
            <input
              key={i}
              className={styles.cell}
              type="number"
              step="any"
              value={v}
              onChange={(e) => updateMatrix(i, e.target.value)}
            />
          ))}
        </div>

        <span className={styles.operator}>×</span>

        <span className={styles.label}>Vector</span>
        <div
          className={styles.matrixGrid}
          style={{ gridTemplateColumns: "1fr" }}
        >
          {vector.map((v, i) => (
            <input
              key={i}
              className={styles.cell}
              type="number"
              step="any"
              value={v}
              onChange={(e) => updateVector(i, e.target.value)}
            />
          ))}
        </div>

        <span className={styles.operator}>=</span>

        <div className={styles.resultVector}>
          {result.map((v, i) => (
            <div key={i} className={styles.resultCell}>
              {fmt(v)}
            </div>
          ))}
        </div>
      </div>

      {/* KaTeX formula display */}
      <div className={styles.formulaRow}>
        <Math tex={texFormula} display />
      </div>
    </div>
  );
}

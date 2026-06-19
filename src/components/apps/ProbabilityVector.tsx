import { useState, useCallback, useRef } from "react";
import { Mafs, Coordinates, Vector, Circle, Plot, Text as MafsText } from "mafs";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import "mafs/core.css";
import { RAW_KET0, RAW_KET1, RAW_RESULT, RAW_GHOST, RAW_ACCENT } from "../../utils/colors";
import { Math as KMath } from "../primitives/Math";
import styles from "./ProbabilityVector.module.scss";

// ── Constants ──

const COMPONENT_COLORS = [RAW_KET0, RAW_KET1, RAW_RESULT, RAW_ACCENT, "#c678dd", "#e5c07b"];

type TabId = "2d" | "3d" | "xd";

export interface ProbabilityVectorParams {
  tab?: TabId;
  dim?: number;
}

// ── Normalization helpers ──

/** Given amplitudes, return normalized amplitudes (Σ|αᵢ|²=1) */
function normalize(amps: number[]): number[] {
  const sumSq = amps.reduce((s, a) => s + a * a, 0);
  if (sumSq < 1e-12) {
    // All zero — equal superposition
    const v = 1 / Math.sqrt(amps.length);
    return amps.map(() => v);
  }
  const scale = 1 / Math.sqrt(sumSq);
  return amps.map((a) => a * scale);
}

/** Update one amplitude and renormalize others proportionally */
function updateAndNormalize(
  amps: number[],
  index: number,
  newProb: number,
): number[] {
  // newProb is the desired |αᵢ|² (0..1)
  const clamped = Math.max(0, Math.min(1, newProb));
  const newAmp = Math.sqrt(clamped);

  const remaining = 1 - clamped;
  const otherSumSq = amps.reduce(
    (s, a, i) => (i === index ? s : s + a * a),
    0,
  );

  const result = [...amps];
  result[index] = newAmp;

  if (otherSumSq > 1e-12) {
    const scale = Math.sqrt(remaining / otherSumSq);
    for (let i = 0; i < result.length; i++) {
      if (i !== index) result[i] *= scale;
    }
  } else {
    // Others are all zero — distribute equally
    const n = amps.length - 1;
    const each = n > 0 ? Math.sqrt(remaining / n) : 0;
    for (let i = 0; i < result.length; i++) {
      if (i !== index) result[i] = each;
    }
  }
  return result;
}

function fmtAmp(v: number): string {
  return v.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function fmtPct(prob: number): string {
  return `${(prob * 100).toFixed(1)}%`;
}

// ── 2D Unit Circle visualization ──

function UnitCircle2D({ amps }: { amps: number[] }) {
  const x = amps[0];
  const y = amps[1];
  const angle = Math.atan2(y, x);

  return (
    <div className={styles.vizArea}>
      <Mafs width={300} height={300} viewBox={{ x: [-1.5, 1.5], y: [-1.5, 1.5] }}>
        <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={{ lines: 1 }} />
        <Circle center={[0, 0]} radius={1} color={RAW_GHOST} fillOpacity={0} strokeOpacity={0.4} />

        {/* Component projections */}
        <Plot.Parametric
          xy={(t) => [x, t]}
          t={[0, y]}
          color={RAW_KET1}
          style="dashed"
          weight={1}
          opacity={0.5}
        />
        <Plot.Parametric
          xy={(t) => [t, y]}
          t={[0, x]}
          color={RAW_KET0}
          style="dashed"
          weight={1}
          opacity={0.5}
        />

        {/* State vector */}
        <Vector tip={[x, y]} color={RAW_RESULT} weight={3} />

        {/* Angle arc */}
        {Math.abs(angle) > 0.02 && (
          <Plot.Parametric
            xy={(t) => [0.3 * Math.cos(t), 0.3 * Math.sin(t)]}
            t={[0, angle]}
            color={RAW_ACCENT}
            weight={1.5}
          />
        )}

        {/* Labels */}
        <MafsText x={1.35} y={-0.15} size={12} color={RAW_KET0}>|0⟩</MafsText>
        <MafsText x={0.15} y={1.35} size={12} color={RAW_KET1}>|1⟩</MafsText>
        <MafsText x={x + 0.15} y={y + 0.15} size={12} color={RAW_RESULT}>|ψ⟩</MafsText>
      </Mafs>
    </div>
  );
}

// ── 3D Unit Sphere visualization ──

const _yAxis = new THREE.Vector3(0, 1, 0);

function SphereArrow({ amps }: { amps: number[] }) {
  const groupRef = useRef<THREE.Group>(null);
  // amps: [α₀, α₁, α₂] → 3D point (α₀, α₂, α₁) to put |0⟩ on +X
  const target = new THREE.Vector3(amps[0], amps[2], amps[1]).normalize();
  const targetQuat = useRef(new THREE.Quaternion());
  targetQuat.current.setFromUnitVectors(_yAxis, target);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.quaternion.slerp(targetQuat.current, 0.2);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.85, 8]} />
        <meshStandardMaterial color="#fc6255" />
      </mesh>
      <mesh position={[0, 0.85 + 0.075, 0]}>
        <coneGeometry args={[0.06, 0.15, 12]} />
        <meshStandardMaterial color="#fc6255" />
      </mesh>
      <mesh position={[0, 0.85 + 0.15, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#fc6255" emissive="#fc6255" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function Sphere3DScene({ amps }: { amps: number[] }) {
  // Wireframe circles
  const eqPoints: THREE.Vector3[] = [];
  const merXY: THREE.Vector3[] = [];
  const merYZ: THREE.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    eqPoints.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    merXY.push(new THREE.Vector3(Math.cos(a), Math.sin(a), 0));
    merYZ.push(new THREE.Vector3(0, Math.cos(a), Math.sin(a)));
  }

  const len = 1.2;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 5]} intensity={0.8} />

      {/* Sphere shell */}
      <mesh>
        <sphereGeometry args={[0.99, 32, 32]} />
        <meshStandardMaterial color="#1e1e3e" transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Wireframe */}
      <Line points={eqPoints} color="#444466" lineWidth={1} />
      <Line points={merXY} color="#444466" lineWidth={0.5} transparent opacity={0.4} />
      <Line points={merYZ} color="#444466" lineWidth={0.5} transparent opacity={0.4} />

      {/* Axes */}
      <Line points={[[-len, 0, 0], [len, 0, 0]]} color="#666688" lineWidth={1} />
      <Line points={[[0, -len, 0], [0, len, 0]]} color="#666688" lineWidth={1} />
      <Line points={[[0, 0, -len], [0, 0, len]]} color="#666688" lineWidth={1} />

      {/* Labels: |0⟩ on +X, |1⟩ on +Z, |2⟩ on +Y */}
      <Billboard position={[len + 0.1, 0, 0]}><Text fontSize={0.12} color={RAW_KET0}>|0⟩</Text></Billboard>
      <Billboard position={[0, 0, len + 0.1]}><Text fontSize={0.12} color={RAW_KET1}>|1⟩</Text></Billboard>
      <Billboard position={[0, len + 0.1, 0]}><Text fontSize={0.12} color={RAW_RESULT}>|2⟩</Text></Billboard>

      <SphereArrow amps={amps} />

      <OrbitControls enablePan={false} enableZoom={true} minDistance={2} maxDistance={5} />
    </>
  );
}

function UnitSphere3D({ amps }: { amps: number[] }) {
  return (
    <div className={styles.vizArea}>
      <div className={styles.canvasWrap}>
        <Canvas
          camera={{ position: [2, 1.5, 2], fov: 40 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Sphere3DScene amps={amps} />
        </Canvas>
      </div>
    </div>
  );
}

// ── Main Component ──

export function ProbabilityVector({ params }: { params: ProbabilityVectorParams }) {
  const [tab, setTab] = useState<TabId>(params.tab ?? "2d");
  const [dim, setDim] = useState(params.dim ?? 4);

  // Amplitudes for each tab (independent state)
  const [amps2d, setAmps2d] = useState(() => normalize([1, 0]));
  const [amps3d, setAmps3d] = useState(() => normalize([1, 0, 0]));
  const [ampsXd, setAmpsXd] = useState(() => {
    const a = new Array(dim).fill(0);
    a[0] = 1;
    return normalize(a);
  });

  // Current amps/setter based on tab
  const amps = tab === "2d" ? amps2d : tab === "3d" ? amps3d : ampsXd;
  const setAmps = tab === "2d" ? setAmps2d : tab === "3d" ? setAmps3d : setAmpsXd;

  const handleProbChange = useCallback(
    (index: number, newProb: number) => {
      setAmps((prev) => updateAndNormalize(prev, index, newProb));
    },
    [setAmps],
  );

  const handleDimChange = useCallback(
    (newDim: number) => {
      setDim(newDim);
      const a = new Array(newDim).fill(0);
      a[0] = 1;
      setAmpsXd(normalize(a));
    },
    [],
  );

  // KaTeX formula for linear combination
  const lcParts = amps
    .map((_, i) => `\\alpha_{${i}}|${i}\\rangle`)
    .join(" + ");
  const lcTex = `|\\psi\\rangle = ${lcParts}`;

  // KaTeX formula for normalization
  const normParts = amps
    .map((_, i) => `|\\alpha_{${i}}|^2`)
    .join(" + ");
  const normTex = `${normParts} = 1`;

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {(["2d", "3d", "xd"] as TabId[]).map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.active : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "2d" ? "2D" : t === "3d" ? "3D" : `${dim}D`}
          </button>
        ))}
        {tab === "xd" && (
          <div className={styles.dimRow}>
            <button
              className={styles.dimBtn}
              disabled={dim <= 2}
              onClick={() => handleDimChange(dim - 1)}
            >
              −
            </button>
            <span className={styles.dimLabel}>{dim}</span>
            <button
              className={styles.dimBtn}
              disabled={dim >= 6}
              onClick={() => handleDimChange(dim + 1)}
            >
              +
            </button>
          </div>
        )}
      </div>

      <div className={styles.main}>
        {/* Visualization */}
        {tab === "2d" && <UnitCircle2D amps={amps} />}
        {tab === "3d" && <UnitSphere3D amps={amps} />}

        {/* Controls */}
        <div className={styles.controlArea}>
          {/* Vector notation */}
          <div className={styles.vectorNotation}>
            <span className={styles.ketLabel}>
              <KMath tex="|\\psi\\rangle =" />
            </span>
            <div className={styles.bracket}>
              {amps.map((a, i) => {
                const prob = a * a;
                const color = COMPONENT_COLORS[i % COMPONENT_COLORS.length];
                return (
                  <div key={i} className={styles.bracketRow}>
                    <span className={styles.basisLabel} style={{ color }}>
                      |{i}⟩
                    </span>
                    <span className={styles.amplitude} style={{ color }}>
                      {fmtAmp(a)}
                    </span>
                    <span className={styles.probability}>
                      ({fmtPct(prob)})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Probability sliders */}
          <div className={styles.sliderSection}>
            <div className={styles.sectionTitle}>確率 (スライダー)</div>
            {amps.map((a, i) => {
              const prob = a * a;
              const color = COMPONENT_COLORS[i % COMPONENT_COLORS.length];
              return (
                <div key={i} className={styles.sliderRow}>
                  <span className={styles.sliderLabel} style={{ color }}>
                    |{i}⟩
                  </span>
                  <input
                    className={styles.slider}
                    type="range"
                    min={0}
                    max={1}
                    step={0.005}
                    value={prob}
                    onChange={(e) =>
                      handleProbChange(i, parseFloat(e.target.value))
                    }
                  />
                  <span className={styles.sliderValue}>
                    {fmtAmp(a)} ({fmtPct(prob)})
                  </span>
                </div>
              );
            })}
          </div>

          {/* Probability bars */}
          <div className={styles.sliderSection}>
            <div className={styles.sectionTitle}>確率分布</div>
            {amps.map((a, i) => {
              const prob = a * a;
              const color = COMPONENT_COLORS[i % COMPONENT_COLORS.length];
              return (
                <div key={i} className={styles.barRow}>
                  <span className={styles.barLabel} style={{ color }}>
                    |{i}⟩
                  </span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${prob * 100}%`, background: color }}
                    />
                  </div>
                  <span className={styles.barValue}>{fmtPct(prob)}</span>
                </div>
              );
            })}
          </div>

          {/* Linear combination */}
          <div className={styles.normRow}>
            <KMath tex={lcTex} />
          </div>

          {/* Normalization */}
          <div className={styles.normRow}>
            <span className={styles.normOk}>&#10003;</span>
            <KMath tex={normTex} />
          </div>
        </div>
      </div>
    </div>
  );
}

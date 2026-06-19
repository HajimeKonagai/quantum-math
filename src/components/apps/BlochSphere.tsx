import { useState, useCallback, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { Math as KMath } from "../primitives/Math";
import styles from "./BlochSphere.module.scss";

// ── Types ──

export interface BlochSphereParams {
  theta?: number;
  phi?: number;
  title?: string;
}

interface Preset {
  label: string;
  theta: number;
  phi: number;
}

interface Gate {
  label: string;
  /** Apply gate: (theta, phi) => [newTheta, newPhi] */
  apply: (t: number, p: number) => [number, number];
}

// ── Data ──

const PRESETS: Preset[] = [
  { label: "|0⟩", theta: 0, phi: 0 },
  { label: "|1⟩", theta: Math.PI, phi: 0 },
  { label: "|+⟩", theta: Math.PI / 2, phi: 0 },
  { label: "|−⟩", theta: Math.PI / 2, phi: Math.PI },
  { label: "|i⟩", theta: Math.PI / 2, phi: Math.PI / 2 },
  { label: "|-i⟩", theta: Math.PI / 2, phi: -Math.PI / 2 },
];

const GATES: Gate[] = [
  { label: "X", apply: (t, p) => [Math.PI - t, -p] },
  { label: "Y", apply: (t, p) => [Math.PI - t, Math.PI - p] },
  { label: "Z", apply: (t, p) => [t, p + Math.PI] },
  { label: "H", apply: (t, p) => {
    // Hadamard: rotation π around (X+Z)/√2 axis
    // Bloch vector (sx, sy, sz) -> (sz, -sy, sx)
    const sx = Math.sin(t) * Math.cos(p);
    const sy = Math.sin(t) * Math.sin(p);
    const sz = Math.cos(t);
    const nx = sz, ny = -sy, nz = sx;
    const nt = Math.acos(Math.max(-1, Math.min(1, nz)));
    const np = Math.atan2(ny, nx);
    return [nt, np];
  }},
  { label: "S", apply: (t, p) => [t, p + Math.PI / 2] },
  { label: "T", apply: (t, p) => [t, p + Math.PI / 4] },
  { label: "√X", apply: (t, p) => {
    // √X = rotation π/2 around X axis
    const sx = Math.sin(t) * Math.cos(p);
    const sy = Math.sin(t) * Math.sin(p);
    const sz = Math.cos(t);
    // Rx(π/2): (sx, sy, sz) -> (sx, sz, -sy)  (nah, let's compute properly)
    const c = Math.cos(Math.PI / 4), s = Math.sin(Math.PI / 4);
    const ny = c * sy - s * sz;
    const nz = s * sy + c * sz;
    const nt = Math.acos(Math.max(-1, Math.min(1, nz)));
    const np = Math.atan2(ny, sx);
    return [nt, np];
  }},
  { label: "Rset", apply: () => [0, 0] },
];

// ── Coordinate mapping ──
// Bloch sphere: Z = |0⟩/|1⟩ polar axis, X = |+⟩/|−⟩, Y = |i⟩/|-i⟩
// Three.js:     Y = up
// Mapping: Bloch (bx, by, bz) → Three.js (bx, bz, by)
//   |0⟩ (Bloch +Z) → Three.js +Y (top)
//   |1⟩ (Bloch -Z) → Three.js -Y (bottom)
//   |+⟩ (Bloch +X) → Three.js +X (right)
//   |i⟩ (Bloch +Y) → Three.js +Z (front)

function blochToThree(bx: number, by: number, bz: number): [number, number, number] {
  return [bx, bz, by];
}

// ── 3D Scene Components ──

function BlochWireframe() {
  // Equator: Bloch XY plane (bz=0) → Three.js XZ plane (y=0)
  const eqPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const [tx, ty, tz] = blochToThree(Math.cos(a), Math.sin(a), 0);
    eqPoints.push(new THREE.Vector3(tx, ty, tz));
  }

  // Meridian in Bloch XZ plane (by=0)
  const merXZ: THREE.Vector3[] = [];
  // Meridian in Bloch YZ plane (bx=0)
  const merYZ: THREE.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    {
      const [tx, ty, tz] = blochToThree(Math.cos(a), 0, Math.sin(a));
      merXZ.push(new THREE.Vector3(tx, ty, tz));
    }
    {
      const [tx, ty, tz] = blochToThree(0, Math.cos(a), Math.sin(a));
      merYZ.push(new THREE.Vector3(tx, ty, tz));
    }
  }

  return (
    <>
      <Line points={eqPoints} color="#444466" lineWidth={1} />
      <Line points={merXZ} color="#444466" lineWidth={0.5} transparent opacity={0.5} />
      <Line points={merYZ} color="#444466" lineWidth={0.5} transparent opacity={0.5} />
    </>
  );
}

function Axes() {
  const len = 1.3;
  // Bloch axis endpoints → Three.js coords
  const xEnd = blochToThree(len, 0, 0);
  const xNeg = blochToThree(-len, 0, 0);
  const yEnd = blochToThree(0, len, 0);
  const yNeg = blochToThree(0, -len, 0);
  const zEnd = blochToThree(0, 0, len);
  const zNeg = blochToThree(0, 0, -len);

  return (
    <>
      {/* Bloch X axis (|+⟩ / |−⟩) */}
      <Line points={[xNeg, xEnd]} color="#666688" lineWidth={1} />
      {/* Bloch Y axis (|i⟩ / |-i⟩) */}
      <Line points={[yNeg, yEnd]} color="#666688" lineWidth={1} />
      {/* Bloch Z axis (|0⟩ / |1⟩) */}
      <Line points={[zNeg, zEnd]} color="#666688" lineWidth={1} />

      {/* Axis labels */}
      <Billboard position={blochToThree(len + 0.15, 0, 0)}><Text fontSize={0.12} color="#888888">x</Text></Billboard>
      <Billboard position={blochToThree(0, len + 0.15, 0)}><Text fontSize={0.12} color="#888888">y</Text></Billboard>

      {/* Basis state labels on Bloch Z axis */}
      <Billboard position={blochToThree(0, 0, 1.2)}><Text fontSize={0.15} color="#58c4dd">|0⟩</Text></Billboard>
      <Billboard position={blochToThree(0, 0, -1.2)}><Text fontSize={0.15} color="#83c167">|1⟩</Text></Billboard>

      {/* Equator labels */}
      <Billboard position={blochToThree(1.2, 0, 0)}><Text fontSize={0.12} color="#aaaacc">|+⟩</Text></Billboard>
      <Billboard position={blochToThree(-1.2, 0, 0)}><Text fontSize={0.12} color="#aaaacc">|−⟩</Text></Billboard>
      <Billboard position={blochToThree(0, 1.2, 0)}><Text fontSize={0.12} color="#aaaacc">|i⟩</Text></Billboard>
      <Billboard position={blochToThree(0, -1.2, 0)}><Text fontSize={0.12} color="#aaaacc">|-i⟩</Text></Billboard>
    </>
  );
}

const _yAxis = new THREE.Vector3(0, 1, 0);

function StateArrow({ theta, phi }: { theta: number; phi: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Bloch → Three.js target quaternion
  const bx = Math.sin(theta) * Math.cos(phi);
  const by = Math.sin(theta) * Math.sin(phi);
  const bz = Math.cos(theta);
  const [tx, ty, tz] = blochToThree(bx, by, bz);
  const targetDir = new THREE.Vector3(tx, ty, tz).normalize();
  const targetQuat = useRef(new THREE.Quaternion());
  targetQuat.current.setFromUnitVectors(_yAxis, targetDir);

  useFrame(() => {
    if (groupRef.current) {
      // Slerp quaternion directly — handles antipodal directions correctly
      groupRef.current.quaternion.slerp(targetQuat.current, 0.18);
    }
  });

  // Arrow built along +Y (cylinder/cone default axis)
  const shaftLen = 0.85;

  return (
    <group ref={groupRef}>
      {/* Shaft along +Y */}
      <mesh position={[0, shaftLen / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, shaftLen, 8]} />
        <meshStandardMaterial color="#fc6255" />
      </mesh>
      {/* Cone tip at top of shaft (cone points along +Y by default) */}
      <mesh position={[0, shaftLen + 0.075, 0]}>
        <coneGeometry args={[0.06, 0.15, 12]} />
        <meshStandardMaterial color="#fc6255" />
      </mesh>
      {/* Tip sphere */}
      <mesh position={[0, shaftLen + 0.15, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#fc6255" emissive="#fc6255" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function SphereShell() {
  return (
    <mesh>
      <sphereGeometry args={[0.99, 32, 32]} />
      <meshStandardMaterial
        color="#1e1e3e"
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Scene({ theta, phi }: { theta: number; phi: number }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 5]} intensity={0.8} />
      <SphereShell />
      <BlochWireframe />
      <Axes />
      <StateArrow theta={theta} phi={phi} />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={6}
      />
    </>
  );
}

// ── Helpers ──

function normAngle(a: number): number {
  // Normalize to [-π, π]
  let v = a % (2 * Math.PI);
  if (v > Math.PI) v -= 2 * Math.PI;
  if (v < -Math.PI) v += 2 * Math.PI;
  return v;
}

function fmtAngle(rad: number): string {
  const deg = (rad * 180) / Math.PI;
  return `${deg.toFixed(0)}°`;
}

// ── Main Component ──

export function BlochSphere({ params }: { params: BlochSphereParams }) {
  const [theta, setTheta] = useState(params.theta ?? 0);
  const [phi, setPhi] = useState(params.phi ?? 0);

  // Refs to avoid stale closures in gate handlers
  const thetaRef = useRef(theta);
  const phiRef = useRef(phi);
  thetaRef.current = theta;
  phiRef.current = phi;

  const handleGate = useCallback((gate: Gate) => {
    const [nt, np] = gate.apply(thetaRef.current, phiRef.current);
    setTheta(Math.max(0, Math.min(Math.PI, nt)));
    setPhi(normAngle(np));
  }, []);

  // Compute state info
  const cosHalf = Math.cos(theta / 2);
  const sinHalf = Math.sin(theta / 2);
  const prob0 = cosHalf * cosHalf;
  const prob1 = sinHalf * sinHalf;

  const alphaStr = prob0 === 1 ? "1" : prob0 === 0 ? "0" : cosHalf.toFixed(3);
  const betaAbs = prob1 === 1 ? "1" : prob1 === 0 ? "0" : sinHalf.toFixed(3);
  const phiDeg = (phi * 180) / Math.PI;
  const phaseStr = Math.abs(phiDeg) < 0.5 ? "" : `e^{i${(phiDeg / 180).toFixed(2)}\\pi}`;

  const tex = phaseStr
    ? `|\\psi\\rangle = ${alphaStr}|0\\rangle + ${phaseStr} \\cdot ${betaAbs}|1\\rangle`
    : `|\\psi\\rangle = ${alphaStr}|0\\rangle + ${betaAbs}|1\\rangle`;

  return (
    <div className={styles.container}>
      {/* 3D Canvas */}
      <div className={styles.canvasWrap}>
        <Canvas
          camera={{ position: [2.5, 1.8, 1.5], fov: 40 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Scene theta={theta} phi={phi} />
        </Canvas>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {/* State display */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>State</div>
          <div className={styles.stateDisplay}>
            <KMath tex={tex} />
            <div className={styles.probRow}>
              <span className={styles.prob0}>P(0) = {(prob0 * 100).toFixed(1)}%</span>
              <span className={styles.prob1}>P(1) = {(prob1 * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Angle sliders */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Angles</div>
          <div className={styles.sliderRow}>
            <span className={styles.sliderLabel}>θ</span>
            <input
              className={styles.slider}
              type="range"
              min={0}
              max={Math.PI}
              step={0.01}
              value={theta}
              onChange={(e) => setTheta(parseFloat(e.target.value))}
            />
            <span className={styles.sliderValue}>{fmtAngle(theta)}</span>
          </div>
          <div className={styles.sliderRow}>
            <span className={styles.sliderLabel}>φ</span>
            <input
              className={styles.slider}
              type="range"
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              value={phi}
              onChange={(e) => setPhi(parseFloat(e.target.value))}
            />
            <span className={styles.sliderValue}>{fmtAngle(phi)}</span>
          </div>
        </div>

        {/* Preset states */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Preset States</div>
          <div className={styles.presetGrid}>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                className={styles.presetBtn}
                onClick={() => { setTheta(p.theta); setPhi(p.phi); }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gate buttons */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Apply Gate</div>
          <div className={styles.gateGrid}>
            {GATES.map((g) => (
              <button
                key={g.label}
                className={styles.gateBtn}
                onClick={() => handleGate(g)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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
  axis?: [number, number, number]; // Bloch coordinate rotation axis (unit vector)
  angle?: number;                  // Rotation angle (radians)
}

type GatePhase =
  | { type: "idle" }
  | { type: "axis"; gate: Gate }
  | { type: "rotating"; gate: Gate; startTheta: number; startPhi: number };

// ── Data ──

const PRESETS: Preset[] = [
  { label: "|0⟩", theta: 0, phi: 0 },
  { label: "|1⟩", theta: Math.PI, phi: 0 },
  { label: "|+⟩", theta: Math.PI / 2, phi: 0 },
  { label: "|−⟩", theta: Math.PI / 2, phi: Math.PI },
  { label: "|i⟩", theta: Math.PI / 2, phi: Math.PI / 2 },
  { label: "|-i⟩", theta: Math.PI / 2, phi: -Math.PI / 2 },
];

const INV_SQRT2 = 1 / Math.sqrt(2);

const GATES: Gate[] = [
  { label: "X", apply: (t, p) => [Math.PI - t, -p], axis: [1, 0, 0], angle: Math.PI },
  { label: "Y", apply: (t, p) => [Math.PI - t, Math.PI - p], axis: [0, 1, 0], angle: Math.PI },
  { label: "Z", apply: (t, p) => [t, p + Math.PI], axis: [0, 0, 1], angle: Math.PI },
  { label: "H", apply: (t, p) => {
    const sx = Math.sin(t) * Math.cos(p);
    const sy = Math.sin(t) * Math.sin(p);
    const sz = Math.cos(t);
    const nx = sz, ny = -sy, nz = sx;
    const nt = Math.acos(Math.max(-1, Math.min(1, nz)));
    const np = Math.atan2(ny, nx);
    return [nt, np];
  }, axis: [INV_SQRT2, 0, INV_SQRT2], angle: Math.PI },
  { label: "S", apply: (t, p) => [t, p + Math.PI / 2], axis: [0, 0, 1], angle: Math.PI / 2 },
  { label: "T", apply: (t, p) => [t, p + Math.PI / 4], axis: [0, 0, 1], angle: Math.PI / 4 },
  { label: "√X", apply: (t, p) => {
    // Rotation by π/2 around X axis on the Bloch sphere
    const sx = Math.sin(t) * Math.cos(p);
    const sy = Math.sin(t) * Math.sin(p);
    const sz = Math.cos(t);
    // Rx(π/2): (sx, sy, sz) → (sx, -sz, sy)
    const nt = Math.acos(Math.max(-1, Math.min(1, sy)));
    const np = Math.atan2(-sz, sx);
    return [nt, np];
  }, axis: [1, 0, 0], angle: Math.PI / 2 },
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

// ── Rodrigues rotation ──

/** Rotate Bloch vector (vx,vy,vz) around unit axis (ax,ay,az) by angle radians */
function rodrigues(
  vx: number, vy: number, vz: number,
  ax: number, ay: number, az: number,
  angle: number,
): [number, number, number] {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const dot = vx * ax + vy * ay + vz * az;
  // v*cos + (k x v)*sin + k*(k.v)*(1-cos)
  const cx = ay * vz - az * vy;
  const cy = az * vx - ax * vz;
  const cz = ax * vy - ay * vx;
  return [
    vx * cosA + cx * sinA + ax * dot * (1 - cosA),
    vy * cosA + cy * sinA + ay * dot * (1 - cosA),
    vz * cosA + cz * sinA + az * dot * (1 - cosA),
  ];
}

function blochFromSpherical(theta: number, phi: number): [number, number, number] {
  return [
    Math.sin(theta) * Math.cos(phi),
    Math.sin(theta) * Math.sin(phi),
    Math.cos(theta),
  ];
}

// ── 3D Scene Components ──

function BlochWireframe() {
  const eqPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const [tx, ty, tz] = blochToThree(Math.cos(a), Math.sin(a), 0);
    eqPoints.push(new THREE.Vector3(tx, ty, tz));
  }

  const merXZ: THREE.Vector3[] = [];
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
  const xEnd = blochToThree(len, 0, 0);
  const xNeg = blochToThree(-len, 0, 0);
  const yEnd = blochToThree(0, len, 0);
  const yNeg = blochToThree(0, -len, 0);
  const zEnd = blochToThree(0, 0, len);
  const zNeg = blochToThree(0, 0, -len);

  return (
    <>
      <Line points={[xNeg, xEnd]} color="#666688" lineWidth={1} />
      <Line points={[yNeg, yEnd]} color="#666688" lineWidth={1} />
      <Line points={[zNeg, zEnd]} color="#666688" lineWidth={1} />

      <Billboard position={blochToThree(len + 0.15, 0, 0)}><Text fontSize={0.12} color="#888888">x</Text></Billboard>
      <Billboard position={blochToThree(0, len + 0.15, 0)}><Text fontSize={0.12} color="#888888">y</Text></Billboard>

      <Billboard position={blochToThree(0, 0, 1.2)}><Text fontSize={0.15} color="#58c4dd">|0⟩</Text></Billboard>
      <Billboard position={blochToThree(0, 0, -1.2)}><Text fontSize={0.15} color="#83c167">|1⟩</Text></Billboard>

      <Billboard position={blochToThree(1.2, 0, 0)}><Text fontSize={0.12} color="#aaaacc">|+⟩</Text></Billboard>
      <Billboard position={blochToThree(-1.2, 0, 0)}><Text fontSize={0.12} color="#aaaacc">|−⟩</Text></Billboard>
      <Billboard position={blochToThree(0, 1.2, 0)}><Text fontSize={0.12} color="#aaaacc">|i⟩</Text></Billboard>
      <Billboard position={blochToThree(0, -1.2, 0)}><Text fontSize={0.12} color="#aaaacc">|-i⟩</Text></Billboard>
    </>
  );
}

function RotationAxisLine({ axis }: { axis: [number, number, number] }) {
  const len = 1.3;
  const [ax, ay, az] = axis;
  const posEnd = blochToThree(ax * len, ay * len, az * len);
  const negEnd = blochToThree(-ax * len, -ay * len, -az * len);

  return (
    <>
      <Line
        points={[negEnd, posEnd]}
        color="#ffdd00"
        lineWidth={2.5}
      />
      {/* Endpoint spheres */}
      <mesh position={posEnd}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffdd00" emissive="#ffdd00" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={negEnd}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffdd00" emissive="#ffdd00" emissiveIntensity={0.6} />
      </mesh>
    </>
  );
}

const _yAxis = new THREE.Vector3(0, 1, 0);

interface StateArrowProps {
  theta: number;
  phi: number;
  /** When set, override position directly (skip slerp) */
  overrideBloch?: [number, number, number] | null;
}

function StateArrow({ theta, phi, overrideBloch }: StateArrowProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Bloch → Three.js target quaternion
  const bx = overrideBloch ? overrideBloch[0] : Math.sin(theta) * Math.cos(phi);
  const by = overrideBloch ? overrideBloch[1] : Math.sin(theta) * Math.sin(phi);
  const bz = overrideBloch ? overrideBloch[2] : Math.cos(theta);
  const [tx, ty, tz] = blochToThree(bx, by, bz);
  const targetDir = new THREE.Vector3(tx, ty, tz).normalize();
  const targetQuat = useRef(new THREE.Quaternion());
  targetQuat.current.setFromUnitVectors(_yAxis, targetDir);

  useFrame(() => {
    if (groupRef.current) {
      if (overrideBloch) {
        // During rotation animation: set quaternion directly (no slerp lag)
        groupRef.current.quaternion.copy(targetQuat.current);
      } else {
        // Normal: slerp for smooth transitions
        groupRef.current.quaternion.slerp(targetQuat.current, 0.18);
      }
    }
  });

  const shaftLen = 0.85;

  return (
    <group ref={groupRef}>
      <mesh position={[0, shaftLen / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, shaftLen, 8]} />
        <meshStandardMaterial color="#fc6255" />
      </mesh>
      <mesh position={[0, shaftLen + 0.075, 0]}>
        <coneGeometry args={[0.06, 0.15, 12]} />
        <meshStandardMaterial color="#fc6255" />
      </mesh>
      <mesh position={[0, shaftLen + 0.15, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#fc6255" emissive="#fc6255" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

/** Drives the rotation animation progress inside the Canvas */
function RotationAnimator({
  gate,
  startTheta,
  startPhi,
  onProgress,
  onComplete,
}: {
  gate: Gate;
  startTheta: number;
  startPhi: number;
  onProgress: (bloch: [number, number, number]) => void;
  onComplete: () => void;
}) {
  const progressRef = useRef(0);
  const duration = 0.6; // seconds
  const completedRef = useRef(false);

  const [sx, sy, sz] = blochFromSpherical(startTheta, startPhi);
  const axis = gate.axis!;
  const totalAngle = gate.angle!;

  useFrame((_, delta) => {
    if (completedRef.current) return;

    progressRef.current = Math.min(1, progressRef.current + delta / duration);
    const t = progressRef.current;
    // Ease in-out
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const currentAngle = eased * totalAngle;

    const [rx, ry, rz] = rodrigues(sx, sy, sz, axis[0], axis[1], axis[2], currentAngle);
    onProgress([rx, ry, rz]);

    if (t >= 1) {
      completedRef.current = true;
      onComplete();
    }
  });

  return null;
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

function Scene({
  theta,
  phi,
  phase,
  overrideBloch,
  onRotationProgress,
  onRotationComplete,
}: {
  theta: number;
  phi: number;
  phase: GatePhase;
  overrideBloch: [number, number, number] | null;
  onRotationProgress: (bloch: [number, number, number]) => void;
  onRotationComplete: () => void;
}) {
  const showAxis = phase.type === "axis" || phase.type === "rotating";
  const axisData = showAxis ? (phase as { gate: Gate }).gate.axis : null;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 5]} intensity={0.8} />
      <SphereShell />
      <BlochWireframe />
      <Axes />
      {showAxis && axisData && <RotationAxisLine axis={axisData} />}
      <StateArrow theta={theta} phi={phi} overrideBloch={overrideBloch} />
      {phase.type === "rotating" && (
        <RotationAnimator
          gate={phase.gate}
          startTheta={phase.startTheta}
          startPhi={phase.startPhi}
          onProgress={onRotationProgress}
          onComplete={onRotationComplete}
        />
      )}
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
  const [phase, setPhase] = useState<GatePhase>({ type: "idle" });
  const [overrideBloch, setOverrideBloch] = useState<[number, number, number] | null>(null);

  // Refs to avoid stale closures in gate handlers
  const thetaRef = useRef(theta);
  const phiRef = useRef(phi);
  thetaRef.current = theta;
  phiRef.current = phi;

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const resetPhase = useCallback(() => {
    setPhase({ type: "idle" });
    setOverrideBloch(null);
  }, []);

  const handleGate = useCallback((gate: Gate) => {
    const currentPhase = phaseRef.current;

    // Reset is always 1-click
    if (!gate.axis) {
      resetPhase();
      const [nt, np] = gate.apply(thetaRef.current, phiRef.current);
      setTheta(Math.max(0, Math.min(Math.PI, nt)));
      setPhi(normAngle(np));
      return;
    }

    if (currentPhase.type === "idle") {
      // 1st click: show axis
      setPhase({ type: "axis", gate });
    } else if (currentPhase.type === "axis") {
      if (currentPhase.gate.label === gate.label) {
        // 2nd click on same gate: start rotation
        setPhase({
          type: "rotating",
          gate,
          startTheta: thetaRef.current,
          startPhi: phiRef.current,
        });
      } else {
        // Different gate: switch axis
        setPhase({ type: "axis", gate });
      }
    } else if (currentPhase.type === "rotating") {
      // Ignore clicks while rotating
    }
  }, [resetPhase]);

  const handleRotationProgress = useCallback((bloch: [number, number, number]) => {
    setOverrideBloch(bloch);
  }, []);

  const handleRotationComplete = useCallback(() => {
    const p = phaseRef.current;
    if (p.type === "rotating") {
      const [nt, np] = p.gate.apply(p.startTheta, p.startPhi);
      setTheta(Math.max(0, Math.min(Math.PI, nt)));
      setPhi(normAngle(np));
    }
    setOverrideBloch(null);
    setPhase({ type: "idle" });
  }, []);

  const handleSliderTheta = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    resetPhase();
    setTheta(parseFloat(e.target.value));
  }, [resetPhase]);

  const handleSliderPhi = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    resetPhase();
    setPhi(parseFloat(e.target.value));
  }, [resetPhase]);

  const handlePreset = useCallback((p: Preset) => {
    resetPhase();
    setTheta(p.theta);
    setPhi(p.phi);
  }, [resetPhase]);

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

  // Active gate label for button highlight
  const activeGateLabel = phase.type !== "idle" ? (phase as { gate: Gate }).gate.label : null;

  return (
    <div className={styles.container}>
      {/* 3D Canvas */}
      <div className={styles.canvasWrap}>
        <Canvas
          camera={{ position: [2.5, 1.8, 1.5], fov: 40 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Scene
            theta={theta}
            phi={phi}
            phase={phase}
            overrideBloch={overrideBloch}
            onRotationProgress={handleRotationProgress}
            onRotationComplete={handleRotationComplete}
          />
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
              onChange={handleSliderTheta}
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
              onChange={handleSliderPhi}
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
                onClick={() => handlePreset(p)}
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
                className={`${styles.gateBtn} ${activeGateLabel === g.label ? styles.gateBtnActive : ""}`}
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

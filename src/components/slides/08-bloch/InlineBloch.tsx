/**
 * InlineBloch — Reusable inline 3D Bloch sphere for slides.
 *
 * Shows a non-interactive Bloch sphere with configurable state vector,
 * highlighted states, and optional rotation axis.
 */
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

// ── Coordinate mapping (same as BlochSphere app) ──
// Bloch (bx, by, bz) → Three.js (bx, bz, by)

function b2t(bx: number, by: number, bz: number): [number, number, number] {
  return [bx, bz, by];
}

// ── Wireframe + Axes ──

function Wireframe() {
  const eq: THREE.Vector3[] = [];
  const mXZ: THREE.Vector3[] = [];
  const mYZ: THREE.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    eq.push(new THREE.Vector3(...b2t(Math.cos(a), Math.sin(a), 0)));
    mXZ.push(new THREE.Vector3(...b2t(Math.cos(a), 0, Math.sin(a))));
    mYZ.push(new THREE.Vector3(...b2t(0, Math.cos(a), Math.sin(a))));
  }
  return (
    <>
      <Line points={eq} color="#444466" lineWidth={1} />
      <Line points={mXZ} color="#444466" lineWidth={0.5} transparent opacity={0.5} />
      <Line points={mYZ} color="#444466" lineWidth={0.5} transparent opacity={0.5} />
    </>
  );
}

function AxisLines() {
  const L = 1.3;
  return (
    <>
      <Line points={[b2t(-L, 0, 0), b2t(L, 0, 0)]} color="#666688" lineWidth={1} />
      <Line points={[b2t(0, -L, 0), b2t(0, L, 0)]} color="#666688" lineWidth={1} />
      <Line points={[b2t(0, 0, -L), b2t(0, 0, L)]} color="#666688" lineWidth={1} />

      <Billboard position={b2t(L + 0.15, 0, 0)}><Text fontSize={0.12} color="#888888">x</Text></Billboard>
      <Billboard position={b2t(0, L + 0.15, 0)}><Text fontSize={0.12} color="#888888">y</Text></Billboard>

      <Billboard position={b2t(0, 0, 1.2)}><Text fontSize={0.15} color="#58c4dd">|0⟩</Text></Billboard>
      <Billboard position={b2t(0, 0, -1.2)}><Text fontSize={0.15} color="#83c167">|1⟩</Text></Billboard>
      <Billboard position={b2t(1.2, 0, 0)}><Text fontSize={0.12} color="#aaaacc">|+⟩</Text></Billboard>
      <Billboard position={b2t(-1.2, 0, 0)}><Text fontSize={0.12} color="#aaaacc">|−⟩</Text></Billboard>
      <Billboard position={b2t(0, 1.2, 0)}><Text fontSize={0.12} color="#aaaacc">|i⟩</Text></Billboard>
      <Billboard position={b2t(0, -1.2, 0)}><Text fontSize={0.12} color="#aaaacc">|-i⟩</Text></Billboard>
    </>
  );
}

// ── State arrow ──

const _yAxis = new THREE.Vector3(0, 1, 0);

function StateArrow({ theta, phi, color = "#fc6255" }: { theta: number; phi: number; color?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const bx = Math.sin(theta) * Math.cos(phi);
  const by = Math.sin(theta) * Math.sin(phi);
  const bz = Math.cos(theta);
  const [tx, ty, tz] = b2t(bx, by, bz);
  const dir = new THREE.Vector3(tx, ty, tz).normalize();
  const targetQuat = useRef(new THREE.Quaternion());
  targetQuat.current.setFromUnitVectors(_yAxis, dir);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.quaternion.slerp(targetQuat.current, 0.18);
    }
  });

  const shaft = 0.85;
  return (
    <group ref={groupRef}>
      <mesh position={[0, shaft / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, shaft, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, shaft + 0.075, 0]}>
        <coneGeometry args={[0.06, 0.15, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, shaft + 0.15, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ── Rotation axis line ──

function RotAxisLine({ axis }: { axis: [number, number, number] }) {
  const L = 1.3;
  const [ax, ay, az] = axis;
  return (
    <>
      <Line
        points={[b2t(-ax * L, -ay * L, -az * L), b2t(ax * L, ay * L, az * L)]}
        color="#ffdd00"
        lineWidth={2.5}
      />
      <mesh position={b2t(ax * L, ay * L, az * L)}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffdd00" emissive="#ffdd00" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={b2t(-ax * L, -ay * L, -az * L)}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffdd00" emissive="#ffdd00" emissiveIntensity={0.6} />
      </mesh>
    </>
  );
}

// ── State dot (small sphere at a basis state position) ──

function StateDot({ theta, phi, color }: { theta: number; phi: number; color: string }) {
  const bx = Math.sin(theta) * Math.cos(phi);
  const by = Math.sin(theta) * Math.sin(phi);
  const bz = Math.cos(theta);
  return (
    <mesh position={b2t(bx, by, bz)}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
    </mesh>
  );
}

// ── Main component ──

export interface InlineBlochProps {
  /** State vector position (theta, phi) */
  theta?: number;
  phi?: number;
  /** Show the state arrow */
  showArrow?: boolean;
  /** Arrow color */
  arrowColor?: string;
  /** Additional arrows to display */
  extraArrows?: Array<{ theta: number; phi: number; color: string }>;
  /** Rotation axis to display (Bloch coords, unit vector) */
  rotationAxis?: [number, number, number];
  /** Highlighted state dots: array of {theta, phi, color} */
  highlights?: Array<{ theta: number; phi: number; color: string }>;
  /** CSS width/height */
  width?: number;
  height?: number;
}

export function InlineBloch({
  theta = 0,
  phi = 0,
  showArrow = true,
  arrowColor,
  extraArrows,
  rotationAxis,
  highlights,
  width = 360,
  height = 340,
}: InlineBlochProps) {
  return (
    <div style={{ width, height, borderRadius: 8, overflow: "hidden", background: "#111122" }}>
      <Canvas
        camera={{ position: [2.5, 1.8, 1.5], fov: 40 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 5]} intensity={0.8} />
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
        <Wireframe />
        <AxisLines />
        {showArrow && <StateArrow theta={theta} phi={phi} color={arrowColor} />}
        {extraArrows?.map((a, i) => (
          <StateArrow key={i} theta={a.theta} phi={a.phi} color={a.color} />
        ))}
        {rotationAxis && <RotAxisLine axis={rotationAxis} />}
        {highlights?.map((h, i) => (
          <StateDot key={i} theta={h.theta} phi={h.phi} color={h.color} />
        ))}
        <OrbitControls enablePan={false} enableZoom={false} minDistance={3.5} maxDistance={3.5} />
      </Canvas>
    </div>
  );
}

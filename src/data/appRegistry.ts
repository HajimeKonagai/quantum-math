import type { AppEntry } from "../types/app";
import { ProbabilityVector } from "../components/apps/ProbabilityVector";
import { MatrixCalc } from "../components/apps/MatrixCalc";
import { ComplexPlane } from "../components/apps/ComplexPlane";
import { InnerProduct } from "../components/apps/InnerProduct";
import { BlochSphere } from "../components/apps/BlochSphere";
import { RSACipher } from "../components/apps/RSACipher";
import { QuantumEscape } from "../components/apps/QuantumEscape";

export const appRegistry: AppEntry[] = [
  {
    id: "probability-vector",
    title: "確率ベクトル",
    description: "量子状態の確率分布を可視化。2D単位円・3D単位球上でベクトルの正規化を確認できます。",
    component: ProbabilityVector,
    defaultParams: {
      tab: "2d",
      dim: 4,
    },
  },
  {
    id: "matrix-calc",
    title: "行列の演算",
    description: "行列×ベクトルの計算をリアルタイムに確認。量子ゲートのプリセット付き。",
    component: MatrixCalc,
    defaultParams: {
      matrix: [1, 0, 0, 1],
      vector: [1, 0],
      title: "行列 × ベクトル 計算機",
    },
  },
  {
    id: "complex-plane",
    title: "複素平面",
    description: "複素数の掛け算による回転・拡大を可視化。連続適用で回転の蓄積も確認できます。",
    component: ComplexPlane,
    defaultParams: {
      a: 1,
      b: 0.5,
      r: 1,
      theta: Math.PI / 4,
    },
  },
  {
    id: "inner-product",
    title: "内積の可視化",
    description: "2つの単位ベクトルの内積（コサイン類似度）と角度を可視化。射影も表示されます。",
    component: InnerProduct,
    defaultParams: {
      angleA: 0,
      angleB: Math.PI / 3,
    },
  },
  {
    id: "bloch-sphere",
    title: "ブロッホ球",
    description: "量子ビットの状態をブロッホ球上で可視化。ゲート操作やプリセット状態を試せます。",
    component: BlochSphere,
    defaultParams: {
      theta: 0,
      phi: 0,
      title: "ブロッホ球ビジュアライザー",
    },
  },
  {
    id: "rsa-cipher",
    title: "RSA 暗号",
    description: "RSA暗号の暗号化・復号をステップバイステップで体験。量子コンピュータによる素因数分解の脅威を理解できます。",
    component: RSACipher,
    defaultParams: {
      char: "M",
      p: 13,
      q: 17,
      e: 7,
    },
  },
  {
    id: "quantum-escape",
    title: "量子脱出パズル",
    description: "Groverのアルゴリズムを体験。5つのスイッチと制約ルール(SAT)で脱出条件を定義し、Oracle・Diffusionの各ステップを視覚的に学べます。",
    component: QuantumEscape,
    defaultParams: {
      preset: "balanced",
    },
  },
];

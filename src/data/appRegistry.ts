import type { AppEntry } from "../types/app";
import { MatrixCalc } from "../components/apps/MatrixCalc";
import { BlochSphere } from "../components/apps/BlochSphere";
import { ComplexPlane } from "../components/apps/ComplexPlane";
import { ProbabilityVector } from "../components/apps/ProbabilityVector";
import { InnerProduct } from "../components/apps/InnerProduct";

export const appRegistry: AppEntry[] = [
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
    id: "inner-product",
    title: "内積の可視化",
    description: "2つの単位ベクトルの内積（コサイン類似度）と角度を可視化。射影も表示されます。",
    component: InnerProduct,
    defaultParams: {
      angleA: 0,
      angleB: Math.PI / 3,
    },
  },
];

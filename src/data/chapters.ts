import type { Chapter } from "../types/slide";

// Section title slides
import { createSectionTitle } from "../components/slides/SectionTitle";

// 01-intro
import { IntroWhyMath } from "../components/slides/01-intro/IntroWhyMath";
import { GoalFormula } from "../components/slides/01-intro/GoalFormula";
import { MappingTable } from "../components/slides/01-intro/MappingTable";
import { PrerequisiteCheck } from "../components/slides/01-intro/PrerequisiteCheck";
import { PrerequisiteAnswer } from "../components/slides/01-intro/PrerequisiteAnswer";

// 02-vector
import { VectorDefinition } from "../components/slides/02-vector/VectorDefinition";
import { VecNotation } from "../components/slides/02-vector/VecNotation";
import { VecOperations } from "../components/slides/02-vector/VecOperations";
import { VecAsState } from "../components/slides/02-vector/VecAsState";
import { VecContents } from "../components/slides/02-vector/VecContents";
import { VecProbSum } from "../components/slides/02-vector/VecProbSum";
import { NormalizationWhy } from "../components/slides/02-vector/NormalizationWhy";
import { VecAmplitude } from "../components/slides/02-vector/VecAmplitude";
import { VecStateExpr } from "../components/slides/02-vector/VecStateExpr";

// 03-matrix
import { MatDefinition } from "../components/slides/03-matrix/MatDefinition";
import { MatProduct } from "../components/slides/03-matrix/MatProduct";
import { MatTransform } from "../components/slides/03-matrix/MatTransform";
import { MatGates } from "../components/slides/03-matrix/MatGates";
import { MatUnitary } from "../components/slides/03-matrix/MatUnitary";

// 04-example1
import { ExRandomBit } from "../components/slides/04-example1/ExRandomBit";

// 05-bridge
import { BridgeRealLimit } from "../components/slides/05-bridge/BridgeRealLimit";
import { BridgeMystery } from "../components/slides/05-bridge/BridgeMystery";
import { BridgePhase } from "../components/slides/05-bridge/BridgePhase";
import { BridgeToComplex } from "../components/slides/05-bridge/BridgeToComplex";

// 06-complex
import { CpxDefinition } from "../components/slides/06-complex/CpxDefinition";
import { CpxImaginaryUnit } from "../components/slides/06-complex/CpxImaginaryUnit";
import { CpxRealImag } from "../components/slides/06-complex/CpxRealImag";
import { CpxRealIsComplex } from "../components/slides/06-complex/CpxRealIsComplex";
import { CpxPlane } from "../components/slides/06-complex/CpxPlane";
import { CpxOperations } from "../components/slides/06-complex/CpxOperations";
import { CpxSummary } from "../components/slides/06-complex/CpxSummary";
import { CpxNewVector } from "../components/slides/06-complex/CpxNewVector";
import { CpxMisconception } from "../components/slides/06-complex/CpxMisconception";
import { CpxNotation } from "../components/slides/06-complex/CpxNotation";

// 07-inner-product
import { IpDefinition } from "../components/slides/07-inner-product/IpDefinition";
import { IpMeaning } from "../components/slides/07-inner-product/IpMeaning";
import { IpNotation } from "../components/slides/07-inner-product/IpNotation";
import { IpMeasurement } from "../components/slides/07-inner-product/IpMeasurement";
import { IpProbability } from "../components/slides/07-inner-product/IpProbability";

// 08-bloch
import { BlochWhatIs } from "../components/slides/08-bloch/BlochWhatIs";
import { BlochStates } from "../components/slides/08-bloch/BlochStates";
import { BlochGates } from "../components/slides/08-bloch/BlochGates";
import { BlochSummary } from "../components/slides/08-bloch/BlochSummary";

// 10-example2
import { Ex2Protocol } from "../components/slides/10-example2/Ex2Protocol";
import { Ex2Eavesdrop } from "../components/slides/10-example2/Ex2Eavesdrop";

// 09-next
import { NxtMultiQubit } from "../components/slides/09-next/NxtMultiQubit";
import { NxtEntanglement } from "../components/slides/09-next/NxtEntanglement";
import { NxtProblem } from "../components/slides/09-next/NxtProblem";
import { NxtUse } from "../components/slides/09-next/NxtUse";
import { NxtAlgorithms } from "../components/slides/09-next/NxtAlgorithms";
import { NxtSummary } from "../components/slides/09-next/NxtSummary";

const SectionIntro = createSectionTitle("はじめに", "量子と数学のつながり");
const SectionVector = createSectionTitle("ベクトル", "状態を表す矢印");
const SectionMatrix = createSectionTitle("行列", "状態を変換する装置");
const SectionExample1 = createSectionTitle("実例1", "完全ランダム");
const SectionBridge = createSectionTitle("つづきに", "実数から複素数へ");
const SectionComplex = createSectionTitle("複素数", "位相を表す数");
const SectionInnerProduct = createSectionTitle("内積", "測定と確率");
const SectionBloch = createSectionTitle("ブロッホ球", "量子状態の可視化");
const SectionExample2 = createSectionTitle("実例2", "量子暗号");
const SectionNext = createSectionTitle("ここから", "さらに先へ");

export const chapters: Chapter[] = [
  {
    id: "intro",
    title: "はじめに",
    slides: [
      {
        id: "section-intro",
        title: "はじめに",
        steps: 1,
        component: SectionIntro,
      },
      {
        id: "intro-why-math",
        title: "なぜ数学が出てくるのか",
        steps: 7,
        component: IntroWhyMath,
      },
      {
        id: "intro-goal",
        title: "今日のゴール",
        steps: 2,
        component: GoalFormula,
      },
      {
        id: "intro-mapping",
        title: "対応表",
        steps: 3,
        component: MappingTable,
      },
      {
        id: "intro-prereq",
        title: "必要知識の確認",
        steps: 1,
        component: PrerequisiteCheck,
      },
      {
        id: "intro-prereq-answer",
        title: "必要知識の確認 — 答え",
        steps: 1,
        component: PrerequisiteAnswer,
      },
    ],
  },
  {
    id: "vector",
    title: "ベクトル",
    slides: [
      {
        id: "section-vector",
        title: "ベクトル",
        steps: 1,
        component: SectionVector,
      },
      {
        id: "vec-definition",
        title: "ベクトルとは",
        steps: 2,
        component: VectorDefinition,
      },
      {
        id: "vec-notation",
        title: "ベクトルの記法",
        steps: 2,
        component: VecNotation,
      },
      {
        id: "vec-operations",
        title: "ベクトルの演算",
        steps: 4,
        component: VecOperations,
      },
      {
        id: "vec-as-state",
        title: "量子コンピュータにおけるベクトル",
        steps: 3,
        component: VecAsState,
      },
      {
        id: "vec-contents",
        title: "ベクトルの中身",
        steps: 3,
        component: VecContents,
      },
      {
        id: "vec-prob-sum",
        title: "確率の合計は1",
        steps: 3,
        component: VecProbSum,
      },
      {
        id: "vec-normalization",
        title: "なぜ正規化が必要か",
        steps: 4,
        component: NormalizationWhy,
      },
      {
        id: "vec-amplitude",
        title: "振幅 — 2乗すると確率になる数",
        steps: 3,
        component: VecAmplitude,
      },
      {
        id: "vec-state-expr",
        title: "状態表現",
        steps: 4,
        component: VecStateExpr,
      },
    ],
  },
  {
    id: "matrix",
    title: "行列",
    slides: [
      {
        id: "section-matrix",
        title: "行列",
        steps: 1,
        component: SectionMatrix,
      },
      {
        id: "mat-definition",
        title: "行列とは",
        steps: 3,
        component: MatDefinition,
      },
      {
        id: "mat-product",
        title: "行列の演算",
        steps: 3,
        component: MatProduct,
      },
      {
        id: "mat-transform",
        title: "行列によるベクトル変換",
        steps: 2,
        component: MatTransform,
      },
      {
        id: "mat-gates",
        title: "量子ゲート",
        steps: 3,
        component: MatGates,
      },
      {
        id: "mat-unitary",
        title: "ユニタリ変換",
        steps: 1,
        component: MatUnitary,
      },
    ],
  },
  {
    id: "example1",
    title: "実例1",
    slides: [
      {
        id: "section-example1",
        title: "実例1",
        steps: 1,
        component: SectionExample1,
      },
      {
        id: "ex-random-bit",
        title: "完全ランダム",
        steps: 1,
        component: ExRandomBit,
      },
    ],
  },
  {
    id: "bridge",
    title: "つづきに",
    slides: [
      {
        id: "section-bridge",
        title: "つづきに",
        steps: 1,
        component: SectionBridge,
      },
      {
        id: "bridge-real-limit",
        title: "実数の限界",
        steps: 1,
        component: BridgeRealLimit,
      },
      {
        id: "bridge-mystery",
        title: "不可思議な現象",
        steps: 1,
        component: BridgeMystery,
      },
      {
        id: "bridge-phase",
        title: "位相",
        steps: 1,
        component: BridgePhase,
      },
      {
        id: "bridge-to-complex",
        title: "実数から複素数へ",
        steps: 1,
        component: BridgeToComplex,
      },
    ],
  },
  {
    id: "complex",
    title: "複素数",
    slides: [
      {
        id: "section-complex",
        title: "複素数",
        steps: 1,
        component: SectionComplex,
      },
      {
        id: "cpx-definition",
        title: "複素数とは",
        steps: 2,
        component: CpxDefinition,
      },
      {
        id: "cpx-imaginary-unit",
        title: "虚数単位",
        steps: 1,
        component: CpxImaginaryUnit,
      },
      {
        id: "cpx-real-imag",
        title: "実部と虚部",
        steps: 1,
        component: CpxRealImag,
      },
      {
        id: "cpx-real-is-complex",
        title: "実数も複素数",
        steps: 1,
        component: CpxRealIsComplex,
      },
      {
        id: "cpx-plane",
        title: "複素平面",
        steps: 1,
        component: CpxPlane,
      },
      {
        id: "cpx-operations",
        title: "複素数の演算",
        steps: 2,
        component: CpxOperations,
      },
      {
        id: "cpx-summary",
        title: "まとめ",
        steps: 1,
        component: CpxSummary,
      },
      {
        id: "cpx-new-vector",
        title: "新たなベクトル",
        steps: 2,
        component: CpxNewVector,
      },
      {
        id: "cpx-misconception",
        title: "よくある誤解",
        steps: 1,
        component: CpxMisconception,
      },
      {
        id: "cpx-notation",
        title: "表記の話",
        steps: 3,
        component: CpxNotation,
      },
    ],
  },
  {
    id: "inner-product",
    title: "内積",
    slides: [
      {
        id: "section-inner-product",
        title: "内積",
        steps: 1,
        component: SectionInnerProduct,
      },
      {
        id: "ip-definition",
        title: "内積とは",
        steps: 1,
        component: IpDefinition,
      },
      {
        id: "ip-meaning",
        title: "内積の意味",
        steps: 2,
        component: IpMeaning,
      },
      {
        id: "ip-notation",
        title: "補足",
        steps: 1,
        component: IpNotation,
      },
      {
        id: "ip-measurement",
        title: "測定",
        steps: 1,
        component: IpMeasurement,
      },
      {
        id: "ip-probability",
        title: "観測確率",
        steps: 6,
        component: IpProbability,
      },
    ],
  },
  {
    id: "bloch",
    title: "ブロッホ球",
    slides: [
      {
        id: "section-bloch",
        title: "ブロッホ球",
        steps: 1,
        component: SectionBloch,
      },
      {
        id: "bloch-what-is",
        title: "ブロッホ球とは",
        steps: 2,
        component: BlochWhatIs,
      },
      {
        id: "bloch-states",
        title: "状態を見る",
        steps: 2,
        component: BlochStates,
      },
      {
        id: "bloch-gates",
        title: "ゲートを見る",
        steps: 3,
        component: BlochGates,
      },
      {
        id: "bloch-summary",
        title: "量子コンピュータを見る",
        steps: 3,
        component: BlochSummary,
      },
    ],
  },
  {
    id: "example2",
    title: "実例2",
    slides: [
      {
        id: "section-example2",
        title: "実例2",
        steps: 1,
        component: SectionExample2,
      },
      {
        id: "ex2-protocol",
        title: "BB84",
        steps: 3,
        component: Ex2Protocol,
      },
      {
        id: "ex2-eavesdrop",
        title: "盗聴検知",
        steps: 3,
        component: Ex2Eavesdrop,
      },
    ],
  },
  {
    id: "next",
    title: "ここから",
    slides: [
      {
        id: "section-next",
        title: "ここから",
        steps: 1,
        component: SectionNext,
      },
      {
        id: "nxt-multi-qubit",
        title: "多重キュビット",
        steps: 2,
        component: NxtMultiQubit,
      },
      {
        id: "nxt-entanglement",
        title: "もつれ",
        steps: 1,
        component: NxtEntanglement,
      },
      {
        id: "nxt-problem",
        title: "シンプルな問題",
        steps: 5,
        component: NxtProblem,
      },
      {
        id: "nxt-use",
        title: "もつれを使うと何ができるの？",
        steps: 1,
        component: NxtUse,
      },
      {
        id: "nxt-algorithms",
        title: "そして…",
        steps: 1,
        component: NxtAlgorithms,
      },
      {
        id: "nxt-summary",
        title: "最後の一言",
        steps: 1,
        component: NxtSummary,
      },
    ],
  },
];

/** Flat list of all slides across all chapters */
export const allSlides = chapters.flatMap((ch) => ch.slides);

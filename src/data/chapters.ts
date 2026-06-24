import type { Chapter } from "../types/slide";

// Section title slides
import { createSectionTitle } from "../components/slides/SectionTitle";

// 01-intro
import { IntroWhyMath } from "../components/slides/01-intro/IntroWhyMath";
import { GoalFormula } from "../components/slides/01-intro/GoalFormula";
import { MappingTable } from "../components/slides/01-intro/MappingTable";
import { PrerequisiteCheck } from "../components/slides/01-intro/PrerequisiteCheck";

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

// 04-bloch
import { BlochWhatIs } from "../components/slides/04-bloch/BlochWhatIs";
import { BlochStates } from "../components/slides/04-bloch/BlochStates";
import { BlochGates } from "../components/slides/04-bloch/BlochGates";
import { BlochSummary } from "../components/slides/04-bloch/BlochSummary";

const SectionIntro = createSectionTitle("はじめに", "量子と数学のつながり");
const SectionVector = createSectionTitle("ベクトル", "状態を表す矢印");
const SectionMatrix = createSectionTitle("行列", "状態を変換する装置");
const SectionBloch = createSectionTitle("ブロッホ球", "量子状態の可視化");

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
];

/** Flat list of all slides across all chapters */
export const allSlides = chapters.flatMap((ch) => ch.slides);

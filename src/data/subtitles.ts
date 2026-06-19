/**
 * TSV 原稿 → 字幕マッピング
 * key: `${slideId}:${stepIndex}`
 */
export const subtitles: Record<string, string> = {
  // ── はじめに ──

  // IntroWhyMath
  "intro-why-math:0":
    "量子力学を、ひいては科学を勉強すると、なぜ数学が出てくるのでしょうか。",
  "intro-why-math:1":
    "ここで誤解してはいけないのは、「数学で量子力学が作られている」…",
  "intro-why-math:2":
    "わけではないということです。",
  "intro-why-math:3":
    "先にあったのは自然現象です。",
  "intro-why-math:4":
    "それらを矛盾なく記録し予測するために採用されたのが数学です。",
  "intro-why-math:5":
    "なぜベクトル？なぜ行列？考える必要はなく、実験結果→うまくいく→採用です。",
  "intro-why-math:6":
    "数学は量子力学を説明するための言葉のようなものです。今日はその言葉に少し触れてみましょう。",

  // GoalFormula
  "intro-goal:0":
    "本日の目標はこの式を抵抗なく読めるようになることです",
  "intro-goal:1":
    "終わった頃には各パーツに「色」がついて見えるようになれば十分です",

  // MappingTable
  "intro-mapping:0":
    "量子の概念にはそれぞれ対応する数学のツールがあります",
  "intro-mapping:1":
    "状態はベクトル、操作は行列、測定は内積、位相は複素数で表されます",
  "intro-mapping:2":
    "若干の間違いを含みますが、コンピュータ用語との対応も載せておきます",

  // PrerequisiteCheck
  "intro-prereq:0":
    "これらの前提知識があれば今日の内容は大丈夫です。サインコサインや微分積分は不要です。",

  // ── ベクトル ──

  // VectorDefinition
  "vec-definition:0":
    "ベクトルとは「向き」と「大きさ」をもった矢印、いくつかの数字の組みです",
  "vec-definition:1":
    "各成分はx方向に3、y方向に2を表しています",
  "vec-definition:2":
    "ベクトルは足し算ができます — 合力として考えることができます",
  "vec-definition:3":
    "スカラー倍 — 数字をかけて大きさを変えることができます",

  // VecNotation
  "vec-notation:0":
    "よくアルファベットの上に矢印をつけたり太字で表されます",
  "vec-notation:1":
    "今回の講座ではブラケット記法を使います。縦か横かが表記で明確にわかるのがメリットです。",

  // VecOperations
  "vec-operations:0":
    "今は足し算とスカラー倍だけ覚えてください。内積は後で説明します。",
  "vec-operations:1":
    "スカラー倍 — 数字をかけて大きさを変えることができます",
  "vec-operations:2":
    "基底のスカラー倍と足し算で、平面上の全てのベクトルが表せます",
  "vec-operations:3":
    "ベクトルは足すより分解する方が大事です",

  // VecAsState
  "vec-as-state:0":
    "量子コンピュータではベクトル = 状態です",
  "vec-as-state:1":
    "そもそも状態とは、古典コンピュータでいう 0 や 1 のことです",
  "vec-as-state:2":
    "量子ビットは 0 でもあり 1 でもある重ね合わせ状態を作れます。これをキュビットと呼びます。",

  // VecContents
  "vec-contents:0":
    "ベクトルの各成分には確率を決めるための値が入っています",
  "vec-contents:1":
    "今は確率を表していると思ってください。まずは触ってイメージを掴んでください。",
  "vec-contents:2":
    "観測するまでは重ね合わせに対して操作・演算ができます。ここが量子コンピュータの面白いところです。",

  // VecProbSum
  "vec-prob-sum:0":
    "確率を足し合わせたときに100%にならなければいけません",
  "vec-prob-sum:1":
    "ベクトルの長さを1に固定すれば合計が常に1になります。これを単位円と呼びます。",
  "vec-prob-sum:2":
    "ピタゴラスの定理により、単位円上では成分の2乗の合計は常に1です",

  // NormalizationWhy
  "vec-normalization:0":
    "確率をそのまま成分にすると、(0.5, 0.5) は単位円上に来ません",
  "vec-normalization:1":
    "確率の合計が1になる組み合わせでも、全て直線上にしか乗らず円弧には届きません",
  "vec-normalization:2":
    "正しくは確率の平方根を成分にします。50%ずつなら 1/√2 ≈ 0.707 です",
  "vec-normalization:3":
    "これが正規化条件 — 有効な量子状態は必ず単位円上にあります",

  // VecAmplitude
  "vec-amplitude:0":
    "50%ずつの場合、成分は0.5ではなく 1/√2 ≈ 0.707 です",
  "vec-amplitude:1":
    "25%や75%でも同じ仕組みで、全て単位円上に乗ります",
  "vec-amplitude:2":
    "ベクトルの中身は確率そのものではなく「2乗すると確率になる数」— これを振幅と呼びます",

  // VecStateExpr
  "vec-state-expr:0":
    "|0⟩ と |1⟩ は各軸方向の基底ベクトルです",
  "vec-state-expr:1":
    "状態ベクトルは基底のスカラー倍と足し算で表せます",
  "vec-state-expr:2":
    "50%/50%の例では |ψ⟩ = 1/√2 |0⟩ + 1/√2 |1⟩ — これが重ね合わせ状態です",
  "vec-state-expr:3":
    "片方の振幅が0のときは重ね合わせではなく、観測結果は確定します",

  // ── 行列 ──

  // MatDefinition
  "mat-definition:0":
    "行列は数字を四角く並べたものです。ベクトルの「変換機」として使います。",
  "mat-definition:1":
    "大文字のアルファベットで表記します。サイズは行×列で表します。",
  "mat-definition:2":
    "実はベクトルは行列の特殊なケース — n×1 行列です。",

  // MatProduct
  "mat-product:0":
    "足し算・スカラー倍はベクトルと同じです。対応する位置ごとに計算します。",
  "mat-product:1":
    "重要なのは行列積です。左の行と右の列の内積で各要素が決まります。",
  "mat-product:2":
    "行列 × ベクトル = 別のベクトル。行列はベクトル変換機です。",

  // MatTransform
  "mat-transform:0":
    "行列をかけるとベクトルが変換されます。ここでは90°回転の例です。",
  "mat-transform:1":
    "全てのベクトルが同じルールで変換されます — 空間全体が一様に変わるのが行列の本質です。",

  // MatGates
  "mat-gates:0":
    "量子コンピュータでは行列 = ゲートです。ベクトル（状態）を変換する装置です。",
  "mat-gates:1":
    "Xゲートは0と1を反転します。古典コンピュータのNOTに相当します。",
  "mat-gates:2":
    "Hゲートは重ね合わせ状態を作ります。量子コンピュータの最重要ゲートの一つです。",

  // MatUnitary
  "mat-unitary:0":
    "全てのゲートはベクトルの長さを保ちます。確率の合計が1という約束を守るためです。",
};

export function getSubtitle(slideId: string, stepIndex: number): string | undefined {
  return subtitles[`${slideId}:${stepIndex}`];
}

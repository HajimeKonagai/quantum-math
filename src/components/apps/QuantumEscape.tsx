import { useState, useMemo, useCallback } from "react";
import { RAW_KET1, RAW_GHOST, RAW_HIGHLIGHT } from "../../utils/colors";
import styles from "./QuantumEscape.module.scss";

// ── Types ──

type SwitchLabel = "A" | "B" | "C" | "D" | "E";
type RuleType = "implies" | "or" | "nand" | "and";
type GroverStepKind = "init" | "oracle" | "diffusion";

interface Rule {
  type: RuleType;
  x: SwitchLabel;
  y: SwitchLabel;
}

interface GroverSnapshot {
  amplitudes: number[]; // length 32
  stepKind: GroverStepKind;
  iterationCount: number;
}

export interface QuantumEscapeParams {
  preset?: string;
}

// ── Constants ──

const N = 32; // 2^5 states
const LABELS: SwitchLabel[] = ["A", "B", "C", "D", "E"];
const RULE_TYPES: RuleType[] = ["implies", "or", "nand", "and"];

const RULE_TYPE_LABELS: Record<RuleType, string> = {
  implies: "→",
  or: "OR",
  nand: "NAND",
  and: "AND",
};

// ── Presets ──

interface Preset {
  id: string;
  label: string;
  rules: Rule[];
}

const PRESETS: Preset[] = [
  {
    id: "easy",
    label: "Easy Escape",
    rules: [
      { type: "or", x: "A", y: "B" },
      { type: "or", x: "C", y: "D" },
    ],
  },
  {
    id: "balanced",
    label: "Balanced",
    rules: [
      { type: "implies", x: "D", y: "A" },
      { type: "or", x: "B", y: "C" },
      { type: "nand", x: "B", y: "D" },
      { type: "implies", x: "E", y: "C" },
    ],
  },
  {
    id: "hard",
    label: "Hard Puzzle",
    rules: [
      { type: "implies", x: "D", y: "A" },
      { type: "or", x: "B", y: "C" },
      { type: "nand", x: "B", y: "D" },
      { type: "implies", x: "E", y: "C" },
      { type: "and", x: "A", y: "E" },
    ],
  },
  {
    id: "single",
    label: "Single Answer",
    rules: [
      { type: "and", x: "A", y: "C" },
      { type: "and", x: "C", y: "E" },
      { type: "nand", x: "B", y: "A" },
      { type: "nand", x: "D", y: "E" },
      { type: "implies", x: "A", y: "E" },
    ],
  },
  {
    id: "none",
    label: "No Solution",
    rules: [
      { type: "and", x: "A", y: "B" },
      { type: "nand", x: "A", y: "B" },
    ],
  },
];

// ── Helpers ──

function evaluateRule(rule: Rule, bits: boolean[]): boolean {
  const xi = LABELS.indexOf(rule.x);
  const yi = LABELS.indexOf(rule.y);
  const xv = bits[xi];
  const yv = bits[yi];

  switch (rule.type) {
    case "implies":
      return !xv || yv; // X → Y ≡ ¬X ∨ Y
    case "or":
      return xv || yv;
    case "nand":
      return !(xv && yv);
    case "and":
      return xv && yv;
  }
}

function indexToBits(index: number): boolean[] {
  // index 0..31  →  [A, B, C, D, E]  (A = MSB)
  return [
    !!(index & 16),
    !!(index & 8),
    !!(index & 4),
    !!(index & 2),
    !!(index & 1),
  ];
}

function bitsToIndex(bits: boolean[]): number {
  return (
    (bits[0] ? 16 : 0) |
    (bits[1] ? 8 : 0) |
    (bits[2] ? 4 : 0) |
    (bits[3] ? 2 : 0) |
    (bits[4] ? 1 : 0)
  );
}

function indexToLabel(index: number): string {
  return index.toString(2).padStart(5, "0");
}

function computeValidStates(rules: Rule[]): Set<number> {
  const valid = new Set<number>();
  for (let i = 0; i < N; i++) {
    const bits = indexToBits(i);
    if (rules.every((r) => evaluateRule(r, bits))) {
      valid.add(i);
    }
  }
  return valid;
}

function ruleToString(rule: Rule): string {
  switch (rule.type) {
    case "implies":
      return `${rule.x} → ${rule.y}`;
    case "or":
      return `${rule.x} OR ${rule.y}`;
    case "nand":
      return `NAND(${rule.x},${rule.y})`;
    case "and":
      return `${rule.x} AND ${rule.y}`;
  }
}

// ── Grover simulation ──

function makeInitSnapshot(): GroverSnapshot {
  const amp = 1 / Math.sqrt(N);
  return {
    amplitudes: new Array(N).fill(amp),
    stepKind: "init",
    iterationCount: 0,
  };
}

function applyOracle(
  amplitudes: number[],
  validStates: Set<number>,
): number[] {
  return amplitudes.map((a, i) => (validStates.has(i) ? -a : a));
}

function applyDiffusion(amplitudes: number[]): number[] {
  const mean = amplitudes.reduce((s, a) => s + a, 0) / N;
  return amplitudes.map((a) => 2 * mean - a);
}

function optimalIterations(solutionCount: number): number {
  if (solutionCount === 0 || solutionCount === N) return 0;
  return Math.max(1, Math.round((Math.PI / 4) * Math.sqrt(N / solutionCount)));
}

function maxProbability(amplitudes: number[]): number {
  let max = 0;
  for (const a of amplitudes) {
    const p = a * a;
    if (p > max) max = p;
  }
  return max;
}

// ── Education notes ──

const STEP_NOTES: Record<
  GroverStepKind,
  { title: string; description: string }
> = {
  init: {
    title: "初期化: 均等重ね合わせ",
    description:
      "全32状態に等しい振幅 1/√32 を設定。各状態の観測確率 ≈ 3.1%。量子コンピュータの探索はここから始まります。",
  },
  oracle: {
    title: "オラクル (位相反転)",
    description:
      "制約を満たす状態の振幅の符号を反転 (×-1)。バーが負の方向に伸びます。古典的には「答えかどうか判定する」操作に対応します。",
  },
  diffusion: {
    title: "拡散 (振幅増幅)",
    description:
      "全振幅の平均値を中心に反転。正解の振幅が増加し、不正解が減少します。黄色の点線が平均値ラインです。",
  },
};

// ── SVG Bar Chart ──

const SVG_W = 600;
const SVG_H = 240;
const PAD_L = 40;
const PAD_R = 10;
const PAD_T = 20;
const PAD_B = 40;
const CHART_W = SVG_W - PAD_L - PAD_R;
const CHART_H = SVG_H - PAD_T - PAD_B;
const BAR_W = CHART_W / N;
const MID_Y = PAD_T + CHART_H / 2;

function AmplitudeChart({
  amplitudes,
  validStates,
  switchIndex,
}: {
  amplitudes: number[];
  validStates: Set<number>;
  switchIndex: number;
}) {
  // Determine Y scale: symmetric around 0
  const absMax = Math.max(
    ...amplitudes.map((a) => Math.abs(a)),
    1 / Math.sqrt(N) + 0.05,
  );
  const yScale = CHART_H / 2 / absMax;

  const mean = amplitudes.reduce((s, a) => s + a, 0) / N;
  const meanY = MID_Y - mean * yScale;

  // X-axis labels: show every 8th state
  const xLabels: { x: number; text: string }[] = [];
  for (let i = 0; i < N; i += 8) {
    xLabels.push({
      x: PAD_L + i * BAR_W + BAR_W * 4,
      text: indexToLabel(i),
    });
  }

  return (
    <svg
      className={styles.chart}
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Zero line */}
      <line
        x1={PAD_L}
        y1={MID_Y}
        x2={SVG_W - PAD_R}
        y2={MID_Y}
        stroke="#555"
        strokeWidth={0.5}
      />

      {/* Y axis labels */}
      <text
        x={PAD_L - 4}
        y={PAD_T + 4}
        textAnchor="end"
        fill="#888"
        fontSize={9}
        fontFamily="var(--font-mono)"
      >
        +{absMax.toFixed(2)}
      </text>
      <text
        x={PAD_L - 4}
        y={MID_Y + 3}
        textAnchor="end"
        fill="#888"
        fontSize={9}
        fontFamily="var(--font-mono)"
      >
        0
      </text>
      <text
        x={PAD_L - 4}
        y={PAD_T + CHART_H + 4}
        textAnchor="end"
        fill="#888"
        fontSize={9}
        fontFamily="var(--font-mono)"
      >
        -{absMax.toFixed(2)}
      </text>

      {/* Bars */}
      {amplitudes.map((amp, i) => {
        const isValid = validStates.has(i);
        const barColor = isValid ? RAW_KET1 : RAW_GHOST;
        const barX = PAD_L + i * BAR_W + 1;
        const barW = BAR_W - 2;
        const h = Math.abs(amp) * yScale;
        const barY = amp >= 0 ? MID_Y - h : MID_Y;

        return (
          <g key={i}>
            <rect
              x={barX}
              y={barY}
              width={barW}
              height={Math.max(h, 0.5)}
              fill={barColor}
              opacity={0.7}
            />
            {/* Highlight current switch state */}
            {i === switchIndex && (
              <rect
                x={barX - 1}
                y={PAD_T}
                width={barW + 2}
                height={CHART_H}
                fill="none"
                stroke={RAW_HIGHLIGHT}
                strokeWidth={1.5}
                strokeDasharray="3,2"
                opacity={0.8}
              />
            )}
          </g>
        );
      })}

      {/* Mean line (dashed yellow) */}
      <line
        x1={PAD_L}
        y1={meanY}
        x2={SVG_W - PAD_R}
        y2={meanY}
        stroke={RAW_HIGHLIGHT}
        strokeWidth={0.8}
        strokeDasharray="4,3"
        opacity={0.6}
      />

      {/* X-axis labels */}
      {xLabels.map(({ x, text }) => (
        <text
          key={text}
          x={x}
          y={SVG_H - 8}
          textAnchor="middle"
          fill="#888"
          fontSize={8}
          fontFamily="var(--font-mono)"
        >
          {text}
        </text>
      ))}

      {/* Y axis title */}
      <text
        x={10}
        y={MID_Y}
        textAnchor="middle"
        fill="#888"
        fontSize={9}
        fontFamily="var(--font-sans)"
        transform={`rotate(-90, 10, ${MID_Y})`}
      >
        振幅
      </text>
    </svg>
  );
}

// ── Main Component ──

export function QuantumEscape({ params }: { params: QuantumEscapeParams }) {
  // Preset
  const initialPreset =
    PRESETS.find((p) => p.id === params.preset) ?? PRESETS[1]; // default: balanced
  const [presetId, setPresetId] = useState(initialPreset.id);
  const [rules, setRules] = useState<Rule[]>(() => [...initialPreset.rules]);

  // Switches for classical testing
  const [switches, setSwitches] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);

  // Grover history
  const [history, setHistory] = useState<GroverSnapshot[]>([]);

  // Show answers toggle
  const [showAnswers, setShowAnswers] = useState(false);

  // Add-rule form state
  const [newRuleType, setNewRuleType] = useState<RuleType>("implies");
  const [newRuleX, setNewRuleX] = useState<SwitchLabel>("A");
  const [newRuleY, setNewRuleY] = useState<SwitchLabel>("B");

  // Derived
  const validStates = useMemo(() => computeValidStates(rules), [rules]);
  const currentSnapshot = history.length > 0 ? history[history.length - 1] : null;
  const switchIndex = bitsToIndex(switches);
  const solutionCount = validStates.size;
  const optIter = optimalIterations(solutionCount);

  // Check if current switches satisfy all rules
  const switchRuleResults = useMemo(
    () => rules.map((r) => evaluateRule(r, switches)),
    [rules, switches],
  );
  const allSatisfied = switchRuleResults.every(Boolean);

  // Current step info
  const currentIter = currentSnapshot?.iterationCount ?? 0;
  const currentStepKind = currentSnapshot?.stepKind ?? null;

  // Determine what the next step would be
  const nextStepKind: GroverStepKind | null = useMemo(() => {
    if (!currentSnapshot) return null; // not initialized
    if (currentSnapshot.stepKind === "init") return "oracle";
    if (currentSnapshot.stepKind === "oracle") return "diffusion";
    return "oracle"; // after diffusion → next oracle
  }, [currentSnapshot]);

  // ── Handlers ──

  const handlePresetChange = useCallback(
    (id: string) => {
      const preset = PRESETS.find((p) => p.id === id);
      if (!preset) return;
      setPresetId(id);
      setRules([...preset.rules]);
      setHistory([]);
    },
    [],
  );

  const handleInit = useCallback(() => {
    setHistory([makeInitSnapshot()]);
  }, []);

  const handleNext = useCallback(() => {
    if (!currentSnapshot || !nextStepKind) return;

    let newAmps: number[];
    let newIter = currentIter;

    if (nextStepKind === "oracle") {
      newAmps = applyOracle(currentSnapshot.amplitudes, validStates);
    } else {
      newAmps = applyDiffusion(currentSnapshot.amplitudes);
      newIter = currentIter + 1;
    }

    setHistory((prev) => [
      ...prev,
      {
        amplitudes: newAmps,
        stepKind: nextStepKind,
        iterationCount: newIter,
      },
    ]);
  }, [currentSnapshot, nextStepKind, currentIter, validStates]);

  const handleBack = useCallback(() => {
    if (history.length <= 1) return;
    setHistory((prev) => prev.slice(0, -1));
  }, [history.length]);

  const handleReset = useCallback(() => {
    setHistory([]);
  }, []);

  const handleToggleSwitch = useCallback((index: number) => {
    setSwitches((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }, []);

  const handleAddRule = useCallback(() => {
    setRules((prev) => [...prev, { type: newRuleType, x: newRuleX, y: newRuleY }]);
    setHistory([]); // reset simulation when rules change
  }, [newRuleType, newRuleX, newRuleY]);

  const handleDeleteRule = useCallback((index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
    setHistory([]); // reset simulation when rules change
  }, []);

  // Step label for display
  const stepLabel = useMemo(() => {
    if (!currentSnapshot) return "未初期化";
    const kind = currentSnapshot.stepKind;
    if (kind === "init") return "初期化完了";
    if (kind === "oracle") return `Oracle / 反復${currentIter}`;
    return `Diffusion / 反復${currentIter}`;
  }, [currentSnapshot, currentIter]);

  const stepCount = history.length;
  const maxProb = currentSnapshot ? maxProbability(currentSnapshot.amplitudes) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {/* ── Left: Visualization area ── */}
        <div className={styles.vizArea}>
          {/* Bar chart */}
          <AmplitudeChart
            amplitudes={
              currentSnapshot
                ? currentSnapshot.amplitudes
                : new Array(N).fill(0)
            }
            validStates={validStates}
            switchIndex={switchIndex}
          />

          {/* Step note */}
          {currentStepKind && (
            <div className={styles.stepNote}>
              <h4 className={styles.stepNoteTitle}>
                {STEP_NOTES[currentStepKind].title}
              </h4>
              <p className={styles.stepNoteBody}>
                {STEP_NOTES[currentStepKind].description}
              </p>
            </div>
          )}

          {/* Grover controls */}
          <div className={styles.groverControls}>
            <button
              className={styles.groverBtn}
              disabled={history.length <= 1}
              onClick={handleBack}
            >
              ← 戻る
            </button>

            <span className={styles.stepIndicator}>
              {currentSnapshot
                ? `Step ${stepCount}${currentIter > 0 ? ` / 反復${currentIter}` : ""}`
                : "—"}
            </span>

            <button
              className={`${styles.groverBtn}`}
              disabled={!currentSnapshot}
              onClick={handleNext}
            >
              次へ →
            </button>

            <button
              className={`${styles.groverBtn} ${styles.primary}`}
              onClick={handleInit}
            >
              初期化
            </button>

            <button
              className={styles.groverBtn}
              disabled={history.length === 0}
              onClick={handleReset}
            >
              リセット
            </button>
          </div>
        </div>

        {/* ── Right: Controls panel ── */}
        <div className={styles.controls}>
          {/* Preset selector */}
          <div>
            <div className={styles.sectionTitle}>プリセット</div>
            <select
              className={styles.presetSelect}
              value={presetId}
              onChange={(e) => handlePresetChange(e.target.value)}
            >
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
              <option value="custom">カスタム</option>
            </select>
          </div>

          {/* Rule list */}
          <div>
            <div className={styles.sectionTitle}>ルール一覧</div>
            <div className={styles.ruleList}>
              {rules.map((rule, i) => {
                const pass = switchRuleResults[i];
                return (
                  <div className={styles.ruleRow} key={i}>
                    <span
                      className={pass ? styles.rulePass : styles.ruleFail}
                    >
                      {pass ? "✓" : "✗"}
                    </span>
                    <span className={styles.ruleText}>
                      {ruleToString(rule)}
                    </span>
                    <button
                      className={styles.ruleDeleteBtn}
                      onClick={() => handleDeleteRule(i)}
                      title="ルール削除"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add rule */}
            <div className={styles.addRuleRow}>
              <select
                className={styles.addRuleSelect}
                value={newRuleX}
                onChange={(e) => setNewRuleX(e.target.value as SwitchLabel)}
              >
                {LABELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <select
                className={styles.addRuleSelect}
                value={newRuleType}
                onChange={(e) => setNewRuleType(e.target.value as RuleType)}
              >
                {RULE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {RULE_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
              <select
                className={styles.addRuleSelect}
                value={newRuleY}
                onChange={(e) => setNewRuleY(e.target.value as SwitchLabel)}
              >
                {LABELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <button className={styles.addRuleBtn} onClick={handleAddRule}>
                +
              </button>
            </div>
          </div>

          {/* Switches */}
          <div>
            <div className={styles.sectionTitle}>スイッチ</div>
            <div className={styles.switchGrid}>
              {LABELS.map((label, i) => (
                <button
                  key={label}
                  className={`${styles.switchBtn} ${switches[i] ? styles.on : ""}`}
                  onClick={() => handleToggleSwitch(i)}
                >
                  <span className={styles.switchLabel}>{label}</span>
                  {switches[i] ? "1" : "0"}
                </button>
              ))}
            </div>
            <div className={styles.switchState}>
              状態: {indexToLabel(switchIndex)}
            </div>
            <div
              className={`${styles.constraintResult} ${allSatisfied ? styles.pass : styles.fail}`}
            >
              {allSatisfied
                ? solutionCount > 0
                  ? "✓ 制約を満たす (脱出可能！)"
                  : "✓ (制約なし)"
                : "✗ 制約違反"}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className={styles.sectionTitle}>情報</div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>正解数</span>
                <span className={styles.infoValue}>{solutionCount}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>最適反復</span>
                <span className={styles.infoValue}>{optIter}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>最大確率</span>
                <span className={styles.infoValue}>
                  {(maxProb * 100).toFixed(1)}%
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>ステップ</span>
                <span className={styles.infoValue}>{stepLabel}</span>
              </div>
            </div>
          </div>

          {/* Answers reveal */}
          <div>
            <button
              className={`${styles.revealBtn} ${showAnswers ? styles.revealed : ""}`}
              onClick={() => setShowAnswers((v) => !v)}
            >
              {showAnswers ? "答えを隠す" : "答えを表示"}
            </button>
            {showAnswers && (
              <div className={styles.answerList}>
                {solutionCount === 0 ? (
                  <span className={styles.noAnswer}>解なし</span>
                ) : (
                  Array.from(validStates)
                    .sort((a, b) => a - b)
                    .map((idx) => {
                      const bits = indexToBits(idx);
                      return (
                        <button
                          key={idx}
                          className={`${styles.answerChip} ${idx === switchIndex ? styles.answerActive : ""}`}
                          onClick={() => setSwitches(bits)}
                          title="クリックでスイッチに反映"
                        >
                          {indexToLabel(idx)}
                          <span className={styles.answerBits}>
                            ({bits.map((b, i) => (
                              <span key={i}>
                                {i > 0 && " "}
                                {LABELS[i]}=
                                <span className={b ? styles.bitOn : undefined}>
                                  {b ? "1" : "0"}
                                </span>
                              </span>
                            ))})
                          </span>
                        </button>
                      );
                    })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

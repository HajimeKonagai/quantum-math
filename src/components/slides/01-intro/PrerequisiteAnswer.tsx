import { Math } from "../../primitives/Math";
import styles from "./PrerequisiteCheck.module.scss";

const ANS = "#fc6255";

const ITEMS = [
  { label: "2進数", tex: String.raw`0011 \rightarrow \color{${ANS}}{3}\,,\quad 1101 \rightarrow \color{${ANS}}{13}` },
  { label: "四則演算・分配法則", tex: String.raw`(1 + 2) \times 3 = \color{${ANS}}{9}` },
  { label: "変数・定数・分数", tex: String.raw`4y = x,\; x = 2 \;\Rightarrow\; y = \color{${ANS}}{\tfrac{1}{2}}` },
  { label: "絶対値", tex: String.raw`|-3| = \color{${ANS}}{3}` },
  { label: "2乗とルート", tex: String.raw`(\sqrt{2})^2 = \color{${ANS}}{2}` },
  { label: "ピタゴラスの定理", tex: String.raw`3^2 + 4^2 = c^2 \;\Rightarrow\; c = \color{${ANS}}{5}` },
];

/**
 * PrerequisiteAnswer — 1 step
 * 前提知識の確認 — 答え表示（アニメーションなし）
 */
export function PrerequisiteAnswer() {
  return (
    <div className={styles.slide}>
      <div className={styles.title}>
        必要知識の確認
      </div>

      <div className={styles.content}>
        {ITEMS.map((item, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.formula}>
              <Math tex={item.tex} />
            </span>
          </div>
        ))}
        <div className={styles.note}>
          (サイン・コサイン、log、微分積分は不要です)
        </div>
      </div>
    </div>
  );
}

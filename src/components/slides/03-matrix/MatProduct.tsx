import { AnimatePresence, motion } from "motion/react";
import { useStep } from "../../../hooks/useStep";
import { Math as KMath } from "../../primitives/Math";
import styles from "./MatCommon.module.scss";

/**
 * MatProduct — 3 steps
 *
 * step 0: 足し算・スカラー倍（ベクトルと同じ）
 * step 1: 行列積の計算ルール
 * step 2: 行列 × ベクトル = 別のベクトル
 */
export function MatProduct() {
  const step = useStep();

  return (
    <div className={styles.slide}>
      <motion.div className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        行列の演算
      </motion.div>

      <div className={styles.center}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className={styles.point}>足し算・スカラー倍はベクトルと同じです</div>
              <div className={styles.equation} style={{ marginBottom: "1rem" }}>
                <KMath
                  tex={String.raw`\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} + \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix} = \begin{pmatrix} 6 & 8 \\ 10 & 12 \end{pmatrix}`}
                  display
                />
              </div>
              <div className={styles.equation}>
                <KMath
                  tex={String.raw`2 \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} = \begin{pmatrix} 2 & 4 \\ 6 & 8 \end{pmatrix}`}
                  display
                />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className={styles.point}>
                重要なのは行列同士の掛け算（行列積）です
              </div>
              <div className={styles.equation}>
                <KMath
                  tex={String.raw`\begin{pmatrix} \textcolor{#58C4DD}{1} & \textcolor{#58C4DD}{2} \\ 3 & 4 \end{pmatrix} \begin{pmatrix} \textcolor{#83C167}{5} & 7 \\ \textcolor{#83C167}{6} & 8 \end{pmatrix} = \begin{pmatrix} \textcolor{#FF862F}{17} & \cdots \\ \cdots & \cdots \end{pmatrix}`}
                  display
                />
              </div>
              <div className={styles.note} style={{ marginTop: "1rem" }}>
                <KMath tex={String.raw`\textcolor{#58C4DD}{1}\times\textcolor{#83C167}{5} + \textcolor{#58C4DD}{2}\times\textcolor{#83C167}{6} = \textcolor{#FF862F}{17}`} />
                {" "}— 左の行 × 右の列 の内積
              </div>
              <div className={styles.note}>
                ルール自体より結果に注目しましょう
              </div>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className={styles.point}>
                行列 × ベクトル = 別のベクトル
              </div>
              <div className={styles.equation}>
                <KMath
                  tex={String.raw`\underset{A}{\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}} \underset{|\psi\rangle}{\begin{pmatrix} 1 \\ 0 \end{pmatrix}} = \underset{|\psi'\rangle}{\begin{pmatrix} 0 \\ 1 \end{pmatrix}}`}
                  display
                />
              </div>
              <div className={styles.highlightBox} style={{ marginTop: "1.5rem" }}>
                行列はベクトル変換機です
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

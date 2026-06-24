import { useState, useMemo } from "react";
import { Math as KMath } from "../primitives/Math";
import styles from "./RSACipher.module.scss";

// ── Math helpers (BigInt) ──

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  base = ((base % mod) + mod) % mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    exp >>= 1n;
    base = (base * base) % mod;
  }
  return result;
}

function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b > 0n) {
    [a, b] = [b, a % b];
  }
  return a;
}

function modInverse(a: bigint, mod: bigint): bigint {
  let [old_r, r] = [a, mod];
  let [old_s, s] = [1n, 0n];
  while (r !== 0n) {
    const q = old_r / r;
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
  }
  return ((old_s % mod) + mod) % mod;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

// ── Types ──

export interface RSACipherParams {
  char?: string;
  p?: number;
  q?: number;
  e?: number;
}

type TabId = "encrypt" | "decrypt";

const ENC_STEPS = 7;
const DEC_STEPS = 6;

// ── Component ──

export function RSACipher({ params }: { params: RSACipherParams }) {
  const [tab, setTab] = useState<TabId>("encrypt");
  const [char, setChar] = useState(params.char ?? "M");
  const [p, setP] = useState(params.p ?? 13);
  const [q, setQ] = useState(params.q ?? 17);
  const [eVal, setEVal] = useState(params.e ?? 7);
  const [encStep, setEncStep] = useState(0);
  const [decStep, setDecStep] = useState(0);
  const [showFactors, setShowFactors] = useState(false);

  // Derived values
  const derived = useMemo(() => {
    const m = char.length > 0 ? char.charCodeAt(0) : 0;
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    const eBig = BigInt(eVal);
    const phiBig = BigInt(phi);
    const nBig = BigInt(n);
    const d = phi > 0 && gcd(eBig, phiBig) === 1n
      ? Number(modInverse(eBig, phiBig))
      : 0;
    const c = n > 0 && m < n
      ? Number(modPow(BigInt(m), eBig, nBig))
      : 0;
    const decrypted = d > 0 && n > 0
      ? Number(modPow(BigInt(c), BigInt(d), nBig))
      : 0;
    const isValid =
      isPrime(p) &&
      isPrime(q) &&
      p !== q &&
      phi > 0 &&
      gcd(eBig, phiBig) === 1n &&
      m > 0 &&
      m < n &&
      gcd(BigInt(m), nBig) === 1n;
    const ed = eVal * d;
    const edQuot = phi > 0 ? Math.floor(ed / phi) : 0;
    return { m, n, phi, d, c, decrypted, isValid, ed, edQuot };
  }, [char, p, q, eVal]);

  const { m, n, phi, d, c, isValid, ed, edQuot } = derived;

  const step = tab === "encrypt" ? encStep : decStep;
  const maxStep = tab === "encrypt" ? ENC_STEPS : DEC_STEPS;
  const setStep = tab === "encrypt" ? setEncStep : setDecStep;

  // ── Encrypt steps ──

  function renderEncryptStep() {
    switch (encStep) {
      case 0:
        return (
          <>
            <h3 className={styles.stepTitle}>Step 1: 平文を数値に変換</h3>
            <div className={styles.stepBody}>
              <p>文字をASCIIコードで数値に変換します。</p>
              <div className={styles.formulaBlock}>
                <KMath
                  tex={String.raw`\text{'${char}'} \;\rightarrow\; \text{ASCII} \;\rightarrow\; \mathbf{${m}}`}
                />
                <KMath tex={String.raw`m = ${m}`} />
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h3 className={styles.stepTitle}>Step 2: 2つの素数を選ぶ</h3>
            <div className={styles.stepBody}>
              <p>RSA では2つの大きな素数を秘密に選びます。</p>
              <div className={styles.formulaBlock}>
                <KMath tex={String.raw`p = ${p}`} />
                <KMath tex={String.raw`q = ${q}`} />
              </div>
              <p>実用では数百桁の巨大素数を使います。</p>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className={styles.stepTitle}>
              Step 3: n と &phi;(n) を計算
            </h3>
            <div className={styles.stepBody}>
              <div className={styles.formulaBlock}>
                <KMath
                  tex={String.raw`n = p \times q = ${p} \times ${q} = ${n}`}
                />
                <KMath
                  tex={String.raw`\varphi(n) = (p{-}1)(q{-}1) = ${p - 1} \times ${q - 1} = ${phi}`}
                />
              </div>
              <p>n は公開鍵の一部、&phi;(n) は秘密鍵の計算に使います。</p>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className={styles.stepTitle}>Step 4: 公開指数 e を選ぶ</h3>
            <div className={styles.stepBody}>
              <p>
                e は &phi;(n) と互いに素な数を選びます。
              </p>
              <div className={styles.formulaBlock}>
                <KMath tex={String.raw`e = ${eVal}`} />
                <KMath
                  tex={String.raw`\gcd(e,\;\varphi(n)) = \gcd(${eVal},\;${phi}) = 1 \;\checkmark`}
                />
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--color-ghost)" }}>
                「互いに素」とは、2つの整数の最大公約数 (gcd) が 1 であること。
                つまり 1 以外に共通の約数を持たない関係です。
                e と &phi;(n) が互いに素でないと、暗号化・復号が正しく機能しません。
              </p>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h3 className={styles.stepTitle}>Step 5: 秘密指数 d を計算</h3>
            <div className={styles.stepBody}>
              <p>e の逆元を &phi;(n) を法として求めます。</p>
              <div className={styles.formulaBlock}>
                <KMath
                  tex={String.raw`d \equiv e^{-1} \pmod{\varphi(n)}`}
                />
                <KMath tex={String.raw`d = ${d}`} />
              </div>
              <div className={styles.formulaBlock}>
                <KMath
                  tex={String.raw`e \times d = ${eVal} \times ${d} = ${ed} = ${edQuot} \times ${phi} + 1 \;\checkmark`}
                />
              </div>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h3 className={styles.stepTitle}>Step 6: 鍵ペアの完成</h3>
            <div className={styles.stepBody}>
              <div className={styles.formulaBlock}>
                <span className={`${styles.keyBadge} ${styles.public}`}>
                  公開鍵
                </span>
                <KMath tex={String.raw`(e,\;n) = (${eVal},\;${n})`} />
                <p style={{ margin: 0, fontSize: "0.82rem" }}>
                  誰でも知ることができる
                </p>
              </div>
              <div className={styles.formulaBlock}>
                <span className={`${styles.keyBadge} ${styles.secret}`}>
                  秘密鍵
                </span>
                <KMath tex={String.raw`(d,\;n) = (${d},\;${n})`} />
                <p style={{ margin: 0, fontSize: "0.82rem" }}>
                  所有者だけが知る
                </p>
              </div>
            </div>
          </>
        );
      case 6:
        return (
          <>
            <h3 className={styles.stepTitle}>Step 7: 暗号化の実行</h3>
            <div className={styles.stepBody}>
              <div className={styles.formulaBlock}>
                <KMath
                  tex={String.raw`c = m^{e} \bmod n = ${m}^{${eVal}} \bmod ${n}`}
                />
                <KMath tex={String.raw`c = \mathbf{${c}}`} />
              </div>
              <p className={styles.success}>暗号文 c = {c} が完成しました。</p>
            </div>
          </>
        );
    }
  }

  // ── Decrypt steps ──

  function renderDecryptStep() {
    switch (decStep) {
      case 0:
        return (
          <>
            <h3 className={styles.stepTitle}>Step 1: 暗号文と公開情報</h3>
            <div className={styles.stepBody}>
              <div className={styles.formulaBlock}>
                <KMath tex={String.raw`c = ${c}`} />
              </div>
              <div className={styles.formulaBlock}>
                <span className={`${styles.keyBadge} ${styles.public}`}>
                  公開鍵
                </span>
                <KMath tex={String.raw`(e,\;n) = (${eVal},\;${n})`} />
              </div>
              <p>秘密鍵 d は分からない状態です。</p>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h3 className={styles.stepTitle}>Step 2: なぜ復号が難しいか</h3>
            <div className={styles.stepBody}>
              <p>d を求めるには n の素因数分解が必要です。</p>
              <div className={styles.formulaBlock}>
                {showFactors ? (
                  <KMath
                    tex={String.raw`n = ${n} = ${p} \times ${q}`}
                  />
                ) : (
                  <KMath tex={String.raw`n = ${n} = \;?\; \times \;?`} />
                )}
              </div>
              <button
                className={`${styles.revealBtn} ${showFactors ? styles.revealed : ""}`}
                onClick={() => setShowFactors((v) => !v)}
              >
                {showFactors ? "素因数を隠す" : "素因数を表示"}
              </button>
              <div className={styles.hint}>
                量子コンピュータはショアのアルゴリズムで
                この素因数分解を高速に解けます。
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className={styles.stepTitle}>Step 3: &phi;(n) の計算</h3>
            <div className={styles.stepBody}>
              <p>素因数が分かれば &phi;(n) を計算できます。</p>
              <div className={styles.formulaBlock}>
                <KMath
                  tex={String.raw`\varphi(n) = (p{-}1)(q{-}1) = ${p - 1} \times ${q - 1} = ${phi}`}
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className={styles.stepTitle}>Step 4: 秘密指数 d の導出</h3>
            <div className={styles.stepBody}>
              <div className={styles.formulaBlock}>
                <KMath
                  tex={String.raw`d \equiv e^{-1} \pmod{\varphi(n)}`}
                />
                <KMath tex={String.raw`d = ${d}`} />
              </div>
              <p className={styles.success}>
                公開鍵だけから秘密鍵を復元できました！
              </p>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h3 className={styles.stepTitle}>Step 5: 復号の実行</h3>
            <div className={styles.stepBody}>
              <div className={styles.formulaBlock}>
                <KMath
                  tex={String.raw`m = c^{d} \bmod n = ${c}^{${d}} \bmod ${n}`}
                />
                <KMath tex={String.raw`m = \mathbf{${derived.decrypted}}`} />
              </div>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h3 className={styles.stepTitle}>Step 6: 数値を文字に変換</h3>
            <div className={styles.stepBody}>
              <div className={styles.formulaBlock}>
                <KMath
                  tex={String.raw`${derived.decrypted} \;\rightarrow\; \text{ASCII} \;\rightarrow\; \textbf{'${String.fromCharCode(derived.decrypted)}'}`}
                />
              </div>
              <p className={styles.success}>
                復号成功！ 元の平文 '{String.fromCharCode(derived.decrypted)}' が取り出せました。
              </p>
            </div>
          </>
        );
    }
  }

  // ── Validation ──

  const errors: string[] = [];
  if (!isPrime(p)) errors.push("p は素数ではありません");
  if (!isPrime(q)) errors.push("q は素数ではありません");
  if (p === q) errors.push("p と q は異なる素数を選んでください");
  if (phi > 0 && gcd(BigInt(eVal), BigInt(phi)) !== 1n)
    errors.push("gcd(e, φ(n)) ≠ 1");
  if (m <= 0) errors.push("文字を入力してください");
  if (m >= n) errors.push(`m(${m}) ≥ n(${n}): より大きい素数を使ってください`);
  if (m > 0 && n > 0 && gcd(BigInt(m), BigInt(n)) !== 1n)
    errors.push(`gcd(m, n) ≠ 1`);

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {(["encrypt", "decrypt"] as TabId[]).map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.active : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "encrypt" ? "暗号化" : "復号"}
          </button>
        ))}
      </div>

      <div className={styles.main}>
        {/* Step content (left) */}
        <div className={styles.stepContent}>
          {!isValid ? (
            <>
              <h3 className={styles.stepTitle}>パラメータエラー</h3>
              <div className={styles.stepBody}>
                {errors.map((e, i) => (
                  <p key={i} className={styles.errorText}>{e}</p>
                ))}
              </div>
            </>
          ) : tab === "encrypt" ? (
            renderEncryptStep()
          ) : (
            renderDecryptStep()
          )}

          {/* Navigation */}
          <div className={styles.stepNav}>
            <button
              className={styles.navBtn}
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
            >
              &larr; 前へ
            </button>
            <span className={styles.stepIndicator}>
              {step + 1}/{maxStep}
            </span>
            <button
              className={styles.navBtn}
              disabled={step >= maxStep - 1}
              onClick={() => setStep(step + 1)}
            >
              次へ &rarr;
            </button>
          </div>
        </div>

        {/* Controls panel (right) */}
        <div className={styles.controls}>
          <div className={styles.sectionTitle}>パラメータ</div>

          <div className={styles.paramRow}>
            <span className={styles.paramLabel}>文字</span>
            <input
              className={`${styles.paramInput} ${styles.charInput}`}
              type="text"
              maxLength={1}
              value={char}
              onChange={(e) => {
                const v = e.target.value;
                if (v.length <= 1) setChar(v);
              }}
            />
          </div>

          <div className={styles.paramRow}>
            <span className={styles.paramLabel}>p</span>
            <input
              className={styles.paramInput}
              type="number"
              min={2}
              value={p}
              onChange={(e) => setP(parseInt(e.target.value) || 2)}
            />
          </div>

          <div className={styles.paramRow}>
            <span className={styles.paramLabel}>q</span>
            <input
              className={styles.paramInput}
              type="number"
              min={2}
              value={q}
              onChange={(e) => setQ(parseInt(e.target.value) || 2)}
            />
          </div>

          <div className={styles.paramRow}>
            <span className={styles.paramLabel}>e</span>
            <input
              className={styles.paramInput}
              type="number"
              min={2}
              value={eVal}
              onChange={(e) => setEVal(parseInt(e.target.value) || 2)}
            />
          </div>

          {isValid && (
            <>
              <div className={styles.sectionTitle}>計算値</div>

              <div className={styles.derivedRow}>
                <span className={styles.derivedLabel}>n</span>
                <span>=</span>
                <span className={styles.derivedValue}>{n}</span>
              </div>

              <div className={styles.derivedRow}>
                <span className={styles.derivedLabel}>&phi;</span>
                <span>=</span>
                <span className={styles.derivedValue}>{phi}</span>
              </div>

              <div className={styles.derivedRow}>
                <span className={styles.derivedLabel}>d</span>
                <span>=</span>
                <span className={styles.derivedValue}>{d}</span>
              </div>

              <div className={styles.derivedRow}>
                <span className={styles.derivedLabel}>c</span>
                <span>=</span>
                <span className={styles.derivedValue}>{c}</span>
              </div>
            </>
          )}

          {tab === "decrypt" && (
            <>
              <div className={styles.sectionTitle}>素因数分解</div>
              <button
                className={`${styles.revealBtn} ${showFactors ? styles.revealed : ""}`}
                onClick={() => setShowFactors((v) => !v)}
              >
                {showFactors ? "素因数を隠す" : "素因数を表示"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

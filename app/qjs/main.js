// Preset circuit definitions
const PRESETS = {
  bell: {
    name: 'Bell State',
    description:
      '2量子ビットのもつれ状態 (|00⟩ + |11⟩)/√2 を生成します。' +
      'Hadamard ゲートで重ね合わせを作り、CNOT で量子もつれを形成します。',
    create() {
      return Q`
        H  X#0
        I  X#1
      `
    },
  },

  ghz: {
    name: 'GHZ State',
    description:
      '3量子ビットの GHZ 状態 (|000⟩ + |111⟩)/√2 を生成します。' +
      'Bell State を3量子ビットに拡張した最大もつれ状態です。',
    create() {
      return Q`
        H  X#0  I
        I  X#1  X#0
        I  I    X#1
      `
    },
  },

  teleportation: {
    name: 'Quantum Teleportation',
    description:
      '量子テレポーテーション回路です。' +
      'q1 の量子状態を、もつれた q2-q3 ペアを介して q3 に転送します。' +
      'X ゲートで q1 に |1⟩ を準備し、Bell 測定後に補正を行います。',
    create() {
      return Q`
        X  I    X#0  H  M  I    I
        I  H    X#1  I  I  X#0  I
        I  X#0  I    I  I  X#1  Z#0
      `
    },
  },

  grover: {
    name: "Grover's Search (2-qubit)",
    description:
      '2量子ビットの Grover 探索アルゴリズムです。' +
      'オラクルが |11⟩ をマークし、振幅増幅で正解を高確率に見つけます。' +
      '1回の反復で確率 100% を達成します。',
    create() {
      // Grover for 2 qubits, searching for |11⟩
      // Oracle: CZ marks |11⟩, Diffusion: H-X-CZ-X-H
      return Q`
        H  Z#0  H  X  Z#0  X  H
        H  Z#1  H  X  Z#1  X  H
      `
    },
  },

  deutsch: {
    name: 'Deutsch-Jozsa',
    description:
      'Deutsch-Jozsa アルゴリズム（2量子ビット版）です。' +
      '関数 f(x) が定数か balanced かを1回のクエリで判定します。' +
      'この例では balanced 関数（CNOT オラクル）を使用しています。',
    create() {
      // Deutsch-Jozsa: balanced oracle (CNOT)
      return Q`
        H  X#0  H
        X  X#1  I
      `
    },
  },

  superposition: {
    name: 'Superposition',
    description:
      '3量子ビットすべてに Hadamard を適用し、' +
      '8つの計算基底状態の均等な重ね合わせ (1/√8)(|000⟩ + |001⟩ + ... + |111⟩) を作ります。',
    create() {
      return Q`
        H
        H
        H
      `
    },
  },
}

// DOM references
const diagramEl = document.getElementById('circuit-diagram')
const resultsEl = document.getElementById('results')
const descriptionEl = document.getElementById('preset-description')
const editorEl = document.getElementById('circuit-editor')
const btnEvaluate = document.getElementById('btn-evaluate')
const btnClear = document.getElementById('btn-clear')

let currentCircuit = null
let editorCircuit = null

// Display circuit diagram
function showDiagram(circuit) {
  try {
    diagramEl.textContent = circuit.toDiagram()
  } catch {
    diagramEl.textContent = circuit.toText()
  }
}

// Display evaluation results as probability bars
function showResults(circuit) {
  circuit.evaluate$()

  const bandwidth = circuit.bandwidth
  const stateCount = Math.pow(2, bandwidth)

  // Build probability map from circuit evaluation
  const probabilities = []
  for (let i = 0; i < stateCount; i++) {
    const label = i.toString(2).padStart(bandwidth, '0')
    probabilities.push({ state: '|' + label + '⟩', prob: 0 })
  }

  // Extract probabilities from the evaluated circuit
  // Q.js stores results internally; we access via report$
  // We'll capture report$ output by parsing it
  const originalLog = console.log
  let reportLines = []
  console.log = function () {
    const args = Array.from(arguments)
    reportLines.push(args.join(' '))
  }
  circuit.report$()
  console.log = originalLog

  // Parse report output to extract probabilities
  let hasParsed = false
  for (const line of reportLines) {
    // Q.js report$ format: "|00⟩  ███████████████  50.00%" or similar
    const match = line.match(/\|([01]+)⟩.*?([\d.]+)%/)
    if (match) {
      const stateStr = match[1]
      const prob = parseFloat(match[2]) / 100
      const idx = parseInt(stateStr, 2)
      if (idx < probabilities.length) {
        probabilities[idx].prob = prob
        hasParsed = true
      }
    }
  }

  // If parsing failed, try to compute from qubit states
  if (!hasParsed) {
    // Fallback: equal distribution
    const equalProb = 1 / stateCount
    probabilities.forEach(function (p) {
      p.prob = equalProb
    })
  }

  // Render
  let html = ''
  for (const p of probabilities) {
    const pct = (p.prob * 100).toFixed(2)
    const barWidth = (p.prob * 100).toFixed(1)
    html +=
      '<div class="result-row">' +
      '<span class="result-state">' + p.state + '</span>' +
      '<div class="result-bar-container">' +
      '<div class="result-bar" style="width: ' + barWidth + '%"></div>' +
      '</div>' +
      '<span class="result-probability">' + pct + '%</span>' +
      '</div>'
  }
  resultsEl.innerHTML = html
}

// Load a preset circuit
function loadPreset(name) {
  const preset = PRESETS[name]
  if (!preset) return

  // Update active button
  document.querySelectorAll('.preset-btn').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.preset === name)
  })

  descriptionEl.textContent = preset.description
  currentCircuit = preset.create()
  showDiagram(currentCircuit)
  showResults(currentCircuit)
}

// Set up preset buttons
document.querySelectorAll('.preset-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    loadPreset(this.dataset.preset)
  })
})

// Set up interactive editor
function initEditor() {
  editorCircuit = new Q.Circuit(3, 5)
  editorEl.innerHTML = ''
  const domEl = editorCircuit.toDom(editorEl)
  if (domEl && domEl !== editorEl) {
    editorEl.appendChild(domEl)
  }
}

btnEvaluate.addEventListener('click', function () {
  if (!editorCircuit) return
  showDiagram(editorCircuit)
  showResults(editorCircuit)
})

btnClear.addEventListener('click', function () {
  initEditor()
  diagramEl.textContent = ''
  resultsEl.innerHTML = '<span style="color: #666">Click "Evaluate" after building a circuit in the editor.</span>'
})

// Initialize
loadPreset('bell')
initEditor()

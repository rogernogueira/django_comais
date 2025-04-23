let dataPoints = [];
let selectedClass = 0;
let maxDepth = 3;
let lastTree = null;

const plotDiv = document.getElementById('plot');
const treeContainer = document.getElementById('tree-container');
const btns = [
  document.getElementById('btn-class-0'),
  document.getElementById('btn-class-1')
];
const inputDepth = document.getElementById('input-depth');
const labelDepth = document.getElementById('label-depth');
const btnLinear = document.getElementById('btn-linear');
const btnCircle = document.getElementById('btn-circle');
const btnNoise = document.getElementById('btn-noise');
const btnClear = document.getElementById('btn-clear');
const btnUndo = document.getElementById('btn-undo');
const btnTrain = document.getElementById('btn-train');
const progressBar = document.getElementById('progress-training');
const btnShowModal = document.getElementById('btn-show-modal');
const modal = document.getElementById('modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const metricAcc = document.getElementById('metric-acc');
const metricPrec = document.getElementById('metric-prec');
const metricRecall = document.getElementById('metric-recall');
const metricF1 = document.getElementById('metric-f1');
const nodeCountSpan = document.getElementById('node-count');

// Inicializa o gráfico Plotly
function initPlot() {
  Plotly.newPlot(plotDiv, [], {
    xaxis: { range: [0, 10] },
    yaxis: { range: [0, 10] },
    hovermode: 'closest'
  }, { responsive: true });
}

// Atualiza o estilo dos botões de classe
function updateClassButtons() {
  btns.forEach((btn, i) => {
    btn.classList.toggle('ring-2', selectedClass === i);
    btn.classList.toggle(i === 0 ? 'ring-blue-500' : 'ring-red-500', selectedClass === i);
  });
}

// Reseta os valores das métricas
function resetMetrics() {
  metricAcc.textContent = '0%';
  metricPrec.textContent = '0%';
  metricRecall.textContent = '0%';
  metricF1.textContent = '0%';
}

// Atualiza o plot com pontos e fronteira
function updatePlot(dec) {
  const c0 = dataPoints.filter(p => p.label === 0);
  const c1 = dataPoints.filter(p => p.label === 1);
  const traces = [
    { x: c0.map(p => p.x), y: c0.map(p => p.y), mode: 'markers', marker: { color: 'blue', size: 8 }, name: 'Classe 0' },
    { x: c1.map(p => p.x), y: c1.map(p => p.y), mode: 'markers', marker: { color: 'red', size: 8 }, name: 'Classe 1' }
  ];
  if (dec) {
    traces.unshift(dec.contour);
    if (dec.lines) traces.push(...dec.lines);
  }
  Plotly.react(plotDiv, traces, { xaxis: { range: [0, 10] }, yaxis: { range: [0, 10] } });
}

// Carrega presets de dados
function loadPreset(type) {
  dataPoints = [];
  treeContainer.innerHTML = '';
  resetMetrics();
  nodeCountSpan.textContent = '0';
  if (type === 'linear') {
    for (let i = 0; i < 50; i++) {
      dataPoints.push({ x: Math.random() * 4 + 1, y: Math.random() * 4 + 1, label: 0 });
      dataPoints.push({ x: Math.random() * 4 + 6, y: Math.random() * 4 + 6, label: 1 });
    }
  } else if (type === 'circle') {
    for (let i = 0; i < 100; i++) {
      const r = Math.random() * 5;
      const th = Math.random() * 2 * Math.PI;
      dataPoints.push({ x: r * Math.cos(th) + 5, y: r * Math.sin(th) + 5, label: r < 3 ? 0 : 1 });
    }
  } else {
    for (let i = 0; i < 200; i++) {
      dataPoints.push({ x: Math.random() * 10, y: Math.random() * 10, label: Math.random() < 0.5 ? 0 : 1 });
    }
  }
  updatePlot();
}

// Renderiza a árvore no painel inferior
function renderTree(node, container) {
  const ul = document.createElement('ul');
  // Adiciona indentação e espaçamento vertical entre nós
  ul.classList.add('pl-4', 'border-l', 'border-gray-300', 'space-y-1', 'mt-1');
  const li = document.createElement('li');
  if (node.leaf) {
    li.textContent = `Leaf: Classe = ${node.label}`;
  } else {
    li.textContent = `Node: ${node.feature} ≤ ${node.thr.toFixed(2)}`;
    renderTree(node.left, li);
    renderTree(node.right, li);
  }
  ul.appendChild(li);
  container.appendChild(ul);
}

// Botão de Treinar: constrói a árvore, calcula métricas e desenha fronteira
btnTrain.onclick = () => {
  if (dataPoints.filter(p => p.label === 0).length < 2 || dataPoints.filter(p => p.label === 1).length < 2) {
    alert('Adicione ao menos 2 pontos de cada classe.');
    return;
  }
  const tree = buildTree(dataPoints, 0, maxDepth);
  lastTree = tree;
  const count = countNodes(tree);
  nodeCountSpan.textContent = count;
  treeContainer.innerHTML = '';
  renderTree(tree, treeContainer);
  const preds = dataPoints.map(p => predict(tree, p));
  const trues = dataPoints.map(p => p.label);
  const { acc, prec, rec, f1 } = computeMetrics(preds, trues);
  metricAcc.textContent = `${acc.toFixed(2)}%`;
  metricPrec.textContent = `${prec.toFixed(2)}%`;
  metricRecall.textContent = `${rec.toFixed(2)}%`;
  metricF1.textContent = `${f1.toFixed(2)}%`;
  drawBoundary(tree);
};

// Funções de Árvore de Decisão CART
function buildTree(data, depth, maxD) {
  const labels = data.map(d => d.label);
  const uniq = [...new Set(labels)];
  if (uniq.length === 1 || depth >= maxD) {
    const majority = labels.filter(l => l === 1).length >= labels.length / 2 ? 1 : 0;
    return { leaf: true, label: majority };
  }
  let best = { gain: -Infinity };
  const imp = impurity(labels);
  ['x', 'y'].forEach(f => {
    const vals = [...new Set(data.map(d => d[f]))].sort((a, b) => a - b);
    for (let i = 1; i < vals.length; i++) {
      const thr = (vals[i - 1] + vals[i]) / 2;
      const left = data.filter(d => d[f] <= thr).map(d => d.label);
      const right = data.filter(d => d[f] > thr).map(d => d.label);
      if (!left.length || !right.length) continue;
      const gain = imp - (left.length / data.length) * impurity(left) - (right.length / data.length) * impurity(right);
      if (gain > best.gain) best = { feature: f, thr, gain };
    }
  });
  if (best.gain === -Infinity) {
    const majority = labels.filter(l => l === 1).length >= labels.length / 2 ? 1 : 0;
    return { leaf: true, label: majority };
  }
  const leftData = data.filter(d => d[best.feature] <= best.thr);
  const rightData = data.filter(d => d[best.feature] > best.thr);
  return {
    leaf: false,
    feature: best.feature,
    thr: best.thr,
    left: buildTree(leftData, depth + 1, maxD),
    right: buildTree(rightData, depth + 1, maxD)
  };
}
function impurity(labels) {
  const p = labels.filter(l => l === 1).length / labels.length;
  return 2 * p * (1 - p);
}
function countNodes(node) {
  return node.leaf ? 1 : 1 + countNodes(node.left) + countNodes(node.right);
}
function predict(node, pt) {
  return node.leaf
    ? node.label
    : pt[node.feature] <= node.thr
      ? predict(node.left, pt)
      : predict(node.right, pt);
}
function computeMetrics(preds, trues) {
  let tp = 0, tn = 0, fp = 0, fn = 0;
  preds.forEach((p, i) => {
    const t = trues[i];
    if (p === 1 && t === 1) tp++;
    if (p === 0 && t === 0) tn++;
    if (p === 1 && t === 0) fp++;
    if (p === 0 && t === 1) fn++;
  });
  const acc = ((tp + tn) / (tp + tn + fp + fn)) * 100;
  const prec = tp + fp ? (tp / (tp + fp)) * 100 : 0;
  const rec = tp + fn ? (tp / (tp + fn)) * 100 : 0;
  const f1 = prec + rec ? (2 * (prec * rec)) / (prec + rec) : 0;
  return { acc, prec, rec, f1 };
}
async function drawBoundary(tree) {
  const res = 50;
  const xs = d3.range(res).map(i => (i * 10) / (res - 1));
  const ys = xs.slice();
  const z = [];
  for (let yi = 0; yi < res; yi++) {
    const row = [];
    for (let xi = 0; xi < res; xi++) {
      row.push(predict(tree, { x: xs[xi], y: ys[yi] }));
    }
    z.push(row);
  }
  const surface = {
    x: xs,
    y: ys,
    z: z,
    type: 'contour',
    showscale: false,
    opacity: 0.4,
    colorscale: [[0, 'rgba(0,0,255,0.2)'], [1, 'rgba(255,0,0,0.2)']],
    contours: { showlines: false }
  };
  const lines = [];
  (function collect(node) {
    if (node.leaf) return;
    if (node.feature === 'x') {
      lines.push({ x: [node.thr, node.thr], y: [0, 10], mode: 'lines', line: { color: 'black', width: 2 } });
    } else {
      lines.push({ x: [0, 10], y: [node.thr, node.thr], mode: 'lines', line: { color: 'black', width: 2 } });
    }
    collect(node.left); collect(node.right);
  })(tree);
  updatePlot({ contour: surface, lines });
}

// Renderização D3 para modal
function renderD3Tree(treeData) {
  const svg1 = document.getElementById('d3-tree');
  const svg = d3.select('#d3-tree');
  svg.selectAll('*').remove();
  const largura =svg1.viewBox.baseVal.width;
  const width = svg1.viewBox.baseVal.width;
  const height = svg1.viewBox.baseVal.height;
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const root = d3.hierarchy(treeData, d => d.leaf ? null : [d.left, d.right]);
  console.log('width:', largura, 'height:', height);
  // Espaçamento de nós: fixo horizontal/vertical
  const treeLayout = d3.tree().nodeSize([40, 40]);
  treeLayout(root);
  // Calcula limites X
  const xs = root.descendants().map(d => d.x);
  const xMin = d3.min(xs);
  const xMax = d3.max(xs);
  const treeWidth = xMax - xMin;
  // Centraliza horizontalmente
  const dx = margin.left + (innerWidth - treeWidth) / 2 - xMin;
    // Calcula limites Y
  const ys = root.descendants().map(d => d.y);
  console.log(treeWidth);

  const dy = margin.top;
  console.log('dx:', dx, 'dy:', dy);

  const g = svg.append('g').attr('transform', `translate(${dx},${dy})`);
  // Links verticais
  g.selectAll('path')
    .data(root.links())
    .join('path')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y));
  // Nós
  const node = g.selectAll('g.node')
    .data(root.descendants())
    .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);
  node.append('circle')
    .attr('r', 6)
    .attr('fill', d => d.data.leaf ?
        d.data.label? '#fecaca':'#bedbfe'
         :         
         '#555');
  node.append('text')
    .attr('dy', d => d.children ? -10 : 15)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .text(d => d.data.leaf ? `Leaf:${d.data.label}` : `${d.data.feature}≤${d.data.thr.toFixed(1)}`);
}

// Eventos UI
function getTreeDepth(node) {
  if (node.leaf) return 1;
  return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
}

// Eventos UI
btns[0].onclick = () => { selectedClass = 0; updateClassButtons(); };
btns[1].onclick = () => { selectedClass = 1; updateClassButtons(); };
inputDepth.oninput = () => { maxDepth = parseInt(inputDepth.value); labelDepth.textContent = maxDepth; };
plotDiv.addEventListener('plotly_click', e => {
  const pt = e.detail.points[0];
  if (pt) {
    dataPoints.push({ x: pt.x, y: pt.y, label: selectedClass });
    updatePlot();
  }
});
btnClear.onclick = () => {
  dataPoints = [];
  updatePlot();
  nodeCountSpan.textContent = '0';
  resetMetrics();
  treeContainer.innerHTML = '';
};
btnUndo.onclick = () => { dataPoints.pop(); updatePlot(); };
btnLinear.onclick = () => loadPreset('linear');
btnCircle.onclick = () => loadPreset('circle');
btnNoise.onclick = () => loadPreset('noise');
btnShowModal.onclick = () => {
  if (lastTree) renderD3Tree(lastTree);
  modal.classList.remove('hidden');
};
btnCloseModal.onclick = () => modal.classList.add('hidden');

// Inicialização
initPlot();
updateClassButtons();

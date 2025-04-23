const plotDiv = document.getElementById('plot');
let dataPoints = [];
let selectedClass = 0;
let k = 3;
const inputK = document.getElementById('input-k');
const labelK = document.getElementById('label-k');
const metrics = {
  acc: document.getElementById('metric-acc'),
  prec: document.getElementById('metric-prec'),
  rec: document.getElementById('metric-recall'),
  f1: document.getElementById('metric-f1')
};

// Inicia plot vazio
function initPlot() {
  Plotly.newPlot(plotDiv, [], { xaxis:{range:[0,10]}, yaxis:{range:[0,10]}, hovermode:'closest' }, {responsive:true});
}

// Atualiza display do K
inputK.oninput = () => { k = +inputK.value; labelK.textContent = k; };

// Adiciona pontos via clique
plotDiv.addEventListener('plotly_click', event => {
  const pt = event.detail.points[0];
  dataPoints.push({ x: pt.x, y: pt.y, label: selectedClass });
  updatePlot();
});

// Botões de classe
document.getElementById('btn-class-0').onclick = () => { selectedClass = 0; };
document.getElementById('btn-class-1').onclick = () => { selectedClass = 1; };

// Presets
document.getElementById('btn-linear').onclick = () => preset('linear');
document.getElementById('btn-circle').onclick = () => preset('circle');
document.getElementById('btn-noise').onclick = () => preset('noise');
function preset(type) {
  dataPoints = [];
  metricsReset();
  if (type === 'linear') {
    for (let i = 0; i < 50; i++) {
      dataPoints.push({ x: Math.random()*4+1, y: Math.random()*4+1, label: 0 });
      dataPoints.push({ x: Math.random()*4+6, y: Math.random()*4+6, label: 1 });
    }
  } else if (type === 'circle') {
    for (let i = 0; i < 200; i++) {
      const r = Math.random()*5;
      const th = Math.random()*2*Math.PI;
      dataPoints.push({ x: r*Math.cos(th)+5, y: r*Math.sin(th)+5, label: r<3?0:1 });
    }
  } else {
    for (let i = 0; i < 200; i++) {
      dataPoints.push({ x: Math.random()*10, y: Math.random()*10, label: Math.random()<0.5?0:1 });
    }
  }
  updatePlot();
}

// Clear & Undo
document.getElementById('btn-clear').onclick = () => { dataPoints = []; metricsReset(); updatePlot(); };
document.getElementById('btn-undo').onclick = () => { dataPoints.pop(); updatePlot(); };

// Classifica e calcula métricas
document.getElementById('btn-train').onclick = async () => {
  if (dataPoints.length === 0) return;
  const res = 60;
  const xs = Array.from({length:res},(_,i)=>i*10/(res-1));
  const ys = xs.slice();
  const grid = [];
  for (let yi = 0; yi < res; yi++) for (let xi = 0; xi < res; xi++) grid.push([xs[xi], ys[yi]]);
  const labelsGrid = grid.map(pt => classifyKNN(pt));
  const z = [];
  for (let i = 0; i < res; i++) z.push(labelsGrid.slice(i*res, (i+1)*res));
  const contour = { x: xs, y: ys, z: z, type:'contour', showscale:false, opacity:0.4,
    colorscale:[[0,'rgba(0,0,255,0.2)'],[1,'rgba(255,0,0,0.2)']], contours:{showlines:false} };
  updatePlot({ contour });
  const trueLabels = dataPoints.map(p => p.label);
  const predLabels = dataPoints.map(p => classifyKNN([p.x, p.y]));
  const { acc, prec, rec, f1 } = computeMetrics(predLabels, trueLabels);
  metrics.acc.textContent = `${acc.toFixed(2)}%`;
  metrics.prec.textContent = `${prec.toFixed(2)}%`;
  metrics.rec.textContent = `${rec.toFixed(2)}%`;
  metrics.f1.textContent = `${f1.toFixed(2)}%`;
};

// KNN Classifier
function classifyKNN([x,y]) {
  const dists = dataPoints.map(p => ({ d: Math.hypot(p.x-x, p.y-y), label: p.label }));
  dists.sort((a,b) => a.d - b.d);
  const kNearest = dists.slice(0, k);
  const sum = kNearest.reduce((s,c) => s + c.label, 0);
  return sum >= k/2 ? 1 : 0;
}

// Métricas
function computeMetrics(preds, trues) {
  let tp=0, tn=0, fp=0, fn=0;
  preds.forEach((p,i) => { const t = trues[i]; if(p===1&&t===1) tp++; if(p===0&&t===0) tn++; if(p===1&&t===0) fp++; if(p===0&&t===1) fn++; });
  const acc = (tp+tn)/(tp+tn+fp+fn)*100;
  const prec = tp+fp ? tp/(tp+fp)*100 : 0;
  const rec = tp+fn ? tp/(tp+fn)*100 : 0;
  const f1 = prec+rec ? 2*(prec*rec)/(prec+rec) : 0;
  return { acc, prec, rec, f1 };
}

// Atualiza plot
function updatePlot(dec) {
  const c0 = dataPoints.filter(p => p.label === 0);
  const c1 = dataPoints.filter(p => p.label === 1);
  const traces = [
    { x: c0.map(p => p.x), y: c0.map(p => p.y), mode:'markers', marker:{color:'blue',size:8}, name:'Classe 0' },
    { x: c1.map(p => p.x), y: c1.map(p => p.y), mode:'markers', marker:{color:'red',size:8}, name:'Classe 1' }
  ];
  if (dec) traces.unshift(dec.contour);
  Plotly.react(plotDiv, traces, { xaxis:{range:[0,10]}, yaxis:{range:[0,10]} });
}

// Reset métricas
function metricsReset() {
  metrics.acc.textContent = '0%';
  metrics.prec.textContent = '0%';
  metrics.rec.textContent = '0%';
  metrics.f1.textContent = '0%';
}

// Inicialização
initPlot();

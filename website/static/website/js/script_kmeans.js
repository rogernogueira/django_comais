const ctx = document.getElementById('chart').getContext('2d');
let dataPoints = [];
let k = 3;
let centroids = [];
let assignments = [];
let step = 0;
const inputK = document.getElementById('input-k');
const labelK = document.getElementById('label-k');
const btnInit = document.getElementById('btn-init');
const btnStep = document.getElementById('btn-step');
const currentStep = document.getElementById('current-step');
const varianceCanvas = document.getElementById('variance-chart');
const varianceSummary = document.getElementById('variance-summary');
let varianceChart = null;
let varianceSeries = [];
let lastVariances = [];
let meanSeries = [];
let lastMean = null;

// Paleta pastel vibrante
const pastelColors = [
  'rgba(11, 104, 27,0.8)',  // rosa pastel
  'rgba(122, 39, 78, 0.8)',  // pêssego
  'rgba(26, 24, 136, 0.8)',  // amarelo claro
  'rgba(221, 235, 100, 0.8)',  // verde menta
  'rgba(128, 78, 12, 0.8)',  // azul claro
  'rgba(95, 35, 49, 0.8)',  // rosa suave
  'rgba(202, 179, 104, 0.8)',  // creme
  'rgba(111, 164, 199, 0.8)',  // azul bebê
  'rgba(210,255,215, 0.8)',  // verde água
  'rgba(255,220,240, 0.8)'   // lavanda
];

//     const pastelColors =[
//     pattern.draw('square', '#ff6384'),
//     pattern.draw('circle', '#36a2eb'),
//     pattern.draw('diamond', '#cc65fe'),
//     pattern.draw('triangle', '#ffce56')
//   ]

if (varianceCanvas) {
  const varianceCtx = varianceCanvas.getContext('2d');
  varianceChart = new Chart(varianceCtx, {
    type: 'line',
    data: { datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: {
          type: 'linear',
          title: { display: true, text: 'Iteração' },
          ticks: { precision: 0 }
        },
        y: {
          title: { display: true, text: 'Variância' },
          beginAtZero: true
        }
      },
      plugins: { legend: { display: true } }
    }
  });
}

function resetVarianceTracking(clusterCount) {
  varianceSeries = Array.from({ length: clusterCount }, () => []);
  meanSeries = [];
  if (varianceChart) {
    const clusterDatasets = varianceSeries.map((_, index) => ({
      label: `Cluster ${index}`,
      data: [],
      borderColor: pastelColors[index % pastelColors.length],
      backgroundColor: pastelColors[index % pastelColors.length],
      fill: false,
      tension: 0.25,
      spanGaps: true,
      pointRadius: 3
    }));
    const meanDataset = {
      label: 'Média',
      data: [],
      borderColor: 'rgba(0, 0, 0, 0.7)',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderDash: [6, 4],
      fill: false,
      tension: 0.1,
      spanGaps: true,
      pointRadius: 0
    };
    varianceChart.data.datasets = [...clusterDatasets, meanDataset];
    varianceChart.update();
  }
  lastVariances = [];
  lastMean = null;
  updateVarianceSummary(0);
}

function computeClusterVariances() {
  if (!centroids.length || !assignments.length) {
    return centroids.map(() => null);
  }
  return centroids.map((centroid, clusterIndex) => {
    let sum = 0;
    let count = 0;
    assignments.forEach((assignedCluster, pointIndex) => {
      if (assignedCluster !== clusterIndex) return;
      const point = dataPoints[pointIndex];
      const dx = point.x - centroid.x;
      const dy = point.y - centroid.y;
      sum += dx * dx + dy * dy;
      count++;
    });
    if (!count) return null;
    return sum / count;
  });
}

function computeVarianceMean(variances) {
  const valid = variances.filter(value => value !== null && value !== undefined);
  if (!valid.length) return null;
  const total = valid.reduce((acc, value) => acc + value, 0);
  return total / valid.length;
}

function recordVariance(iteration, variances) {
  if (!variances.length) return;
  if (!varianceSeries.length) {
    varianceSeries = Array.from({ length: variances.length }, () => []);
    meanSeries = [];
  }
  variances.forEach((value, index) => {
    if (!varianceSeries[index]) varianceSeries[index] = [];
    varianceSeries[index].push({ x: iteration, y: value === null ? null : value });
    if (varianceChart && varianceChart.data.datasets[index]) {
      varianceChart.data.datasets[index].data = varianceSeries[index];
    }
  });
  const meanValue = computeVarianceMean(variances);
  lastVariances = variances;
  lastMean = meanValue;
  meanSeries.push({ x: iteration, y: meanValue === null ? null : meanValue });
  if (varianceChart) {
    const meanDatasetIndex = varianceSeries.length;
    if (varianceChart.data.datasets[meanDatasetIndex]) {
      varianceChart.data.datasets[meanDatasetIndex].data = meanSeries;
    }
    varianceChart.update();
  }
  updateVarianceSummary(iteration);
}

function updateVarianceSummary(iteration = step) {
  if (!varianceSummary) return;
  if (!lastVariances.length || !iteration) {
    varianceSummary.textContent = 'Execute um passo para ver a variância dos clusters.';
    return;
  }
  const details = lastVariances.map((value, index) => `Cluster ${index}: ${value === null ? '—' : value.toFixed(3)}`);
  const meanText = lastMean === null ? 'Média: —' : `Média: ${lastMean.toFixed(3)}`;
  varianceSummary.textContent = `Iteração ${iteration}: ${[...details, meanText].join(' · ')}`;
}

// Instancia Chart.js sem animações
const chart = new Chart(ctx, {
  type: 'scatter',
  data: { datasets: [] },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: { min: 0, max: 10 },
      y: { min: 0, max: 10 }
    },
    plugins: { legend: { display: true } }
  }
});

// Atualiza display do K
inputK.oninput = () => {
  k = +inputK.value;
  labelK.textContent = k;
};

// Obtem coordenadas a partir de clique direto no canvas
ctx.canvas.onclick = evt => {
  const rect = ctx.canvas.getBoundingClientRect();
  const x = chart.scales.x.getValueForPixel(evt.clientX - rect.left);
  const y = chart.scales.y.getValueForPixel(evt.clientY - rect.top);
  dataPoints.push({ x, y });
  updateChart();
};

// Presets de dados
function preset(type) {
  dataPoints = [];
  centroids = [];
  assignments = [];
  step = 0;
  currentStep.textContent = step;
  resetVarianceTracking(k);
  if (!type || type === 'clear') {
    updateChart();
    return;
  }
  if (type === 'linear') {
    for (let i = 0; i < 50; i++) {
      dataPoints.push({ x: Math.random()*4+1, y: Math.random()*4+1 });
      dataPoints.push({ x: Math.random()*4+6, y: Math.random()*4+6 });
    }
  } else if (type === 'circle') {
    for (let i = 0; i < 200; i++) {
      const r = Math.random()*5;
      const th = Math.random()*2*Math.PI;
      dataPoints.push({ x: 5 + r*Math.cos(th), y: 5 + r*Math.sin(th) });
    }
  } else if (type === 'noise') {
    for (let i = 0; i < 200; i++) dataPoints.push({ x: Math.random()*10, y: Math.random()*10 });
  }
  updateChart();
}

document.getElementById('btn-linear').onclick = () => preset('linear');
document.getElementById('btn-circle').onclick = () => preset('circle');
document.getElementById('btn-noise').onclick = () => preset('noise');
document.getElementById('btn-clear').onclick = () => preset();
document.getElementById('btn-undo').onclick = () => { dataPoints.pop(); updateChart(); };

// Inicializa K-Means
btnInit.onclick = () => {
  if (dataPoints.length < k) return alert('Adicione pelo menos K pontos');
  centroids = [];
  for (let i = 0; i < k; i++) centroids.push({ ...dataPoints[Math.floor(Math.random()*dataPoints.length)] });
  assignments = new Array(dataPoints.length).fill(-1);
  step = 0;
  currentStep.textContent = step;
  resetVarianceTracking(k);
  updateChart();
};

// Próximo passo do algoritmo
btnStep.onclick = () => {
  if (!centroids.length) return;
  // Atribuição de clusters
  assignments = dataPoints.map(pt => {
    let minD = Infinity, idx = 0;
    centroids.forEach((c,i) => {
      const d = (pt.x-c.x)**2 + (pt.y-c.y)**2;
      if (d < minD) { minD = d; idx = i; }
    });
    return idx;
  });
  // Recalcula centróides
  const sums = centroids.map(_ => ({ x:0, y:0 }));
  const counts = new Array(k).fill(0);
  dataPoints.forEach((pt,i) => {
    sums[assignments[i]].x += pt.x;
    sums[assignments[i]].y += pt.y;
    counts[assignments[i]]++;
  });
  centroids = centroids.map((c,i) => counts[i] ? ({ x: sums[i].x/counts[i], y: sums[i].y/counts[i] }) : c);
  const variances = computeClusterVariances();
  step++;
  currentStep.textContent = step;
  recordVariance(step, variances);
  updateChart();
};

// Atualiza chart com paleta pastel e sem animações
function updateChart() {
  chart.data.datasets = [];
  if (assignments.length && centroids.length) {
    for (let i = 0; i < k; i++) {
      chart.data.datasets.push({
        label: `Cluster ${i}`,
        data: dataPoints.filter((_,j) => assignments[j] === i),
        backgroundColor: pastelColors[i % pastelColors.length],
        pointRadius: 15, 
        borderColor: 'rgba(0, 0, 0, 0.8)'

      });
    }
  } else {
    chart.data.datasets.push({
      label: 'Pontos',
      data: dataPoints,
      backgroundColor: 'rgba(85, 35, 35, 0.8)',
      pointRadius: 15,
      borderColor: 'rgba(0, 0, 0, 0.8)',
    });
  }
  if (centroids.length) {
    chart.data.datasets.push({
      label: 'Centróides',
      data: centroids,
      borderColor: '#000',
      backgroundColor: 'rgba(216, 17, 33, 0.8)',	
      pointStyle: 'circle',
      pointRadius: 25
    });
  }
  chart.update();
}

// Inicia sem animações
resetVarianceTracking(k);
updateChart();

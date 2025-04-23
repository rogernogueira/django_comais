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
  } else {
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
  step++;
  currentStep.textContent = step;
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
updateChart();

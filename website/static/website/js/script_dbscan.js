const ctx = document.getElementById('chart')?.getContext('2d');

if (ctx) {
  let dataPoints = [];
  let clusters = [];
  let pointTypes = [];
  let epsilon = 1.0;
  let minPts = 4;

  const sliderEps = document.getElementById('input-eps');
  const labelEps = document.getElementById('label-eps');
  const sliderMinPts = document.getElementById('input-minpts');
  const labelMinPts = document.getElementById('label-minpts');
  const btnRun = document.getElementById('btn-run');
  const coreCountEl = document.getElementById('core-count');
  const borderCountEl = document.getElementById('border-count');
  const noiseCountEl = document.getElementById('noise-count');
  const clusterCountEl = document.getElementById('cluster-count');

  const presetButtons = {
    linear: document.getElementById('btn-linear'),
    circle: document.getElementById('btn-circle'),
    noise: document.getElementById('btn-noise'),
    clear: document.getElementById('btn-clear'),
    undo: document.getElementById('btn-undo')
  };

  const palette = [
    'rgba(46, 134, 193, 0.9)',
    'rgba(40, 180, 99, 0.9)',
    'rgba(231, 76, 60, 0.9)',
    'rgba(155, 89, 182, 0.9)',
    'rgba(244, 208, 63, 0.9)',
    'rgba(230, 126, 34, 0.9)',
    'rgba(26, 188, 156, 0.9)',
    'rgba(84, 153, 199, 0.9)',
    'rgba(214, 137, 16, 0.9)',
    'rgba(133, 193, 233, 0.9)'
  ];

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
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });

  sliderEps.addEventListener('input', () => {
    epsilon = parseFloat(sliderEps.value);
    labelEps.textContent = epsilon.toFixed(1);
    resetClassification();
  });

  sliderMinPts.addEventListener('input', () => {
    minPts = parseInt(sliderMinPts.value, 10);
    labelMinPts.textContent = minPts;
    resetClassification();
  });

  ctx.canvas.addEventListener('click', evt => {
    const rect = ctx.canvas.getBoundingClientRect();
    const x = chart.scales.x.getValueForPixel(evt.clientX - rect.left);
    const y = chart.scales.y.getValueForPixel(evt.clientY - rect.top);
    dataPoints.push({ x, y });
    resetClassification();
    updateChart();
  });

  presetButtons.linear.onclick = () => preset('linear');
  presetButtons.circle.onclick = () => preset('circle');
  presetButtons.noise.onclick = () => preset('noise');
  presetButtons.clear.onclick = () => {
    dataPoints = [];
    resetClassification();
    updateChart();
  };
  presetButtons.undo.onclick = () => {
    dataPoints.pop();
    resetClassification();
    updateChart();
  };

  btnRun.addEventListener('click', runDbscan);

  function preset(type) {
    dataPoints = [];
    if (type === 'linear') {
      for (let i = 0; i < 50; i++) {
        dataPoints.push({ x: Math.random() * 4 + 1, y: Math.random() * 4 + 1 });
        dataPoints.push({ x: Math.random() * 4 + 5, y: Math.random() * 4 + 5 });
      }
    } else if (type === 'circle') {
      for (let i = 0; i < 220; i++) {
        const radius = Math.random() * 4.5;
        const angle = Math.random() * Math.PI * 2;
        dataPoints.push({ x: 5 + radius * Math.cos(angle), y: 5 + radius * Math.sin(angle) });
      }
    } else if (type === 'noise') {
      for (let i = 0; i < 200; i++) {
        dataPoints.push({ x: Math.random() * 10, y: Math.random() * 10 });
      }
    }
    resetClassification();
    updateChart();
  }

  function runDbscan() {
    if (!dataPoints.length) {
      alert('Adicione pontos antes de executar o DBSCAN.');
      return;
    }

    const neighbors = dataPoints.map(() => []);
    clusters = new Array(dataPoints.length).fill(-1);
    pointTypes = new Array(dataPoints.length).fill('noise');

    for (let i = 0; i < dataPoints.length; i++) {
      for (let j = i + 1; j < dataPoints.length; j++) {
        const d = distance(dataPoints[i], dataPoints[j]);
        if (d <= epsilon) {
          neighbors[i].push(j);
          neighbors[j].push(i);
        }
      }
    }

    neighbors.forEach((list, idx) => {
      if (list.length + 1 >= minPts) {
        pointTypes[idx] = 'core';
      }
    });

    let currentCluster = 0;
    for (let i = 0; i < dataPoints.length; i++) {
      if (pointTypes[i] !== 'core' || clusters[i] !== -1) continue;
      expandCluster(i, currentCluster, neighbors);
      currentCluster++;
    }

    pointTypes = pointTypes.map((type, idx) => {
      if (type === 'core') return 'core';
      if (clusters[idx] !== -1) return 'border';
      return 'noise';
    });

    updateSummary();
    updateChart();
  }

  function expandCluster(seedIndex, clusterId, neighbors) {
    const queue = [seedIndex];
    clusters[seedIndex] = clusterId;

    while (queue.length) {
      const current = queue.shift();
      neighbors[current].forEach(neigh => {
        if (clusters[neigh] === -1) {
          clusters[neigh] = clusterId;
          if (pointTypes[neigh] === 'core') {
            queue.push(neigh);
          }
        }
      });
    }
  }

  function updateChart() {
    chart.data.datasets = [];

    if (!dataPoints.length) {
      chart.update();
      return;
    }

    const classified = clusters.length === dataPoints.length && pointTypes.length === dataPoints.length;

    if (!classified) {
      chart.data.datasets.push({
        label: 'Pontos',
        data: dataPoints,
        backgroundColor: 'rgba(52, 73, 94, 0.9)',
        borderColor: 'rgba(33, 47, 60, 0.9)',
        pointRadius: 5
      });
      chart.update();
      return;
    }

    const clusterIds = Array.from(new Set(clusters.filter(id => id !== -1))).sort((a, b) => a - b);

    clusterIds.forEach((clusterId, idx) => {
      const color = palette[idx % palette.length];
      const corePoints = dataPoints.filter((_, ptIdx) => clusters[ptIdx] === clusterId && pointTypes[ptIdx] === 'core');
      const borderPoints = dataPoints.filter((_, ptIdx) => clusters[ptIdx] === clusterId && pointTypes[ptIdx] === 'border');

      if (corePoints.length) {
        chart.data.datasets.push({
          label: `Cluster ${clusterId} - Núcleo`,
          data: corePoints,
          backgroundColor: color,
          borderColor: '#111',
          borderWidth: 1,
          pointRadius: 7,
          pointStyle: 'circle'
        });
      }

      if (borderPoints.length) {
        chart.data.datasets.push({
          label: `Cluster ${clusterId} - Borda`,
          data: borderPoints,
          backgroundColor: color,
          borderColor: color,
          pointRadius: 6,
          pointStyle: 'triangle'
        });
      }
    });

    const noisePoints = dataPoints.filter((_, idx) => pointTypes[idx] === 'noise');
    if (noisePoints.length) {
      chart.data.datasets.push({
        label: 'Ruído',
        data: noisePoints,
        backgroundColor: 'rgba(149, 165, 166, 0.8)',
        borderColor: 'rgba(44, 62, 80, 0.6)',
        pointRadius: 6,
        pointStyle: 'crossRot'
      });
    }

    chart.update();
  }

  function updateSummary() {
    if (clusters.length !== dataPoints.length || pointTypes.length !== dataPoints.length) {
      clusterCountEl.textContent = 0;
      coreCountEl.textContent = 0;
      borderCountEl.textContent = 0;
      noiseCountEl.textContent = 0;
      return;
    }

    const clusterIds = new Set(clusters.filter(id => id !== -1));
    clusterCountEl.textContent = clusterIds.size;
    coreCountEl.textContent = pointTypes.filter(type => type === 'core').length;
    borderCountEl.textContent = pointTypes.filter(type => type === 'border').length;
    noiseCountEl.textContent = pointTypes.filter(type => type === 'noise').length;
  }

  function resetClassification() {
    clusters = [];
    pointTypes = [];
    updateSummary();
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  updateChart();
  updateSummary();
}

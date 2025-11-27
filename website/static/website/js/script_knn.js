const ctx = document.getElementById('chart')?.getContext('2d');

if (ctx) {
  let dataPoints = [];
  let decisionField = [];
  let selectedClass = 0;
  let k = 3;

  const inputK = document.getElementById('input-k');
  const labelK = document.getElementById('label-k');
  const classButtons = {
    0: document.getElementById('btn-class-0'),
    1: document.getElementById('btn-class-1')
  };
  const presets = {
    linear: document.getElementById('btn-linear'),
    circle: document.getElementById('btn-circle'),
    noise: document.getElementById('btn-noise')
  };
  const btnClear = document.getElementById('btn-clear');
  const btnUndo = document.getElementById('btn-undo');
  const btnClassify = document.getElementById('btn-classify');

  const metrics = {
    acc: document.getElementById('metric-acc'),
    prec: document.getElementById('metric-prec'),
    rec: document.getElementById('metric-recall'),
    f1: document.getElementById('metric-f1')
  };

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

  function setActiveClassButton(active) {
    Object.entries(classButtons).forEach(([label, button]) => {
      if (!button) {
        return;
      }
      if (Number(label) === active) {
        button.classList.add('ring-2', 'ring-offset-2', 'ring-indigo-500');
      } else {
        button.classList.remove('ring-2', 'ring-offset-2', 'ring-indigo-500');
      }
    });
  }

  setActiveClassButton(selectedClass);

  inputK?.addEventListener('input', () => {
    k = parseInt(inputK.value, 10) || 1;
    labelK.textContent = k;
    invalidateDecisionField();
    updateChart();
  });

  classButtons[0]?.addEventListener('click', () => {
    selectedClass = 0;
    setActiveClassButton(0);
  });
  classButtons[1]?.addEventListener('click', () => {
    selectedClass = 1;
    setActiveClassButton(1);
  });

  ctx.canvas.addEventListener('click', evt => {
    const rect = ctx.canvas.getBoundingClientRect();
    const x = chart.scales.x.getValueForPixel(evt.clientX - rect.left);
    const y = chart.scales.y.getValueForPixel(evt.clientY - rect.top);

    if (Number.isNaN(x) || Number.isNaN(y)) {
      return;
    }

    dataPoints.push({ x, y, label: selectedClass });
    invalidateDecisionField();
    updateChart();
  });

  presets.linear?.addEventListener('click', () => loadPreset('linear'));
  presets.circle?.addEventListener('click', () => loadPreset('circle'));
  presets.noise?.addEventListener('click', () => loadPreset('noise'));

  btnClear?.addEventListener('click', () => {
    dataPoints = [];
    invalidateDecisionField();
    updateChart();
  });

  btnUndo?.addEventListener('click', () => {
    dataPoints.pop();
    invalidateDecisionField();
    updateChart();
  });

  btnClassify?.addEventListener('click', () => {
    if (!dataPoints.length) {
      alert('Adicione pontos antes de classificar.');
      return;
    }

    if (k > dataPoints.length) {
      alert('Adicione pelo menos K pontos para realizar a classificação.');
      return;
    }

    buildDecisionField();
    updateMetrics();
    updateChart();
  });

  function loadPreset(type) {
    dataPoints = [];

    if (type === 'linear') {
      for (let i = 0; i < 50; i++) {
        dataPoints.push({ x: Math.random() * 4 + 1, y: Math.random() * 4 + 1, label: 0 });
        dataPoints.push({ x: Math.random() * 4 + 5, y: Math.random() * 4 + 5, label: 1 });
      }
    } else if (type === 'circle') {
      for (let i = 0; i < 220; i++) {
        const radius = Math.random() * 5;
        const angle = Math.random() * Math.PI * 2;
        const label = radius < 3 ? 0 : 1;
        dataPoints.push({
          x: 5 + radius * Math.cos(angle),
          y: 5 + radius * Math.sin(angle),
          label
        });
      }
    } else if (type === 'noise') {
      for (let i = 0; i < 200; i++) {
        dataPoints.push({
          x: Math.random() * 10,
          y: Math.random() * 10,
          label: Math.random() < 0.5 ? 0 : 1
        });
      }
    }

    invalidateDecisionField();
    updateChart();
  }

  function buildDecisionField() {
    decisionField = [];
    const resolution = 32;
    const step = 10 / (resolution - 1);

    for (let xi = 0; xi < resolution; xi++) {
      for (let yi = 0; yi < resolution; yi++) {
        const x = xi * step;
        const y = yi * step;
        const label = classifyPoint(x, y);
        decisionField.push({ x, y, label });
      }
    }
  }

  function classifyPoint(x, y) {
    const distances = dataPoints.map(point => ({
      distance: Math.hypot(point.x - x, point.y - y),
      label: point.label
    }));

    distances.sort((a, b) => a.distance - b.distance);

    const effectiveK = Math.min(k, distances.length);
    const votes = distances.slice(0, effectiveK).reduce((sum, item) => sum + item.label, 0);

    return votes >= effectiveK / 2 ? 1 : 0;
  }

  function computeMetrics(preds, trues) {
    let tp = 0;
    let tn = 0;
    let fp = 0;
    let fn = 0;

    preds.forEach((pred, idx) => {
      const truth = trues[idx];
      if (pred === 1 && truth === 1) tp++;
      else if (pred === 0 && truth === 0) tn++;
      else if (pred === 1 && truth === 0) fp++;
      else if (pred === 0 && truth === 1) fn++;
    });

    const total = tp + tn + fp + fn || 1;
    const acc = ((tp + tn) / total) * 100;
    const prec = tp + fp ? (tp / (tp + fp)) * 100 : 0;
    const rec = tp + fn ? (tp / (tp + fn)) * 100 : 0;
    const f1 = prec + rec ? (2 * (prec * rec) / (prec + rec)) : 0;

    return { acc, prec, rec, f1 };
  }

  function updateMetrics() {
    const preds = dataPoints.map(point => classifyPoint(point.x, point.y));
    const trues = dataPoints.map(point => point.label);
    const { acc, prec, rec, f1 } = computeMetrics(preds, trues);

    metrics.acc.textContent = `${acc.toFixed(2)}%`;
    metrics.prec.textContent = `${prec.toFixed(2)}%`;
    metrics.rec.textContent = `${rec.toFixed(2)}%`;
    metrics.f1.textContent = `${f1.toFixed(2)}%`;
  }

  function metricsReset() {
    metrics.acc.textContent = '0%';
    metrics.prec.textContent = '0%';
    metrics.rec.textContent = '0%';
    metrics.f1.textContent = '0%';
  }

  function invalidateDecisionField() {
    decisionField = [];
    metricsReset();
  }

  function updateChart() {
    const datasets = [];

    if (decisionField.length) {
      datasets.push({
        label: 'Fronteira de decisão',
        data: decisionField.map(point => ({ x: point.x, y: point.y })),
        pointRadius: 3,
        pointHoverRadius: 0,
        hitRadius: 0,
        showLine: false,
        pointBackgroundColor: decisionField.map(point => point.label ? 'rgba(239, 68, 68, 0.20)' : 'rgba(59, 130, 246, 0.20)'),
        pointBorderColor: decisionField.map(point => point.label ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)'),
        borderWidth: 0
      });
    }

    const class0 = dataPoints.filter(point => point.label === 0);
    const class1 = dataPoints.filter(point => point.label === 1);

    datasets.push({
      label: 'Classe 0',
      data: class0,
      parsing: false,
      pointRadius: 6,
      backgroundColor: 'rgba(59, 130, 246, 0.85)',
      borderColor: 'rgba(37, 99, 235, 0.9)'
    });

    datasets.push({
      label: 'Classe 1',
      data: class1,
      parsing: false,
      pointRadius: 6,
      backgroundColor: 'rgba(239, 68, 68, 0.85)',
      borderColor: 'rgba(220, 38, 38, 0.9)'
    });

    chart.data.datasets = datasets;
    chart.update();
  }

  updateChart();
}

let dataPoints = [];
let selectedClass = 0;
let kernel = 'linear';
let w, b, omega = null, biasFF = null;
const maxEpochs = 100;

// DOM refs
const plotDiv = document.getElementById('plot');
const btns = [
  document.getElementById('btn-class-0'),
  document.getElementById('btn-class-1')
];
const selectKernel = document.getElementById('select-kernel');
const inputDegree = document.getElementById('input-degree'), labelDegree = document.getElementById('label-degree');
const inputGamma = document.getElementById('input-gamma'), labelGamma = document.getElementById('label-gamma');
const inputFF = document.getElementById('input-ff'), labelFF = document.getElementById('label-ff');
const inputC = document.getElementById('input-C'), labelC = document.getElementById('label-C');
const btnLinear = document.getElementById('btn-linear');
const btnCircle = document.getElementById('btn-circle');
const btnNoise = document.getElementById('btn-noise');
const btnClear = document.getElementById('btn-clear');
const btnUndo = document.getElementById('btn-undo');
const btnTrain = document.getElementById('btn-train');
const progressBar = document.getElementById('progress-training');
const svList = document.getElementById('sv-list'), svCount = document.getElementById('sv-count');
const metricAcc = document.getElementById('metric-acc'), metricPrec = document.getElementById('metric-prec');
const metricRecall = document.getElementById('metric-recall'), metricF1 = document.getElementById('metric-f1');

// Inicialização do plot
function initPlot() {
  Plotly.newPlot(plotDiv, [], {
    xaxis: { range: [0,10] },
    yaxis: { range: [0,10] },
    hovermode: 'closest'
  }, { responsive: true });
}

// Atualiza botões de classe
function updateClassButtons() {
  btns.forEach((btn,i) => {
    btn.classList.toggle('ring-2', selectedClass === i);
    btn.classList.toggle(i===0 ? 'ring-blue-500' : 'ring-red-500', selectedClass === i);
  });
}

// Mostra/oculta parâmetros de kernel
function updateKernelParams() {
  kernel = selectKernel.value;
  document.getElementById('param-degree').classList.toggle('hidden', kernel !== 'poly');
  document.getElementById('param-gamma').classList.toggle('hidden', kernel !== 'rbf');
  document.getElementById('param-ff').classList.toggle('hidden', kernel !== 'rbf');
}

// Feature Maps
function polyFeatures([x,y], d) {
  const feats = [];
  for (let i=0; i<=d; i++) for (let j=0; j<=d-i; j++) feats.push(x**i * y**j);
  return feats;
}
function initRFF(dim, g) {
  omega = []; biasFF = [];
  const sigma = Math.sqrt(2*g);
  for (let i=0; i<dim; i++) {
    omega.push([randomNormal()*sigma, randomNormal()*sigma]);
    biasFF.push(Math.random()*2*Math.PI);
  }
}
function rbfFeatures([x,y]) {
  const dim = omega.length, scale = Math.sqrt(2/dim), feats=[];
  for (let i=0; i<dim; i++) feats.push(scale * Math.cos(omega[i][0]*x + omega[i][1]*y + biasFF[i]));
  return feats;
}
function randomNormal() { let u=0,v=0; while(!u)u=Math.random(); while(!v)v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }

// Eventos UI
btns[0].onclick = () => { selectedClass=0; updateClassButtons(); };
btns[1].onclick = () => { selectedClass=1; updateClassButtons(); };
selectKernel.onchange = updateKernelParams;
inputDegree.oninput = () => labelDegree.textContent = inputDegree.value;
inputGamma.oninput = () => labelGamma.textContent = inputGamma.value;
inputFF.oninput = () => labelFF.textContent = inputFF.value;
inputC.oninput = () => labelC.textContent = inputC.value;
plotDiv.addEventListener('plotly_click', e => { const pt=e.detail.points[0]; if(pt){ dataPoints.push({x:pt.x,y:pt.y,label:selectedClass}); updatePlot(); }});
btnClear.onclick = () => { dataPoints=[]; clearInfo(); updatePlot(); };
btnUndo.onclick = () => { dataPoints.pop(); clearInfo(); updatePlot(); };
btnLinear.onclick = () => loadPreset('linear');
btnCircle.onclick = () => loadPreset('circle');
btnNoise.onclick = () => loadPreset('noise');

btnTrain.onclick = async () => {
  if(dataPoints.filter(p=>p.label===0).length<2||dataPoints.filter(p=>p.label===1).length<2) {
    alert('Insira ao menos 2 pontos de cada classe.'); return;
  }
  const d = parseInt(inputDegree.value), g = parseFloat(inputGamma.value), ff = parseInt(inputFF.value);
  if(kernel==='rbf') initRFF(ff,g);
  const featArr = dataPoints.map(p => kernel==='linear' ? [p.x,p.y] : kernel==='poly' ? polyFeatures([p.x,p.y],d) : rbfFeatures([p.x,p.y]));
  const X = tf.tensor2d(featArr);
  const y = tf.tensor1d(dataPoints.map(p=>p.label===1?1:-1));
  const C = 1/parseFloat(inputC.value);
  w = tf.variable(tf.zeros([X.shape[1],1])); b = tf.variable(tf.zeros([1]));
  const opt = tf.train.adam(0.1);
  progressBar.value=0;
  for(let i=0;i<maxEpochs;i++){
    opt.minimize(()=>{
      const logits = X.matMul(w).add(b);
      const ywx = tf.mul(y.reshape([-1,1]), logits);
      const hinge = tf.maximum(0, tf.sub(1, ywx));
      return tf.add(tf.mean(hinge), tf.mul(C, tf.sum(tf.square(w))));
    }, true);
    await tf.nextFrame();
    progressBar.value = ((i+1)/maxEpochs)*100;
  }
  // Cálculo de vetores de suporte e métricas
  const margins = tf.tidy(()=>{
    const allFeat = tf.tensor2d(featArr);
    const logitsAll = allFeat.matMul(w).add(b).flatten();
    allFeat.dispose();
    return tf.mul(y.reshape([-1,1]), logitsAll.reshape([featArr.length,1])).flatten();
  });
  const mArr = await margins.array(); margins.dispose(); X.dispose(); y.dispose();
  clearInfo(); svCount.textContent = mArr.filter(m=>m<=1+1e-3).length;
  mArr.forEach((m,i)=>{ if(m<=1+1e-3) svList.insertAdjacentHTML('beforeend', `<li>(${dataPoints[i].x.toFixed(2)}, ${dataPoints[i].y.toFixed(2)})</li>`); });
  const allFeatX = tf.tensor2d(featArr);
  const logitsAll = allFeatX.matMul(w).add(b).flatten();
  const predArr = await logitsAll.array(); allFeatX.dispose(); logitsAll.dispose();
  const trueArr = dataPoints.map(p=>p.label===1?1:-1);
  let tp=0,tn=0,fp=0,fn=0;
  predArr.forEach((d,i)=>{ const pr=d>=0?1:-1; if(pr===1&&trueArr[i]===1) tp++; if(pr===-1&&trueArr[i]===-1) tn++; if(pr===1&&trueArr[i]===-1) fp++; if(pr===-1&&trueArr[i]===1) fn++; });
  const acc=((tp+tn)/(tp+tn+fp+fn))*100;
  const prec=tp+fp?tp/(tp+fp)*100:0;
  const rec=tp+fn?tp/(tp+fn)*100:0;
  const f1=prec+rec?2*(prec*rec)/(prec+rec):0;
  metricAcc.textContent=`${acc.toFixed(2)}%`;
  metricPrec.textContent=`${prec.toFixed(2)}%`;
  metricRecall.textContent=`${rec.toFixed(2)}%`;
  metricF1.textContent=`${f1.toFixed(2)}%`;
  await drawDecisionSurface(featArr,d,ff);
};

function updatePlot(dec) {
  const c0 = dataPoints.filter(p=>p.label===0), c1 = dataPoints.filter(p=>p.label===1);
  const traces = [
    { x:c0.map(p=>p.x), y:c0.map(p=>p.y), mode:'markers', marker:{color:'blue',size:8}, name:'Classe 0' },
    { x:c1.map(p=>p.x), y:c1.map(p=>p.y), mode:'markers', marker:{color:'red',size:8}, name:'Classe 1' }
  ];
  if(dec && dec.contour) traces.unshift(dec.contour);
  Plotly.react(plotDiv, traces, { xaxis:{range:[0,10]}, yaxis:{range:[0,10]} });
}

async function drawDecisionSurface(featArr, d, ff) {
  const res=50;
  const xs=tf.linspace(0,10,res).arraySync();
  const ys=tf.linspace(0,10,res).arraySync();
  const gridFeat=[];
  for(let i=0;i<res;i++) for(let j=0;j<res;j++) {
    const pt=[xs[j],ys[i]];
    gridFeat.push(kernel==='linear'?pt:kernel==='poly'?polyFeatures(pt,d):rbfFeatures(pt));
  }
  const GX=tf.tensor2d(gridFeat);
  const Z=GX.matMul(w).add(b).reshape([res,res]);
  const zarr=await Z.array();
  GX.dispose(); Z.dispose();
  const contour={
    x:xs, y:ys, z:zarr,
    type:'contour', showscale:false, opacity:0.4,
    colorscale:[[0,'rgba(0,0,255,0.2)'],[1,'rgba(255,0,0,0.2)']],
    contours:{showlines:false}
  };
  updatePlot({contour});
}

function clearInfo() {
  svList.innerHTML=''; svCount.textContent='0';
  metricAcc.textContent='0%'; metricPrec.textContent='0%';
  metricRecall.textContent='0%'; metricF1.textContent='0%';
}

function loadPreset(type) {
  dataPoints=[]; clearInfo();
  if(type==='linear') {
    for(let i=0;i<50;i++) {
      dataPoints.push({x:Math.random()*4+1,y:Math.random()*4+1,label:0});
      dataPoints.push({x:Math.random()*4+6,y:Math.random()*4+6,label:1});
    }
  } else if(type==='circle') {
    for(let i=0;i<100;i++) {
      const r=Math.random()*5, th=Math.random()*2*Math.PI;
      dataPoints.push({x:r*Math.cos(th)+5,y:r*Math.sin(th)+5,label:r<3?0:1});
    }
  } else {
    for(let i=0;i<200;i++) {
      dataPoints.push({x:tf.randomNormal([1],3,1).arraySync()[0],y:tf.randomNormal([1],7,1).arraySync()[0],label:0});
      dataPoints.push({x:tf.randomNormal([1],7,1).arraySync()[0],y:tf.randomNormal([1],3,1).arraySync()[0],label:1});
    }
  }
  updatePlot();
}

// Inicialização
initPlot(); updateClassButtons(); updateKernelParams();

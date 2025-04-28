const plot3d = document.getElementById('plot3d');
const fnSelect = document.getElementById('fnSelect');
const lrInput = document.getElementById('lrInput');
const stepsInput = document.getElementById('stepsInput');
const initBtn = document.getElementById('initBtn');
const runBtn = document.getElementById('runBtn');
const stepSpan = document.getElementById('currentStep');

let X = [], Y = [], Z = [];
let trajectory = [];
let currentStep = 0;

// Gera superfície
function generateSurface(fn) {
  const res = 50;
  X = []; Y = []; Z = [];
  for (let i = 0; i < res; i++) {
    const xi = i * 10 / (res - 1) - 5;
    const xRow = [];
    const zRow = [];
    for (let j = 0; j < res; j++) {
      const yj = j * 10 / (res - 1) - 5;
      xRow.push(xi);
      Y.push(yj);
      if (fn === 'bowl') zRow.push(xi*xi + yj*yj);
      else zRow.push(xi*xi - yj*yj);
    }
    X.push(xRow);
    Z.push(zRow);
  }
}

// Plota superfície + trajetória
function plotSurface() {
  const data = [
    {
      type: 'surface', x: X, y: X[0].map((_,i)=>Y[i]), z: Z,
      colorscale: 'Viridis', opacity: 0.8
    }
  ];
  if (trajectory.length) {
    const tx = trajectory.map(p=>p[0]);
    const ty = trajectory.map(p=>p[1]);
    const tz = trajectory.map(p=>p[2]);
    data.push({ type:'scatter3d', mode:'lines+markers', x:tx, y:ty, z:tz,
      marker:{size:4,color:'red'}, line:{width:2,color:'red'} });
  }
  Plotly.newPlot(plot3d, data, { scene:{ xaxis:{title:'x'}, yaxis:{title:'y'}, zaxis:{title:'f(x,y)'} } });
}

// Inicializa ponto e parámetros
initBtn.onclick = () => {
  generateSurface(fnSelect.value);
  trajectory = [[ Math.random()*4-2, Math.random()*4-2, 0 ]];
  // calcula f(init)
  const p = trajectory[0];
  p[2] = fnSelect.value === 'bowl' ? p[0]*p[0]+p[1]*p[1] : p[0]*p[0] - p[1]*p[1];
  currentStep = 0;
  stepSpan.textContent = currentStep;
  plotSurface();
};

// Executa Gradient Descent
runBtn.onclick = async () => {
  const lr = parseFloat(lrInput.value);
  const steps = parseInt(stepsInput.value,10);
  for(let i=1;i<=steps;i++){
    const p = trajectory[trajectory.length-1];
    const [x,y] = p;
    // gradiens analíticos
    let dx, dy;
    if(fnSelect.value==='bowl') { dx=2*x; dy=2*y; }
    else { dx=2*x; dy=-2*y; }
    const nx = x - lr*dx;
    const ny = y - lr*dy;
    const nz = fnSelect.value==='bowl' ? nx*nx+ny*ny : nx*nx-ny*ny;
    trajectory.push([nx,ny,nz]);
    currentStep = i;
    stepSpan.textContent = currentStep;
    plotSurface();
    await new Promise(r=>setTimeout(r,200));
  }
};

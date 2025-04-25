// script_nn.js
// -------------------------------------------------------
// UI + geração de dados + treinamento TF.js + métricas
// -------------------------------------------------------
(() => {
  /* ---------- util DOM ---------- */
  const $ = (id) => document.getElementById(id);

  /* ---------- controles ---------- */
  const btnClass0   = $("btn-class-0");
  const btnClass1   = $("btn-class-1");
  const btnClear    = $("btn-clear");
  const btnUndo     = $("btn-undo");
  const btnTrain    = $("btn-train");
  const btnShow     = $("btn-show-graph");

  const btnLinear   = $("btn-linear");
  const btnCircles  = $("btn-circles");
  const btnSpiral   = $("btn-spiral");
  const btnXor      = $("btn-xor");
  const btnNoise    = $("btn-noise");

  const inputLayers   = $("input-layers");
  const inputNeurons  = $("input-neurons");
  const selectAct     = $("select-activation");
  const selectOpt     = $("select-optimizer");
  const inputLR       = $("input-lr");
  const inputEpochs   = $("input-epochs");

  const progressBar   = $("progress-training");
  const labelLayers   = $("label-layers");
  const labelNeurons  = $("label-neurons");

  /* ---------- métricas ---------- */
  const mLoss   = $("metric-loss");
  const mAcc    = $("metric-acc");
  const mPrec   = $("metric-prec");
  const mRecall = $("metric-recall");
  const mParams = $("param-count");

  /* ---------- modal ---------- */
  const modal   = $("nn-modal");
  const btnClose= $("btn-close-modal");
  const svgD3   = d3.select("#nn-graph");

  /* ---------- estado ---------- */
  let points   = [];      // [{x,y,label}]
  let history  = [];
  let curClass = 0;
  let netModel = null;    // tf.Model

  /* ---------- gráfico de pontos ---------- */
  Chart.defaults.animation = false;

  const dataChart = new Chart($("dataChart").getContext("2d"), {
    type: "scatter",
    data: { datasets: [{ label:"Dados", data:[], pointRadius:15, pointBackgroundColor:[] }] },
    options: {
      responsive:false,
      scales:{ x:{min:-6,max:6}, y:{min:-6,max:6} },
      animation:false
    }
  });

  const lossChart = new Chart($("lossChart").getContext("2d"), {
    type:"line",
    data:{ labels:[], datasets:[{label:"Loss", data:[]}] },
    options:{ responsive:false, animation:false }
  });

  /* ---------- helpers ---------- */
  inputLayers.oninput  = ()=>labelLayers .textContent=inputLayers .value;
  inputNeurons.oninput = ()=>labelNeurons.textContent=inputNeurons.value;

  const redraw = () => {
    const ds=dataChart.data.datasets[0];
    ds.data = points.map(p=>({x:p.x,y:p.y}));
    ds.pointBackgroundColor = points.map(p=>p.label?"red":"blue");
    dataChart.update();
  };
  const backup = () => history.push(points.map(p=>({...p})));

  /* ---------- UI básico ---------- */
  btnClass0.onclick = ()=>curClass=0;
  btnClass1.onclick = ()=>curClass=1;

  $("dataChart").onclick = e=>{
    const rect=dataChart.canvas.getBoundingClientRect();
    const x=((e.clientX-rect.left)/rect.width)*12-6;
    const y=6-((e.clientY-rect.top)/rect.height)*12;
    points.push({x,y,label:curClass});
    redraw();
  };

  btnClear.onclick = ()=>{backup();points=[];redraw();};
  btnUndo .onclick = ()=>{if(history.length){points=history.pop();redraw();}};

  /* ---------- presets ---------- */
  function makePreset(type){
    backup(); points=[]; const N=60;
    if(type==="linear"){
      for(let i=0;i<N;i++){
        const x=Math.random()*10-5;
        points.push({x,y:x+(Math.random()-0.5),label:0});
        const x2=Math.random()*10-5;
        points.push({x:x2,y:-x2+(Math.random()-0.5),label:1});
      }
    }else if(type==="circles"){
      for(let i=0;i<N;i++){
        const r1=Math.random()*2.5,t1=Math.random()*Math.PI*2;
        points.push({x:r1*Math.cos(t1),y:r1*Math.sin(t1),label:0});
        const r2=Math.random()*2.5+3.5,t2=Math.random()*Math.PI*2;
        points.push({x:r2*Math.cos(t2),y:r2*Math.sin(t2),label:1});
      }
    }else if(type==="spiral"){
      for(let i=0;i<N;i++){
        const r=5*i/N,t=4*i/N*Math.PI;
        points.push({x:r*Math.cos(t),y:r*Math.sin(t),label:0});
        points.push({x:r*Math.cos(t+Math.PI),y:r*Math.sin(t+Math.PI),label:1});
      }
    }else if(type==="xor"){
      for(let i=0;i<N;i++){
        const x=Math.random()*4-2,y=Math.random()*4-2;
        points.push({x,y,label:x*y>0?0:1});
      }
    }else if(type==="noise"){
      for(let i=0;i<N*2;i++){
        points.push({x:Math.random()*12-6,y:Math.random()*12-6,label:Math.random()>0.5?0:1});
      }
    }
    redraw();
  }
  btnLinear .onclick = ()=>makePreset("linear");
  btnCircles.onclick = ()=>makePreset("circles");
  btnSpiral .onclick = ()=>makePreset("spiral");
  btnXor    .onclick = ()=>makePreset("xor");
  btnNoise  .onclick = ()=>makePreset("noise");

  /* ---------- treino ---------- */
  async function train(){
    if(points.length<4){alert("Adicione mais pontos!");return;}

    btnTrain.disabled=true; btnShow.classList.add("hidden");
    progressBar.value=0; lossChart.data.labels=[]; lossChart.data.datasets[0].data=[]; lossChart.update();

    const xs=tf.tensor2d(points.map(p=>[p.x,p.y]));
    const ys=tf.tensor2d(points.map(p=>[p.label]));

    const model=tf.sequential();
    model.add(tf.layers.dense({inputShape:[2], units:+inputNeurons.value, activation:selectAct.value}));
    for(let i=1;i<+inputLayers.value;i++)
      model.add(tf.layers.dense({units:+inputNeurons.value, activation:selectAct.value}));
    model.add(tf.layers.dense({units:1, activation:"sigmoid"}));

    model.compile({
      optimizer: tf.train[selectOpt.value](+inputLR.value),
      loss:"binaryCrossentropy",
      metrics:["accuracy"]
    });

    await model.fit(xs,ys,{
      epochs:+inputEpochs.value,
      callbacks:{onEpochEnd:(e,l)=>{lossChart.data.labels.push(e+1);lossChart.data.datasets[0].data.push(l.loss);lossChart.update();progressBar.value=((e+1)/+inputEpochs.value)*100;}}
    });

    // métricas
    const [lossT, accT] = await model.evaluate(xs,ys);
    mLoss .textContent=lossT.dataSync()[0].toFixed(3);
    mAcc  .textContent=(accT.dataSync()[0]*100).toFixed(1)+'%';

    const preds=model.predict(xs).dataSync();
    let TP=0,FP=0,FN=0;
    preds.forEach((p,i)=>{
      const pr=p>0.5?1:0, real=points[i].label;
      if(pr&&real)TP++; if(pr&&!real)FP++; if(!pr&&real)FN++;
    });
    const prec=TP+FP?TP/(TP+FP):0;
    const rec =TP+FN?TP/(TP+FN):0;
    mPrec  .textContent=(prec*100).toFixed(1)+'%';
    mRecall.textContent=(rec*100).toFixed(1)+'%';
    mParams.textContent=model.getWeights().reduce((s,w)=>s+w.size,0);

    netModel=model;
    btnShow.classList.remove("hidden");
    btnTrain.disabled=false;
  }
  btnTrain.onclick=train;

  /* ---------- modal & D3 ---------- */
  btnShow.onclick  = ()=>{ 
    if(netModel){ renderGraph(netModel);
       modal.classList.remove("hidden");
       requestAnimationFrame(() => renderGraph(netModel)); 
  
  }};
  btnClose.onclick = ()=>  modal.classList.add("hidden");

  function renderGraph(model){
    svgD3.selectAll("*").remove(); // limpa
    
    const w = svgD3.node().clientWidth;
    const h = svgD3.node().clientHeight;
    svgD3.attr("viewBox", `0 0 ${w} ${h}`);

    const sizes = model.layers.map(l=>l.units??l.outputShape[1]);
    const maxN  = Math.max(...sizes);
    const pad = 40;
    const xGap  = ((w-2*pad)/(sizes.length-1));
    const yGap  = h/(maxN+1);

    // gera nós com padding central em cada camada
    const nodes=[]; const links=[];
    sizes.forEach((c,li)=>{
      const offset=(h - c*yGap)/2 + yGap/2;
      for(let j=0;j<c;j++){
        nodes.push({id:`${li}-${j}`, x:li*xGap, y:offset+j*yGap});
      }
      if(li>0){
        const W=model.layers[li].getWeights()[0].arraySync(); // [prev][cur]
        for(let p=0;p<sizes[li-1];p++)for(let q=0;q<c;q++){
          links.push({s:`${li-1}-${p}`, t:`${li}-${q}`, w:W[p][q]});
        }
      }
    });

    const maxW=d3.max(links,l=>Math.abs(l.w))||1;
    const sw=d3.scaleLinear().domain([0,maxW]).range([0.5,4]);

    svgD3.attr("viewBox",`0 0 ${w} ${h}`);

    svgD3.selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("x1",d=>(nodes.find(n=>n.id===d.s).x)+12)
      .attr("y1",d=>nodes.find(n=>n.id===d.s).y)
      .attr("x2",d=>nodes.find(n=>n.id===d.t).x)
      .attr("y2",d=>nodes.find(n=>n.id===d.t).y)
      .attr("stroke",d=>d.w>0 ? '#2563eb': '#dc2626')  
      .attr("stroke-width",d=>sw(Math.abs(d.w)))
      .attr("stroke-opacity",0.6);

    svgD3.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("cx",d=>(d.x+10))
      .attr("cy",d=>d.y)
      .attr("r",10)
      .attr("fill","#fff")
      .attr("stroke","#333");
  }
})();

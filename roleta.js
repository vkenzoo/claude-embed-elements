/* Roleta INLEAD — carregue com:  <div id="roleta-inlead"></div><script src=".../roleta.js"></script> */
(function(){
  function boot(){
  "use strict";
  var host=document.getElementById("roleta-inlead");
  if(!host || host.shadowRoot) return;

  /* fonte Poppins (fontes não são isoladas pelo shadow DOM, carrega no documento) */
  if(!document.getElementById("rl-poppins")){
    var pl=document.createElement("link");
    pl.id="rl-poppins"; pl.rel="stylesheet";
    pl.href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap";
    document.head.appendChild(pl);
  }

  var CSS = `
  :host{
    display:block;width:100%;position:relative;overflow:hidden;
    font:400 16px/1.4 'Poppins',system-ui,-apple-system,sans-serif;
    color:#1E2147;letter-spacing:normal;text-align:left;text-transform:none;
    -webkit-font-smoothing:antialiased;
    background:radial-gradient(1200px 600px at 50% -10%,#fff7ee 0%,#ffffff 55%),#ffffff;
    --orange:#F7941D;--orange-d:#EC7B1A;--orange-l:#FBB13C;--navy:#2E2A6E;
    --ink:#1E2147;--ink-soft:#5b5f7a;--green:#27B36B;--bg:#ffffff;
    --card-line:#f0e7da;--shadow:0 14px 40px rgba(34,28,60,.10);
  }
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  .wrap{max-width:460px;margin:0 auto;padding:26px 22px 18px;position:relative;z-index:2}
  .date-banner{background:linear-gradient(120deg,#332d68,#231f50);color:#fff;border-radius:16px;padding:18px 20px;text-align:center;font-weight:700;font-size:clamp(11.5px,3.4vw,14px);letter-spacing:.4px;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;box-shadow:0 10px 26px rgba(35,31,80,.28);margin-bottom:20px}
  .date-banner .cal{font-size:18px}
  .live-card{background:#fff;border:1px solid var(--card-line);border-radius:16px;padding:20px 22px;box-shadow:var(--shadow);position:relative;overflow:hidden;margin-bottom:26px}
  .live-card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(var(--orange-l),var(--orange))}
  .live-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .live-label{font-weight:700;font-size:13px;letter-spacing:.6px;color:var(--ink)}
  .live-pill{display:flex;align-items:center;gap:6px;border:1px solid #f3c79a;color:var(--orange-d);font-size:11px;font-weight:700;letter-spacing:.5px;padding:5px 11px;border-radius:999px;background:#fff7ef}
  .live-dot{width:7px;height:7px;border-radius:50%;background:var(--orange);animation:rlpulse 1.2s infinite}
  @keyframes rlpulse{0%{box-shadow:0 0 0 0 rgba(247,148,29,.55)}70%{box-shadow:0 0 0 7px rgba(247,148,29,0)}100%{box-shadow:0 0 0 0 rgba(247,148,29,0)}}
  .bar{height:9px;border-radius:999px;background:#f1ecf3;overflow:hidden;margin-bottom:16px}
  .bar > i{display:block;height:100%;width:60%;border-radius:999px;background:linear-gradient(90deg,var(--orange),var(--orange-l));position:relative;transition:width 1s cubic-bezier(.2,.7,.2,1)}
  .bar > i::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);transform:translateX(-100%);animation:rlshimmer 2s infinite}
  @keyframes rlshimmer{to{transform:translateX(100%)}}
  .count-row{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:14px}
  .count-num{font-weight:800;font-size:clamp(38px,12vw,46px);line-height:.95;color:var(--orange);letter-spacing:-1px}
  .count-meta{text-align:right;font-size:11px;font-weight:600;color:#9aa0ad;line-height:1.4;max-width:120px}
  .live-card hr{border:none;border-top:1px solid #f0eef4;margin:0 0 12px}
  .vagas-line{font-size:13.5px;color:var(--ink-soft);font-weight:500}
  .vagas-line b{color:var(--orange);font-weight:800}
  .gift{border:1px solid #f3e7d6;background:linear-gradient(#fffdf9,#fff8ef);border-radius:18px;padding:22px 20px 16px;text-align:center;margin-bottom:8px}
  .gift .ico{font-size:30px;margin-bottom:8px;display:inline-block;animation:rlbob 1.6s ease-in-out infinite}
  .gift h3{margin:0 0 6px;color:var(--orange-d);font-weight:800;font-size:18px}
  .gift p{margin:0;color:var(--ink-soft);font-size:13.5px}
  .arrows{margin-top:10px;display:flex;flex-direction:column;align-items:center;gap:0}
  .arrows span{color:#f0b878;font-size:14px;animation:rlbob 1.4s ease-in-out infinite}
  .arrows span:nth-child(2){animation-delay:.18s;opacity:.7}
  .arrows span:nth-child(3){animation-delay:.36s;opacity:.45}
  @keyframes rlbob{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}
  .wheel-zone{display:flex;flex-direction:column;align-items:center;margin:18px 0 6px;position:relative}
  .wheel-holder{position:relative;width:min(320px,82vw);aspect-ratio:1/1;height:auto}
  .pointer{position:absolute;top:-6px;left:50%;transform:translateX(-50%);z-index:6;width:0;height:0;border-left:17px solid transparent;border-right:17px solid transparent;border-top:26px solid var(--green);filter:drop-shadow(0 3px 3px rgba(0,0,0,.25));transform-origin:50% 0}
  .pointer.tick{animation:rlptick .12s ease}
  @keyframes rlptick{0%{transform:translateX(-50%) rotate(0)}50%{transform:translateX(-50%) rotate(-9deg)}100%{transform:translateX(-50%) rotate(0)}}
  #wheel{position:absolute;inset:0;width:100%;height:100%;border-radius:50%;box-shadow:0 16px 40px rgba(46,42,110,.28),inset 0 0 0 0 rgba(0,0,0,0);will-change:transform}
  .hub{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:5;width:27.5%;height:27.5%;border-radius:50%;background:radial-gradient(circle at 38% 32%,#ffb454,var(--orange) 60%,var(--orange-d));border:max(4px,1.4%) solid #fff;box-shadow:0 6px 16px rgba(236,123,26,.45);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;font-weight:800;font-size:clamp(13px,4.2vw,16px);letter-spacing:.5px;user-select:none;transition:transform .15s ease}
  .hub:active{transform:translate(-50%,-50%) scale(.95)}
  .hub.spinning{cursor:default;animation:rlhubpulse 1s ease-in-out infinite}
  @keyframes rlhubpulse{0%,100%{box-shadow:0 6px 16px rgba(236,123,26,.45)}50%{box-shadow:0 6px 26px rgba(236,123,26,.75)}}
  .hub .check{font-size:clamp(26px,9vw,34px);display:none;line-height:1}
  .hub.done .label{display:none}
  .hub.done .check{display:block;animation:rlpop .4s cubic-bezier(.2,1.5,.4,1)}
  @keyframes rlpop{0%{transform:scale(0)}100%{transform:scale(1)}}
  .wheel-note{margin-top:16px;text-align:center}
  .wheel-note .t1{font-size:12px;color:#a7a3b6;font-weight:500}
  .wheel-note .t2{font-size:13px;color:#a7a3b6;font-weight:500;margin-top:2px}
  .wheel-note .t2 b{color:#8c8aa0;font-weight:700}
  .result{margin-top:18px;opacity:0;transform:translateY(18px) scale(.96);pointer-events:none;transition:opacity .5s ease,transform .5s cubic-bezier(.2,1.1,.3,1)}
  .result.show{opacity:1;transform:none;pointer-events:auto}
  .ticket{border:2px solid #f3c08a;border-radius:22px;overflow:hidden;background:#fff;box-shadow:0 18px 44px rgba(236,123,26,.18);position:relative}
  .ticket-head{background:linear-gradient(90deg,var(--orange-d),var(--orange),var(--orange-l));color:#fff;text-align:center;font-weight:800;font-size:14px;letter-spacing:2px;padding:13px}
  .ticket-body{padding:22px 22px 24px;text-align:center;position:relative}
  .valid{position:absolute;top:14px;right:16px;width:54px;height:54px;border-radius:50%;background:var(--green);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:9px;font-weight:800;letter-spacing:.5px;transform:rotate(11deg);box-shadow:0 6px 14px rgba(39,179,107,.45)}
  .valid .vchk{font-size:18px;line-height:1}
  .party{font-size:34px;margin-bottom:2px}
  .won-label{color:#b9bccb;font-size:13px;font-weight:600;letter-spacing:4px;margin-bottom:2px}
  .won-pct{font-weight:900;color:var(--orange);line-height:1;letter-spacing:-1px}
  .won-pct .big{font-size:clamp(48px,17vw,66px)}
  .won-pct .off{font-size:clamp(20px,7vw,26px);vertical-align:top;margin-left:4px}
  .divider{position:relative;border-top:2px dashed #e7ddcf;margin:20px 6px 18px}
  .divider::before,.divider::after{content:"";position:absolute;top:50%;width:22px;height:22px;border-radius:50%;background:var(--bg);border:2px solid #f3c08a;transform:translateY(-50%)}
  .divider::before{left:-34px}
  .divider::after{right:-34px}
  .price{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px 14px;margin-bottom:18px}
  .price .old{color:#aeb2bf;text-decoration:line-through;font-weight:600;font-size:15px;white-space:nowrap}
  .price .arrow{color:#c7ccd8;font-size:18px}
  .price .new{font-weight:800;font-size:clamp(24px,8vw,30px);color:var(--ink);white-space:nowrap}
  .timer{background:#fffbe9;border:1px solid #f2e2a0;border-radius:12px;padding:13px;font-weight:700;font-size:15px;color:#b8860b;display:flex;align-items:center;justify-content:center;gap:7px}
  .timer b{color:#a9740a;font-variant-numeric:tabular-nums}
  /* sinalização (não-clicável) que aponta pro botão NATIVO da INLEAD */
  .sinal{margin-top:22px;padding-bottom:14px;text-align:center;opacity:0;transform:translateY(10px);transition:opacity .5s .2s ease,transform .5s .2s ease}
  .sinal.show{opacity:1;transform:none}
  .sinal .nudge{color:var(--orange);font-weight:800;font-size:clamp(13px,3.6vw,15px)}
  .sinal .chevs{display:flex;flex-direction:column;align-items:center;margin-top:5px}
  .sinal .chev{width:clamp(15px,4vw,18px);height:clamp(15px,4vw,18px);border-right:4px solid var(--orange);border-bottom:4px solid var(--orange);transform:rotate(45deg);margin-top:-6px;border-radius:2px;animation:rlbob 1.2s ease-in-out infinite}
  .sinal .chev:nth-child(2){animation-delay:.15s;opacity:.55}
  @keyframes rlbob{0%,100%{transform:rotate(45deg) translate(0,0)}50%{transform:rotate(45deg) translate(5px,5px)}}
  #fx{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:50}
  .money{position:absolute;z-index:48;pointer-events:none;user-select:none;line-height:1;opacity:0;will-change:transform,opacity;backface-visibility:hidden;animation:rlfloatUp var(--dur,2.8s) cubic-bezier(.22,.7,.3,1) var(--delay,0s) forwards}
  @keyframes rlfloatUp{0%{opacity:0;transform:translate3d(0,18px,0) rotate(0deg) scale(.4)}16%{opacity:1;transform:translate3d(calc(var(--dx) * .2),-16px,0) rotate(calc(var(--r) * .25)) scale(1)}100%{opacity:0;transform:translate3d(var(--dx),calc(-1 * var(--rise)),0) rotate(var(--r)) scale(.92)}}
  .hint{text-align:center;font-size:12px;color:#bdbecb;margin-top:14px}
  @media (max-width:380px){.wrap{padding:20px 14px 16px}.live-card{padding:18px 16px}.gift{padding:20px 16px 14px}.ticket-body{padding:20px 16px 22px}}
  `;

  var MARKUP = `
  <canvas id="fx"></canvas>
  <div class="wrap">
    <div class="date-banner"><span class="cal">📅</span> <span id="date-text"></span></div>
    <div class="live-card">
      <div class="live-top">
        <div class="live-label">NOVOS ALUNOS EM 2026</div>
        <div class="live-pill"><span class="live-dot"></span> AO VIVO</div>
      </div>
      <div class="bar"><i id="bar"></i></div>
      <div class="count-row">
        <div class="count-num" id="count">4.937</div>
        <div class="count-meta">META: 5000 ALUNOS EM 2026</div>
      </div>
      <hr/>
      <div class="vagas-line">Faltam apenas <b><span id="vagas">63</span> vagas</b> para bater a meta</div>
    </div>
    <div class="gift" id="gift">
      <div class="ico">🎁</div>
      <h3>Seu desconto de comemoração está aqui!</h3>
      <p>Gire a roleta e descubra seu desconto exclusivo</p>
      <div class="arrows"><span>▼</span><span>▼</span><span>▼</span></div>
    </div>
    <div class="wheel-zone">
      <div class="wheel-holder">
        <div class="pointer" id="pointer"></div>
        <canvas id="wheel" width="640" height="640"></canvas>
        <div class="hub" id="hub"><span class="label">GIRAR</span><span class="check">✓</span></div>
      </div>
      <div class="wheel-note">
        <div class="t1">Apenas uma tentativa</div>
        <div class="t2">O desconto acaba quando as <b><span id="vagas2">63</span> vagas</b> forem preenchidas.</div>
      </div>
    </div>
    <div class="result" id="result">
      <div class="ticket">
        <div class="ticket-head">★ ★ ★ PARABÉNS! ★ ★ ★</div>
        <div class="ticket-body">
          <div class="valid"><span class="vchk">✓</span>VÁLIDO</div>
          <div class="party">🎉</div>
          <div class="won-label">VOCÊ GANHOU</div>
          <div class="won-pct"><span class="big">63%</span><span class="off">OFF</span></div>
          <div class="divider"></div>
          <div class="price">
            <span class="old">De R$ 100,00</span>
            <span class="arrow">→</span>
            <span class="new">R$ 37,00</span>
          </div>
          <div class="timer">⚠️ Expira em <b id="timer">15:00</b></div>
        </div>
      </div>
      <div class="sinal" id="cta">
        <div class="nudge">Resgate no botão abaixo</div>
        <div class="chevs"><span class="chev"></span><span class="chev"></span></div>
      </div>
    </div>
    <div class="hint" id="hint">Toque em GIRAR para girar a roleta</div>
  </div>`;

  var root=host.attachShadow({mode:"open"});
  root.innerHTML="<style>"+CSS+"</style>"+MARKUP;
  var gid=function(id){ return root.getElementById(id); };

  /* ============ CONFIG ============ */
  var SEGMENTS=[
    {label:"63% OFF",c:"#F7941D"},
    {label:"40% PIX",c:"#2E2A6E"},
    {label:"20% CARTÃO",c:"#F7941D"},
    {label:"5% PIX",c:"#2E2A6E"},
    {label:"10% PIX",c:"#F7941D"},
    {label:"10% PIX",c:"#2E2A6E"},
    {label:"5% PIX",c:"#F7941D"},
    {label:"5% CARTÃO",c:"#2E2A6E"}
  ];
  var WIN_INDEX=0, SPIN_MS=5200, TURNS=6;

  /* ============ DATA DE HOJE ============ */
  (function setToday(){
    var dias=["DOMINGO","SEGUNDA-FEIRA","TERÇA-FEIRA","QUARTA-FEIRA","QUINTA-FEIRA","SEXTA-FEIRA","SÁBADO"];
    var meses=["JANEIRO","FEVEREIRO","MARÇO","ABRIL","MAIO","JUNHO","JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"];
    var d=new Date();
    gid("date-text").textContent=dias[d.getDay()]+", "+d.getDate()+" DE "+meses[d.getMonth()]+" DE "+d.getFullYear();
  })();

  /* ============ WHEEL DRAW ============ */
  var cv=gid("wheel"), ctx=cv.getContext("2d");
  var SIZE=640, R=SIZE/2, N=SEGMENTS.length, seg=(Math.PI*2)/N;
  function drawWheel(){
    ctx.clearRect(0,0,SIZE,SIZE);
    ctx.save(); ctx.translate(R,R); ctx.rotate(-Math.PI/2 - seg/2);
    for(var i=0;i<N;i++){
      var a0=i*seg, a1=a0+seg;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,R-10,a0,a1); ctx.closePath();
      ctx.fillStyle=SEGMENTS[i].c; ctx.fill();
      ctx.save(); ctx.rotate(a0);
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(R-10,0);
      ctx.lineWidth=3; ctx.strokeStyle="rgba(255,255,255,.85)"; ctx.stroke();
      ctx.beginPath(); ctx.arc(R-26,0,4.5,0,Math.PI*2);
      ctx.fillStyle="rgba(255,255,255,.9)"; ctx.fill();
      ctx.restore();
      ctx.save(); ctx.rotate(a0+seg/2);
      ctx.textAlign="right"; ctx.textBaseline="middle"; ctx.fillStyle="#fff";
      ctx.font="700 26px Poppins, sans-serif";
      ctx.shadowColor="rgba(0,0,0,.25)"; ctx.shadowBlur=3; ctx.shadowOffsetY=1;
      ctx.fillText(SEGMENTS[i].label, R-44, 0);
      ctx.restore();
    }
    ctx.restore();
    ctx.beginPath(); ctx.arc(R,R,R-6,0,Math.PI*2); ctx.lineWidth=12; ctx.strokeStyle="#EC7B1A"; ctx.stroke();
    ctx.beginPath(); ctx.arc(R,R,R-13,0,Math.PI*2); ctx.lineWidth=2; ctx.strokeStyle="rgba(255,255,255,.5)"; ctx.stroke();
  }
  drawWheel();
  // redesenha quando a fonte Poppins terminar de carregar (labels da roda)
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(drawWheel); }

  /* ============ AUDIO ============ */
  var AC=null;
  function ac(){ if(!AC){ try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){} } return AC; }
  function tick(rate){
    rate=rate||1; var a=ac(); if(!a) return;
    var o=a.createOscillator(), g=a.createGain();
    o.type="square"; o.frequency.value=1100*rate;
    g.gain.setValueAtTime(.0001,a.currentTime);
    g.gain.exponentialRampToValueAtTime(.18,a.currentTime+.004);
    g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.05);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime+.06);
  }
  function whoosh(){
    var a=ac(); if(!a) return;
    var buf=a.createBuffer(1,a.sampleRate*0.6,a.sampleRate);
    var d=buf.getChannelData(0);
    for(var i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*(1-i/d.length);
    var s=a.createBufferSource(); s.buffer=buf;
    var f=a.createBiquadFilter(); f.type="bandpass"; f.frequency.setValueAtTime(400,a.currentTime);
    f.frequency.exponentialRampToValueAtTime(2400,a.currentTime+.5);
    var g=a.createGain(); g.gain.value=.25;
    s.connect(f).connect(g).connect(a.destination); s.start();
  }
  function note(freq,t0,dur,type,vol){
    type=type||"triangle"; vol=vol==null?.25:vol;
    var a=ac(); if(!a) return;
    var o=a.createOscillator(), g=a.createGain();
    o.type=type; o.frequency.value=freq;
    g.gain.setValueAtTime(.0001,t0);
    g.gain.exponentialRampToValueAtTime(vol,t0+.02);
    g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
    o.connect(g).connect(a.destination); o.start(t0); o.stop(t0+dur+.02);
  }
  function win(){
    var a=ac(); if(!a) return; var t=a.currentTime;
    var m=[523.25,659.25,783.99,1046.5,1318.5];
    m.forEach(function(f,i){ note(f,t+i*0.10,.5,"triangle",.3); });
    note(1567.98,t+0.55,.7,"sine",.2);
  }
  function coin(t0){ var a=ac(); if(!a) return; note(987.77,t0,.08,"square",.18); note(1318.5,t0+.07,.16,"square",.18); }

  /* ============ LIVE COUNTER ============ */
  var alunos=4937, vagas=63;
  var elCount=gid("count"), elVagas=gid("vagas"), elVagas2=gid("vagas2"), elBar=gid("bar");
  function fmt(n){ return n.toLocaleString("pt-BR"); }
  function render(){
    elCount.textContent=fmt(alunos);
    elVagas.textContent=vagas; elVagas2.textContent=vagas;
    elBar.style.width=Math.min(100,(alunos/5000)*100).toFixed(1)+"%";
  }
  render();
  setInterval(function(){
    if(spinning||done) return;
    if(Math.random()<.45 && vagas>60){ alunos++; vagas--; render(); }
  },5000);

  /* ============ SPIN ============ */
  var hub=gid("hub"), pointer=gid("pointer");
  function easeOutQuart(t){ return 1-Math.pow(1-t,4); }
  var spinning=false, done=false, finished=false;

  function startSpin(){
    if(spinning||done) return;
    ac() && AC.resume && AC.resume();
    spinning=true;
    hub.classList.add("spinning");
    gid("hint").style.display="none";
    whoosh();
    var targetDeg=TURNS*360 + (360 - WIN_INDEX*(360/N));
    var start=performance.now(), lastTickSeg=-1;
    var fast=setInterval(function(){ if(vagas>59){ alunos++; vagas--; render(); } },520);
    var safety=setTimeout(function(){
      cv.style.transform="rotate("+targetDeg+"deg)";
      clearInterval(fast); finishSpin();
    }, SPIN_MS+500);
    function frame(now){
      var t=Math.min(1,(now-start)/SPIN_MS);
      var deg=targetDeg*easeOutQuart(t);
      cv.style.transform="rotate("+deg+"deg)";
      var curSeg=Math.floor(deg/(360/N));
      if(curSeg!==lastTickSeg){
        lastTickSeg=curSeg;
        var rate=0.85+(1-t)*0.6;
        tick(rate);
        pointer.classList.remove("tick"); void pointer.offsetWidth; pointer.classList.add("tick");
      }
      if(t<1){ requestAnimationFrame(frame); }
      else { clearTimeout(safety); clearInterval(fast); finishSpin(); }
    }
    requestAnimationFrame(frame);
  }

  function finishSpin(){
    if(finished) return; finished=true;
    spinning=false; done=true;
    hub.classList.remove("spinning"); hub.classList.add("done");
    gid("gift").style.display="none";
    alunos=4941; vagas=59; render();
    win(); burstConfetti(); moneyRain();
    setTimeout(function(){
      var r=gid("result");
      r.classList.add("show");
      gid("cta").classList.add("show");
      /* LIBERA botão(ões) nativos da INLEAD: marca o <body> p/ o CSS revelar */
      try{ document.body.classList.add("preco-liberado"); }catch(e){}
      r.scrollIntoView({behavior:"smooth",block:"center"});
      startCountdown(15*60);
    },350);
  }
  hub.addEventListener("click",startSpin);

  /* ============ COUNTDOWN ============ */
  function startCountdown(total){
    var el=gid("timer"), left=total;
    var id=setInterval(function(){
      left--;
      if(left<0){ clearInterval(id); el.textContent="00:00"; return; }
      var m=String(Math.floor(left/60)).padStart(2,"0");
      var s=String(left%60).padStart(2,"0");
      el.textContent=m+":"+s;
    },1000);
  }

  /* ============ CONFETTI (contido no widget) ============ */
  var fx=gid("fx"), fc=fx.getContext("2d");
  function size(){ fx.width=host.clientWidth||360; fx.height=host.clientHeight||640; }
  size(); addEventListener("resize",size);
  var conf=[], confRunning=false;
  function burstConfetti(){
    size();
    var colors=["#F7941D","#FBB13C","#2E2A6E","#27B36B","#ffd166","#ef476f","#06d6a0"];
    for(var i=0;i<160;i++){
      conf.push({
        x:fx.width/2 + (Math.random()-.5)*120,
        y:fx.height*0.32,
        vx:(Math.random()-.5)*11, vy:Math.random()*-13-4,
        g:0.32+Math.random()*0.12, s:6+Math.random()*7,
        rot:Math.random()*6.28, vr:(Math.random()-.5)*.4,
        c:colors[(Math.random()*colors.length)|0],
        life:1, shape:Math.random()<.5?0:1
      });
    }
    if(!confRunning){ confRunning=true; requestAnimationFrame(confLoop); }
  }
  function confLoop(){
    fc.clearRect(0,0,fx.width,fx.height);
    conf=conf.filter(function(p){ return p.life>0 && p.y<fx.height+40; });
    conf.forEach(function(p){
      p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.vx*=0.99; p.rot+=p.vr; p.life-=0.004;
      fc.save(); fc.translate(p.x,p.y); fc.rotate(p.rot);
      fc.globalAlpha=Math.max(0,Math.min(1,p.life*1.5)); fc.fillStyle=p.c;
      if(p.shape===0) fc.fillRect(-p.s/2,-p.s/2,p.s,p.s*0.6);
      else { fc.beginPath(); fc.arc(0,0,p.s/2,0,6.28); fc.fill(); }
      fc.restore();
    });
    if(conf.length){ requestAnimationFrame(confLoop); } else { confRunning=false; }
  }

  /* ============ MONEY RAIN (contida no widget) ============ */
  function moneyRain(){
    var icons=["💵","💰","🤑","💸","🪙","💲"], n=24;
    for(var i=0;i<n;i++){
      var s=document.createElement("span");
      s.className="money";
      s.textContent=icons[(Math.random()*icons.length)|0];
      s.style.left=(8+Math.random()*84)+"%";
      s.style.top=(42+Math.random()*30)+"%";
      s.style.fontSize=(22+Math.random()*22).toFixed(0)+"px";
      s.style.setProperty("--dx",((Math.random()-.5)*170).toFixed(0)+"px");
      s.style.setProperty("--rise",(220+Math.random()*230).toFixed(0)+"px");
      s.style.setProperty("--r",((Math.random()-.5)*140).toFixed(0)+"deg");
      s.style.setProperty("--dur",(2.4+Math.random()*1.7).toFixed(2)+"s");
      s.style.setProperty("--delay",(Math.random()*1.1).toFixed(2)+"s");
      s.addEventListener("animationend",function(){ this.remove(); });
      root.appendChild(s);
    }
  }

  /* CTA agora é só sinalização não-clicável (botão real = nativo da INLEAD) */
}
  if(document.readyState!=="loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();

/* All interactive calculations run locally. No analytics, accounts, or network calls. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const Q = window.Quantum;
  const radians = degrees => degrees * Math.PI / 180;
  const pct = (p, digits = 1) => `${(100 * p).toFixed(digits)}%`;
  const palette = { ink:'#172c2b', green:'#275c4c', sage:'#9aaf7b', lime:'#def19c', gold:'#be883d', gray:'#829077', line:'#dce2d8', purple:'#8b7aaf' };
  const chapters = [...document.querySelectorAll('[data-chapter]')];
  const chapterIds = chapters.map(el => el.dataset.chapter);
  const titles = [...document.querySelectorAll('#chapter-nav a')].map(el => el.textContent.replace(/^\s*\d+\s*/, '').trim());
  const visited = new Set();
  try { JSON.parse(localStorage.getItem('quantum-visited-v1') || '[]').filter(id => chapterIds.includes(id)).forEach(id => visited.add(id)); } catch { /* Private browsing may restrict storage. */ }
  let active = 'start';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = reducedMotion.matches;
  let heroFrame;
  let heroTime = 0;

  const mobileLayout = window.matchMedia('(max-width: 900px)');
  function syncSidebarAccess() {
    const closed = mobileLayout.matches && !$('sidebar').classList.contains('open');
    $('sidebar').inert = closed;
    if (closed) $('sidebar').setAttribute('aria-hidden', 'true'); else $('sidebar').removeAttribute('aria-hidden');
  }
  function closeMenu() { $('sidebar').classList.remove('open'); $('mobile-shade').classList.remove('open'); $('menu-toggle').setAttribute('aria-expanded', 'false'); syncSidebarAccess(); }
  $('menu-toggle').addEventListener('click', () => {
    const open = !$('sidebar').classList.contains('open');
    $('sidebar').classList.toggle('open', open); $('mobile-shade').classList.toggle('open', open);
    $('menu-toggle').setAttribute('aria-expanded', String(open));
    syncSidebarAccess();
    if (open) $('sidebar').querySelector('a').focus();
  });
  $('mobile-shade').addEventListener('click', closeMenu);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && $('sidebar').classList.contains('open')) { closeMenu(); $('menu-toggle').focus(); }
    if (event.key === 'Tab' && mobileLayout.matches && $('sidebar').classList.contains('open')) {
      const links = [...$('sidebar').querySelectorAll('a')], first=links[0], last=links[links.length-1];
      if (event.shiftKey && document.activeElement===first) {event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  mobileLayout.addEventListener('change',syncSidebarAccess);
  document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();$('main').focus();$('main').scrollIntoView();});
  function route(initial = false) {
    const requested = location.hash.slice(1);
    active = chapterIds.includes(requested) ? requested : 'start';
    const index = chapterIds.indexOf(active);
    chapters.forEach(section => { section.hidden = section.dataset.chapter !== active; });
    visited.add(active);
    try { localStorage.setItem('quantum-visited-v1', JSON.stringify([...visited])); } catch { /* Optional progress only. */ }
    document.querySelectorAll('#chapter-nav a').forEach(link => {
      const selected = link.dataset.page === active;
      link.classList.toggle('active', selected); link.classList.toggle('visited', visited.has(link.dataset.page));
      if (selected) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
    $('current-title').textContent = titles[index];
    $('progress-text').textContent = `${visited.size} / ${chapterIds.length}`;
    $('progress-fill').style.width = `${visited.size / chapterIds.length * 100}%`;
    $('page-indicator').textContent = `${String(index + 1).padStart(2, '0')} / 10`;
    const prev = $('previous-chapter'), next = $('next-chapter');
    prev.classList.toggle('invisible', index === 0); next.classList.toggle('invisible', index === chapterIds.length - 1);
    prev.href = `#${chapterIds[Math.max(0,index - 1)]}`; next.href = `#${chapterIds[Math.min(chapterIds.length - 1,index + 1)]}`;
    prev.querySelector('b').textContent = titles[Math.max(0,index - 1)];
    next.querySelector('b').textContent = titles[Math.min(chapterIds.length - 1,index + 1)];
    document.title = `${String(index).padStart(2,'0')} ${titles[index]} — 양자, 처음부터`;
    closeMenu();
    if (!initial) { window.scrollTo({ top:0, behavior:'instant' }); $('main').focus({ preventScroll:true }); }
    cancelAnimationFrame(heroFrame);
    requestAnimationFrame(() => { drawActive(); if (active === 'start' && !motionPaused) animateHero(); });
  }
  window.addEventListener('hashchange', () => route());

  function canvas(id) {
    const el = $(id), rect = el.getBoundingClientRect();
    const width = rect.width || 420, height = rect.height || 275, dpr = Math.min(window.devicePixelRatio || 1, 2);
    el.width = Math.round(width * dpr); el.height = Math.round(height * dpr);
    const ctx = el.getContext('2d'); ctx.scale(dpr,dpr);
    ctx.font = '11px system-ui, sans-serif'; ctx.lineCap='round'; ctx.lineJoin='round';
    return { ctx, width, height, el };
  }
  function line(ctx, points, color, thickness = 1.5, dash = []) {
    ctx.beginPath(); ctx.strokeStyle=color; ctx.lineWidth=thickness; ctx.setLineDash(dash);
    points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.stroke(); ctx.setLineDash([]);
  }
  function label(ctx,text,x,y,color=palette.gray,align='left',size=10) { ctx.fillStyle=color;ctx.font=`${size}px system-ui, sans-serif`;ctx.textAlign=align;ctx.fillText(text,x,y); }
  function arrow(ctx,x1,y1,x2,y2,color,width=2) {
    line(ctx,[[x1,y1],[x2,y2]],color,width); const a=Math.atan2(y2-y1,x2-x1);
    ctx.beginPath();ctx.fillStyle=color;ctx.moveTo(x2,y2);ctx.lineTo(x2-9*Math.cos(a-.4),y2-9*Math.sin(a-.4));ctx.lineTo(x2-9*Math.cos(a+.4),y2-9*Math.sin(a+.4));ctx.closePath();ctx.fill();
  }
  function probabilityBars(id, probabilities, labels = ['|0⟩','|1⟩']) {
    const container = $(id); container.replaceChildren();
    probabilities.forEach((p,index) => {
      const row=document.createElement('div');row.className='prob-row';
      const name=document.createElement('span');name.textContent=labels[index];
      const track=document.createElement('div');track.className='prob-track';const fill=document.createElement('i');fill.style.width=pct(p);track.append(fill);
      const value=document.createElement('b');value.textContent=pct(p);row.append(name,track,value);container.append(row);
    });
  }
  function sampleIndex(probabilities) {
    const draw=Math.random();let sum=0;
    for(let i=0;i<probabilities.length;i++){sum+=probabilities[i];if(draw<sum)return i;}
    return probabilities.length-1;
  }

  function drawHero() {
    const {ctx,width:w,height:h}=canvas('hero-canvas');const cx=w*.5,cy=h*.48,r=Math.min(w,h)*.335;
    ctx.save();ctx.translate(cx,cy);
    // Projected latitude rings and dotted meridians form a mathematical globe.
    const spin=heroTime*.00018,tilt=.30;
    const project=(x,y,z)=>{const a=x*Math.cos(spin)+z*Math.sin(spin),b=-x*Math.sin(spin)+z*Math.cos(spin);return[a*r,(y*Math.cos(tilt)-b*Math.sin(tilt))*r,b];};
    for(let j=-7;j<=7;j++){
      const lat=j*Math.PI/17,points=[];
      for(let i=0;i<=150;i++){const a=i/150*Math.PI*2;const [x,y]=project(Math.cos(lat)*Math.cos(a),Math.sin(lat),Math.cos(lat)*Math.sin(a));points.push([x,y]);}
      line(ctx,points,'#80976445',.65);
    }
    for(let j=0;j<28;j++)for(let i=0;i<35;i++){
      const lon=j/28*Math.PI*2,lat=(i/34-.5)*Math.PI;
      const [x,y,z]=project(Math.cos(lat)*Math.cos(lon),Math.sin(lat),Math.cos(lat)*Math.sin(lon));
      ctx.fillStyle=z>0?'#65884a90':'#97ad793c';ctx.beginPath();ctx.arc(x,y,z>0?1.15:.65,0,Math.PI*2);ctx.fill();
    }
    for(let ring=0;ring<3;ring++){
      ctx.save();ctx.rotate(-.65+ring*.75);ctx.beginPath();ctx.ellipse(0,0,r*1.2,r*.3,0,0,Math.PI*2);ctx.strokeStyle=ring===1?'#be883d85':'#6c8a4c75';ctx.lineWidth=.9;ctx.stroke();
      const a=heroTime*.00035+ring*2.1;const x=Math.cos(a)*r*1.2,y=Math.sin(a)*r*.3;ctx.fillStyle=ring===1?palette.gold:palette.green;ctx.beginPath();ctx.arc(x,y,3.2,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    line(ctx,[[-r*1.32,0],[r*1.32,0]],'#b8c5a650',.6,[3,5]);line(ctx,[[0,-r*1.32],[0,r*1.32]],'#b8c5a650',.6,[3,5]);
    ctx.restore();
  }
  let lastHeroTimestamp=0;
  function animateHero(timestamp=0) {
    if(active!=='start'||motionPaused||document.hidden)return;
    if(timestamp-lastHeroTimestamp>40){heroTime=timestamp;drawHero();lastHeroTimestamp=timestamp;}
    heroFrame=requestAnimationFrame(animateHero);
  }
  function syncMotionButton(){ $('motion-toggle').textContent=motionPaused?'애니메이션 재생 ▷':'애니메이션 일시정지 Ⅱ';$('motion-toggle').setAttribute('aria-pressed',String(motionPaused)); }
  $('motion-toggle').addEventListener('click',()=>{motionPaused=!motionPaused;syncMotionButton();cancelAnimationFrame(heroFrame);if(!motionPaused)animateHero();});
  document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(heroFrame);if(!document.hidden&&active==='start'&&!motionPaused)animateHero();});
  reducedMotion.addEventListener('change',event=>{motionPaused=event.matches;syncMotionButton();cancelAnimationFrame(heroFrame);if(!motionPaused&&active==='start')animateHero();});

  // LAB 01: simplified Gaussian-envelope two-path distribution.
  let waveDots=[];
  function waveDensity(x){const mode=$('wave-mode').value,phase=radians(+$('wave-phase').value);const envelope=Math.exp(-x*x/3);return envelope*(mode==='interference'?(1+Math.cos(7*x+phase))/2:1);}
  function drawWave(){
    const {ctx,width:w,height:h,el}=canvas('wave-canvas'),left=28,right=w-18,bottom=h-30,top=170;
    const mode=$('wave-mode').value;
    $('wave-phase-out').textContent=`${$('wave-phase').value}°`;
    $('wave-phase').disabled=mode!=='interference';
    ctx.fillStyle='#f0f3e8';ctx.fillRect(left,25,right-left,115);
    waveDots.forEach(dot=>{ctx.fillStyle='#b8873e98';ctx.beginPath();ctx.arc(left+(dot.x+3)/6*(right-left),32+dot.y*100,1.3,0,Math.PI*2);ctx.fill();});
    label(ctx,'모의 검출 스크린',left,15,palette.gray,'left',9);
    line(ctx,[[left,bottom],[right,bottom]],palette.line,1);
    const points=[];for(let i=0;i<=350;i++){const x=-3+6*i/350;points.push([left+i/350*(right-left),bottom-waveDensity(x)*(bottom-top)]);}
    ctx.beginPath();ctx.moveTo(left,bottom);points.forEach(([x,y])=>ctx.lineTo(x,y));ctx.lineTo(right,bottom);ctx.closePath();ctx.fillStyle='#9eaf7c22';ctx.fill();line(ctx,points,palette.green,1.8);
    label(ctx,'−3',left,bottom+15);label(ctx,'0',(left+right)/2,bottom+15,palette.gray,'center');label(ctx,'+3',right,bottom+15,palette.gray,'right');
    label(ctx,'검출 위치 x · 임의 단위',(left+right)/2,h-1,palette.gray,'center',9);
    $('wave-count').textContent=`모인 점 ${waveDots.length.toLocaleString('ko-KR')}개${waveDots.length===5000?' · 최대 5,000개 표시':''}`;
    el.setAttribute('aria-label',`${mode==='interference'?'간섭 무늬가 있는':'간섭 무늬가 없는'} 상대 확률 곡선. 모인 점 ${waveDots.length}개.`);
  }
  function clearWave(){waveDots=[];drawWave();}
  $('wave-phase').addEventListener('input',clearWave);$('wave-mode').addEventListener('change',clearWave);$('wave-reset').addEventListener('click',clearWave);
  $('wave-fire').addEventListener('click',()=>{
    const weights=Array.from({length:601},(_,i)=>waveDensity(-3+i/100)),sum=weights.reduce((a,b)=>a+b,0),probabilities=weights.map(v=>v/sum);
    for(let i=0;i<200;i++)waveDots.push({x:-3+sampleIndex(probabilities)/100,y:Math.random()});waveDots=waveDots.slice(-5000);drawWave();
  });

  // LAB 02: pure state and independent preparations measured in Z.
  let qubitCounts=[0,0];
  function drawQubit(){
    const theta=+$('qubit-theta').value,phi=+$('qubit-phi').value,s=Q.qubit(radians(theta),radians(phi));
    $('theta-out').textContent=`${theta}°`;$('phi-out').textContent=`${phi}°`;
    const {ctx,width:w,height:h,el}=canvas('bloch-canvas'),r=Math.min(w*.33,h*.34),cx=w/2,cy=h/2;
    const project=(x,y,z)=>[cx+r*(x*.88-y*.43),cy+r*(-z*.94+x*.08+y*.29)];
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle='#e7eed54d';ctx.fill();ctx.strokeStyle='#bccaa7';ctx.lineWidth=1;ctx.stroke();
    for(let axis=0;axis<3;axis++){
      const points=[];for(let i=0;i<=120;i++){const a=i/120*Math.PI*2;points.push(project(axis===1?0:Math.cos(a),axis===0?0:(axis===1?Math.cos(a):Math.sin(a)),axis===2?0:Math.sin(a)));}
      line(ctx,points,'#b2c19e',.7,axis===2?[]:[3,3]);
    }
    const axes=[[1,0,0,'x'],[0,1,0,'y'],[0,0,1,'|0⟩'],[0,0,-1,'|1⟩']];
    axes.forEach(([x,y,z,name])=>{const [px,py]=project(x*1.16,y*1.16,z*1.16);line(ctx,[[cx,cy],[px,py]],'#aab99a',.7,[3,4]);label(ctx,name,px+(x?8:0),py+(z>0?-5:z<0?12:0),palette.gray,'center',11);});
    const [vx,vy]=project(s.x,s.y,s.z);line(ctx,[[vx,vy],project(s.x,s.y,0)],'#99ae75',1,[3,4]);arrow(ctx,cx,cy,vx,vy,palette.green,2.5);ctx.fillStyle=palette.gold;ctx.beginPath();ctx.arc(vx,vy,4,0,Math.PI*2);ctx.fill();
    probabilityBars('qubit-bars',[s.p0,s.p1]);
    el.setAttribute('aria-label',`블로흐 구의 상태 지도: θ ${theta}도, φ ${phi}도. 0 확률 ${pct(s.p0)}, 1 확률 ${pct(s.p1)}.`);
  }
  function resetQubit(){qubitCounts=[0,0];$('qubit-result').textContent='아직 측정하지 않았습니다. 조절하면 이전 기록을 새로 시작합니다.';drawQubit();}
  ['qubit-theta','qubit-phi'].forEach(id=>$(id).addEventListener('input',resetQubit));
  document.querySelectorAll('[data-qubit]').forEach(button=>button.addEventListener('click',()=>{const[t,p]=button.dataset.qubit.split(',');$('qubit-theta').value=t;$('qubit-phi').value=p;resetQubit();}));
  $('qubit-reset').addEventListener('click',resetQubit);
  $('qubit-measure').addEventListener('click',()=>{const s=Q.qubit(radians(+$('qubit-theta').value),radians(+$('qubit-phi').value));for(let i=0;i<1000;i++)qubitCounts[Math.random()<s.p0?0:1]++;const n=qubitCounts[0]+qubitCounts[1];$('qubit-result').textContent=`총 ${n.toLocaleString('ko-KR')}회 독립 시행 · 0: ${qubitCounts[0].toLocaleString('ko-KR')}회 (${pct(qubitCounts[0]/n)}) · 1: ${qubitCounts[1].toLocaleString('ko-KR')}회 (${pct(qubitCounts[1]/n)}). 위 막대는 이론 확률입니다.`;});

  // LAB 03: H–P(phi)–H, with the final H optional.
  function drawInterference(){
    const phi=+$('interference-phase').value,hasH=$('last-h').checked,p=hasH?Q.interference(radians(phi)):{p0:.5,p1:.5};
    $('interference-out').textContent=`${phi}°`;$('phase-gate-label').textContent=`${phi}°`;$('last-h-gate').classList.toggle('disabled',!hasH);
    probabilityBars('interference-bars',[p.p0,p.p1]);
    $('interference-story').textContent=hasH?`위상 ${phi}°를 간섭시키면 0 확률 ${pct(p.p0)}, 1 확률 ${pct(p.p1)}. 마지막 H가 위상 차이를 측정 확률로 바꿉니다.`:'마지막 H가 없으면 위상을 바꿔도 Z 측정은 계속 50:50입니다. 다시 섞기 상자를 켜 보세요.';
    const {ctx,width:w,height:h,el}=canvas('interference-canvas'),l=32,r=w-15,t=25,b=h-35;
    for(let y=0;y<=1;y+=.5){line(ctx,[[l,b-y*(b-t)],[r,b-y*(b-t)]],palette.line,.7);label(ctx,`${y*100}`,l-6,b-y*(b-t)+3,palette.gray,'right',9);}
    for(let deg=0;deg<=360;deg+=90)label(ctx,`${deg}°`,l+deg/360*(r-l),b+17,palette.gray,'center',9);
    const pts0=[],pts1=[];for(let i=0;i<=360;i+=2){const s=hasH?Q.interference(radians(i)):{p0:.5,p1:.5};pts0.push([l+i/360*(r-l),b-s.p0*(b-t)]);pts1.push([l+i/360*(r-l),b-s.p1*(b-t)]);}
    line(ctx,pts0,palette.green,2);line(ctx,pts1,palette.gold,1.5,[4,3]);const cursor=l+phi/360*(r-l);line(ctx,[[cursor,t],[cursor,b]],'#798b66',1,[3,3]);
    [[p.p0,palette.green],[p.p1,palette.gold]].forEach(([v,c])=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(cursor,b-v*(b-t),4,0,Math.PI*2);ctx.fill();});
    label(ctx,'0 확률',l+8,13,palette.green,'left',9);label(ctx,'1 확률',l+66,13,palette.gold,'left',9);label(ctx,'위상 차이 φ',(l+r)/2,h-1,palette.gray,'center',9);
    el.setAttribute('aria-label',`위상 차이에 따른 확률 그래프. 마지막 H ${hasH?'있음':'없음'}. 현재 ${phi}도에서 0 확률 ${pct(p.p0)}, 1 확률 ${pct(p.p1)}.`);
  }
  $('interference-phase').addEventListener('input',drawInterference);$('last-h').addEventListener('change',drawInterference);
  document.querySelectorAll('[data-phase]').forEach(button=>button.addEventListener('click',()=>{$('interference-phase').value=button.dataset.phase;drawInterference();}));

  // LAB 04: distinguish Bell state from the classical 00/11 mixture in X.
  let bellCounts=[0,0,0,0];
  function bellDistribution(){return $('bell-state').value==='classical'&&$('bell-basis').value==='x'?[.25,.25,.25,.25]:Q.bellProbabilities();}
  function bellLabels(){return $('bell-basis').value==='x'?['++','+−','−+','−−']:['00','01','10','11'];}
  function drawBell(){
    const probabilities=bellDistribution(),labels=bellLabels(),container=$('bell-bars');container.replaceChildren();
    probabilities.forEach((p,i)=>{const bar=document.createElement('div');bar.className='four-bar';const value=document.createElement('span');value.textContent=pct(p,0);const fill=document.createElement('i');fill.style.height=`${p*200}px`;const name=document.createElement('b');name.textContent=labels[i];bar.append(value,fill,name);container.append(bar);});
  }
  function resetBell(){bellCounts=[0,0,0,0];$('bell-a').textContent='?';$('bell-b').textContent='?';$('bell-result').textContent='막대는 이론 확률입니다. 새로운 쌍을 측정해 보세요.';drawBell();}
  ['bell-state','bell-basis'].forEach(id=>$(id).addEventListener('change',resetBell));$('bell-reset').addEventListener('click',resetBell);
  $('bell-measure').addEventListener('click',()=>{
    const probabilities=bellDistribution(),labels=bellLabels();let last;
    for(let i=0;i<200;i++){last=sampleIndex(probabilities);bellCounts[last]++;}
    const text=labels[last];$('bell-a').textContent=text[0];$('bell-b').textContent=text[1];const n=bellCounts.reduce((a,b)=>a+b,0);
    $('bell-result').textContent=`총 ${n.toLocaleString('ko-KR')}쌍 · ${labels.map((label,i)=>`${label}: ${bellCounts[i]}회`).join(' / ')}. A, B 구체에는 마지막 쌍의 결과가 표시됩니다.`;
  });

  // LAB 05: actual amplitude reflections, with bounded repeated steps.
  let groverIterations=0;
  function groverState(){return Q.grover(4,+$('grover-target').value,groverIterations);}
  function drawGrover(){
    const target=+$('grover-target').value,state=groverState(),container=$('grover-doors');container.replaceChildren();
    state.probabilities.forEach((p,i)=>{const door=document.createElement('div');door.className=`door${i===target?' target':''}`;const shape=document.createElement('div');shape.textContent=i.toString(2).padStart(2,'0');const value=document.createElement('b');value.textContent=pct(p,0);const targetLabel=document.createElement('small');targetLabel.textContent=i===target?'설정한 정답':'';door.append(shape,value,targetLabel);container.append(door);});
    $('grover-iterations').textContent=groverIterations;$('grover-success').textContent=pct(state.probabilities[target],0);
    $('grover-story').textContent=groverIterations===0?'네 후보의 확률은 각각 25%. 연산을 한 번 적용해 보세요.':groverIterations%3===1?'정답 진폭의 크기가 1이 되어 이상적인 측정에서는 정답이 반드시 나옵니다. 한 번 더 누르면 어떻게 될까요?':'너무 많이 적용하면 정답 확률이 다시 줄어듭니다. 간섭을 적절한 시점에서 멈춰야 합니다.';
    $('grover-step').disabled=groverIterations>=12;
    const {ctx,width:w,height:h,el}=canvas('grover-canvas'),l=28,r=w-15,mid=h*.5,scale=h*.32;
    line(ctx,[[l,mid],[r,mid]],'#b9c6ab',1);label(ctx,'+1',4,mid-scale+3,palette.gray,'left',8);label(ctx,'−1',4,mid+scale+3,palette.gray,'left',8);
    state.amplitudes.forEach((value,i)=>{const x=l+(i+.5)/4*(r-l),barW=Math.min(35,(r-l)/7);ctx.fillStyle=i===target?palette.green:palette.sage;const y=mid-value*scale;ctx.fillRect(x-barW/2,Math.min(mid,y),barW,Math.max(1,Math.abs(value*scale)));label(ctx,(Math.abs(value)<1e-10?0:value).toFixed(2),x,value>=0?y-8:y+15,palette.green,'center',10);label(ctx,i.toString(2).padStart(2,'0'),x,h-5,palette.gray,'center',9);});
    label(ctx,'진폭 a',l,12,palette.gray,'left',9);el.setAttribute('aria-label',`그로버 연산 ${groverIterations}회 후 후보 진폭: ${state.amplitudes.map(v=>v.toFixed(2)).join(', ')}. 정답 확률 ${pct(state.probabilities[target])}.`);
  }
  function resetGrover(){groverIterations=0;$('grover-result').textContent='막대는 진폭, 문 아래 숫자는 확률입니다.';drawGrover();}
  $('grover-target').addEventListener('change',resetGrover);$('grover-reset').addEventListener('click',resetGrover);
  $('grover-step').addEventListener('click',()=>{groverIterations=Math.min(12,groverIterations+1);$('grover-result').textContent='현재 상태를 새로 계산했습니다. 측정해서 확인해 보세요.';drawGrover();});
  $('grover-measure').addEventListener('click',()=>{const index=sampleIndex(groverState().probabilities);$('grover-result').textContent=`새로 준비해 현재 회로를 실행한 측정 결과: ${index.toString(2).padStart(2,'0')}. ${index===+$('grover-target').value?'정답입니다.':'이번에는 정답이 아닙니다.'} 다음 클릭은 같은 회로를 다시 실행하는 독립 시행입니다.`;});

  // LAB 06 and companion dephasing model.
  function drawScale(){
    const n=+$('qubit-count').value,count=2**n;$('count-out').textContent=n;$('state-count').textContent=count.toLocaleString('ko-KR');$('readout-bits').textContent=`${n}비트`;
    $('scale-explanation').textContent=`${n}큐비트의 일반적인 순수 상태는 ${count.toLocaleString('ko-KR')}개의 복소수 진폭으로 표현합니다. 한 번의 Z 측정에서 이 진폭 전체를 읽는 것은 아닙니다.`;
    const grid=$('state-grid');grid.replaceChildren();for(let i=0;i<Math.min(count,256);i++)grid.append(document.createElement('i'));
    grid.setAttribute('role','img');grid.setAttribute('aria-label',`${count.toLocaleString('ko-KR')}개 기준 상태 중 ${Math.min(count,256)}개 표시`);
    $('grid-caption').textContent=count>256?`${count.toLocaleString('ko-KR')}개 중 256개만 표시`:`${count.toLocaleString('ko-KR')}개 기준 상태를 모두 표시`;
    drawNoise();
  }
  function drawNoise(){const time=+$('noise-time').value;$('noise-out').textContent=`${time} μs`;const p0=(1+Q.coherence(time))/2;probabilityBars('noise-bars',[p0,1-p0]);}
  $('qubit-count').addEventListener('input',drawScale);$('noise-time').addEventListener('input',drawNoise);

  // LAB 07: exact SI constants in an ideal two-level thermal equilibrium model.
  const tempMin=.001,tempMax=300;
  function temperatureValue(){return tempMin*Math.pow(tempMax/tempMin,+$('temperature-slider').value/1000);}
  function setTemperature(value){$('temperature-slider').value=Math.log(value/tempMin)/Math.log(tempMax/tempMin)*1000;drawTemperature();}
  function drawTemperature(){
    const temperature=temperatureValue(),probability=Q.thermal(temperature);
    $('temperature-out').textContent=`${temperature<1?temperature.toFixed(3):temperature.toFixed(2)} K`;
    $('temperature-celsius').textContent=`${(temperature-273.15).toFixed(3).replace('-','−')}°C`;
    $('thermal-percent').textContent=pct(probability,probability<.0001?7:3);$('thermal-fill').style.width=pct(probability);
  }
  $('temperature-slider').addEventListener('input',drawTemperature);document.querySelectorAll('[data-temp]').forEach(button=>button.addEventListener('click',()=>setTemperature(+button.dataset.temp)));

  // Research cards. All text is inserted as textContent, including linked source titles.
  const landscape=window.LANDSCAPE||[];
  let landscapeFilter='all';
  function externalLink(title,url){const a=document.createElement('a');a.textContent=title;a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
  function renderLandscape(){
    const query=$('landscape-search').value.toLocaleLowerCase('ko-KR').trim();
    const filtered=landscape.filter(item=>{
      const categoryMatches=landscapeFilter==='all'||item.category===landscapeFilter||(landscapeFilter==='이온'&&item.category==='이온트랩')||(landscapeFilter==='기타'&&['위상','어닐링'].includes(item.category));
      return categoryMatches&&[item.name,item.category,item.region,item.body,item.direction].join(' ').toLocaleLowerCase('ko-KR').includes(query);
    });
    const container=$('landscape-list');container.replaceChildren();$('landscape-count').textContent=`${landscape.length}개 기관·협력체 중 ${filtered.length}개 표시`;
    if(!filtered.length){const empty=document.createElement('p');empty.className='no-results';empty.textContent='일치하는 기관이 없습니다. 검색어를 줄이거나 전체 방식을 선택해 보세요.';container.append(empty);}
    filtered.forEach(item=>{
      const card=document.createElement('article');card.className='institution';
      const top=document.createElement('div');top.className='institution-top';const category=document.createElement('span');category.className='institution-category';category.textContent=`${item.category} / ${item.region}`;const status=document.createElement('span');status.className=`institution-status ${item.status==='계획'?'plan':item.status==='개발'?'develop':''}`;status.textContent=item.status;top.append(category,status);
      const title=document.createElement('h2');title.textContent=item.name;
      const milestone=document.createElement('p');milestone.className='milestone';milestone.textContent=item.title;
      const date=document.createElement('time');date.className='institution-date';date.dateTime=item.date;date.textContent=`대표 발표 ${item.date}`;
      const body=document.createElement('p');body.textContent=item.body;
      const metric=document.createElement('p');metric.className='metric';metric.textContent=item.metric;
      const caveat=document.createElement('p');caveat.className='caveat';caveat.textContent=item.caveat;
      const direction=document.createElement('p');direction.className='direction';const directionLabel=document.createElement('b');directionLabel.textContent='DEVELOPMENT DIRECTION';direction.append(directionLabel,document.createTextNode(item.direction));
      const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent=`근거 자료 ${item.sources.length}개 · 원문 보기`;details.append(summary);
      item.sources.forEach(source=>details.append(externalLink(`${source.title} · ${source.date}`,source.url)));
      card.append(top,title,milestone,date,body,metric,caveat,direction,details);container.append(card);
    });
  }
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{landscapeFilter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(other=>{const on=other===button;other.classList.toggle('active',on);other.setAttribute('aria-pressed',String(on));});renderLandscape();}));
  $('landscape-search').addEventListener('input',renderLandscape);
  function renderSources(){
    const sources=window.SOURCES||[],map=new Map(sources.map(s=>[s.id,s]));
    document.querySelectorAll('[data-cites]').forEach(el=>{const intro=document.createElement('span');intro.textContent='근거 · 더 읽기';el.append(intro);el.dataset.cites.split(',').forEach(id=>{const source=map.get(id);if(source)el.append(externalLink(source.title,source.url));});});
    const all=sources.concat(landscape.flatMap(item=>item.sources.map((source,index)=>({id:`${item.id}-${index}`,title:source.title,organization:item.name,url:source.url,date:source.date,note:`8장 ${item.name}의 대표 성과·현황·계획의 근거 자료입니다.`}))));
    const seen=new Set(),container=$('sources-list');let number=0;
    all.forEach(source=>{if(seen.has(source.url))return;seen.add(source.url);number++;const item=document.createElement('div');item.className='source-item';item.id=`source-${source.id}`;const n=document.createElement('span');n.textContent=String(number).padStart(2,'0');const content=document.createElement('div');content.append(externalLink(source.title,source.url));const p=document.createElement('p');p.textContent=source.note;const meta=document.createElement('small');meta.textContent=`${source.organization} · 발표 ${source.date} · 확인 2026.11.07`;content.append(p,meta);item.append(n,content);container.append(item);});
  }

  const quizItems=[
    {text:'큐비트 10개를 한 번 측정하면 1,024개의 답을 전부 읽을 수 있다.',answer:false,explanation:'10큐비트에는 1,024개 기준 상태의 진폭이 있지만 한 번의 Z 측정에서 얻는 것은 10자리 비트열 하나입니다.'},
    {text:'중첩의 상대 위상은 간섭을 거치면 측정 확률에 영향을 줄 수 있다.',answer:true,explanation:'H–P–H 실험처럼 위상을 바꾼 뒤 다시 섞으면 확률이 달라집니다. 중첩을 계산에 활용하는 핵심입니다.'},
    {text:'얽힌 두 큐비트를 이용하면 원하는 메시지를 빛보다 빠르게 보낼 수 있다.',answer:false,explanation:'각자의 측정 결과는 무작위입니다. 두 결과를 비교하려면 고전적인 통신이 필요합니다.'},
    {text:'0 K는 −273.15°C이며, 모든 양자컴퓨터가 그 온도에서 작동해야 하는 것은 아니다.',answer:true,explanation:'0 K는 절대영도이고, 정확히 도달하지는 못합니다. 초전도 칩과 이온·원자·광자 시스템은 냉각 대상과 조건이 다릅니다.'},
    {text:'물리 큐비트가 1,000개인 장치는 논리 큐비트 100개인 장치보다 반드시 뛰어나다.',answer:false,explanation:'서로 다른 지표입니다. 오류율, 오류정정 코드, 게이트·연결 구조와 목표 계산을 함께 봐야 합니다.'},
    {text:'양자컴퓨터의 이점은 문제와 알고리즘, 실제 구현 비용에 따라 달라진다.',answer:true,explanation:'특정 문제에서의 가속이 모든 계산의 가속을 뜻하지는 않습니다. 고전컴퓨터와 함께 사용하는 도구로 보는 것이 정확합니다.'}
  ];
  let quizAnswers=new Map();
  function renderQuiz(){const container=$('quiz-questions');container.replaceChildren();quizItems.forEach((item,index)=>{
    const block=document.createElement('div');block.className='quiz-question';const question=document.createElement('p');question.id=`quiz-question-${index}`;question.textContent=`${index+1}. ${item.text}`;
    const options=document.createElement('div');options.className='quiz-options';options.setAttribute('role','group');options.setAttribute('aria-labelledby',question.id);
    [true,false].forEach(answer=>{const button=document.createElement('button');button.textContent=answer?'맞다 O':'아니다 X';button.setAttribute('aria-pressed',String(quizAnswers.get(index)===answer));button.classList.toggle('chosen',quizAnswers.get(index)===answer);button.addEventListener('click',()=>{quizAnswers.set(index,answer);updateQuizQuestion(block,index);});options.append(button);});
    block.append(question,options);container.append(block);updateQuizQuestion(block,index);
  });updateQuizScore();}
  function updateQuizQuestion(block,index){const item=quizItems[index],answer=quizAnswers.get(index);block.querySelectorAll('.quiz-options button').forEach((button,i)=>{const selected=answer===(i===0);button.classList.toggle('chosen',selected);button.setAttribute('aria-pressed',String(selected));});let explanation=block.querySelector('.quiz-explanation');if(answer!==undefined){if(!explanation){explanation=document.createElement('p');explanation.className='quiz-explanation';explanation.setAttribute('aria-live','polite');block.append(explanation);}explanation.classList.toggle('incorrect',answer!==item.answer);explanation.textContent=`${answer===item.answer?'맞았습니다.':'다시 생각해 보세요.'} ${item.explanation}`;}updateQuizScore();}
  function updateQuizScore(){const correct=[...quizAnswers].filter(([index,answer])=>quizItems[index].answer===answer).length;$('quiz-score').textContent=quizAnswers.size?`${quizAnswers.size} / 6문항 응답 · ${correct}문항 정답${quizAnswers.size===6?' · 해설을 읽고 궁금한 장을 다시 실험해 보세요.':''}`:'각 문장이 맞는지 틀린지 골라 보세요.';}
  $('quiz-reset').addEventListener('click',()=>{quizAnswers=new Map();renderQuiz();});
  $('print-button').addEventListener('click',()=>window.print());

  const drawing={start:drawHero,waves:drawWave,qubit:drawQubit,interference:drawInterference,entanglement:drawBell,algorithm:drawGrover,scale:drawScale,temperature:drawTemperature};
  function drawActive(){drawing[active]?.();}
  let resizeTimeout;window.addEventListener('resize',()=>{clearTimeout(resizeTimeout);resizeTimeout=setTimeout(drawActive,120);});
  // Print all chapters and all research records, even if a filter was selected.
  let printRestore;
  window.addEventListener('beforeprint',()=>{
    printRestore={filter:landscapeFilter,query:$('landscape-search').value,hidden:chapters.map(el=>el.hidden)};
    chapters.forEach(el=>{el.hidden=false;});landscapeFilter='all';$('landscape-search').value='';renderLandscape();Object.values(drawing).forEach(draw=>draw());
  });
  window.addEventListener('afterprint',()=>{if(!printRestore)return;chapters.forEach((el,i)=>{el.hidden=printRestore.hidden[i];});landscapeFilter=printRestore.filter;$('landscape-search').value=printRestore.query;renderLandscape();drawActive();});
  renderLandscape();renderSources();renderQuiz();syncMotionButton();setTemperature(.015);route(true);
})();

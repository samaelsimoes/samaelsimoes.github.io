(() => {
  'use strict';
  document.getElementById('year').textContent = new Date().getFullYear();
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('navigation');
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); menu.focus(); } });
  const layers = {
    interface: ['CAMADA 01 / FRONT-END', 'Clareza para quem está do outro lado.', 'Uma interface traduz a complexidade do sistema em ações compreensíveis. Estados de carregamento, validação e acessibilidade fazem parte da experiência.', 'const resultado = await api.enviar(dados);\ninterface.exibir(resultado);'],
    api: ['CAMADA 02 / INTEGRAÇÃO', 'Um contrato claro entre sistemas.', 'A API recebe a solicitação, verifica seu formato e encaminha a ação. Autenticação, respostas consistentes e tratamento de erros ajudam a manter essa comunicação confiável.', 'POST /api/solicitacoes\nautenticar(usuario);\nvalidar(entrada);\nreturn servico.executar(entrada);'],
    business: ['CAMADA 03 / DOMÍNIO', 'O negócio dá sentido ao código.', 'É aqui que as regras do contexto são aplicadas: o que pode acontecer, em quais condições e com quais consequências. Separar essas decisões facilita a evolução do software.', 'const solicitacao = validarRegras(entrada);\nawait repositorio.salvar(solicitacao);\nreturn { status: "concluido" };'],
    data: ['CAMADA 04 / PERSISTÊNCIA', 'Dados que preservam a história.', 'A persistência organiza e recupera informações. Modelagem, transações e índices precisam acompanhar as necessidades de integridade e consulta de cada aplicação.', 'BEGIN;\nINSERT INTO solicitacoes (...);\nCOMMIT;\n-- Integridade antes de tudo.']
  };
  document.querySelectorAll('[data-layer]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-layer]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const content = layers[button.dataset.layer];
    ['layer-tag','layer-title','layer-description','layer-code'].forEach((id,index) => { document.getElementById(id).textContent = window.portfolioI18n.translate(content[index]); });
  }));
  function refreshLayer() { const selected = document.querySelector('[data-layer][aria-pressed="true"]'); if (selected) selected.click(); }
  document.addEventListener('portfolio-language', refreshLayer);
  refreshLayer();
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.hero');
  const journey = document.querySelector('.universe-journey');
  const heroContent = document.querySelector('.hero-content');
  let contentHidden = false, pixelRatio = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!ctx) return;
  let paused = reduced.matches, visible = true, frame = null, last = 0, time = 0;
  let width = 0, height = 0, points = [], stars = [], progress = 0, targetProgress = 0;
  const pointer = { x: -1000, y: -1000 };
  const clamp = (v,min=0,max=1) => Math.max(min,Math.min(max,v));
  const smooth = v => { v=clamp(v); return v*v*(3-2*v); };
  function updateScroll() {
    const rect = journey.getBoundingClientRect();
    targetProgress = reduced.matches ? 0 : clamp(-rect.top / Math.max(1,journey.offsetHeight-innerHeight));
    if (paused) progress = targetProgress;
    if (paused) draw(0);
  }
  function applyProgress() {
    hero.style.setProperty('--journey',progress);
    const hidden = progress > .24;
    if (hidden !== contentHidden) { heroContent.inert = hidden; contentHidden = hidden; }
    hero.style.setProperty('--departure',smooth(progress/.24));
    hero.style.setProperty('--arrival',smooth((progress-.83)/.14));
  }
  function resize() {
    const nextWidth=canvas.clientWidth,nextHeight=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
    if(nextWidth===width&&nextHeight===height&&dpr===pixelRatio)return;
    width=nextWidth;height=nextHeight;pixelRatio=dpr;
    canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=width<700?220:420;
    points=Array.from({length:count},(_,i)=>({i,theta:i*2.399963,y:1-2*(i+.5)/count,seed:Math.random(),x:Math.random()*width,y2:Math.random()*height,z:0}));
    stars=Array.from({length:width<700?100:210},(_,i)=>({x:((i*0.61803398875)%1)*width,y:((i*0.41421356237)%1)*height,size:.35+(i%5)*.23,phase:i*1.731}));
    updateScroll();draw(0);start();
  }
  function draw(dt) {
    time+=dt*.003;
    progress += (targetProgress-progress)*(paused?1:1-Math.exp(-.14*Math.max(dt,1)));
    if(Math.abs(targetProgress-progress)<.0001)progress=targetProgress;
    applyProgress();
    ctx.clearRect(0,0,width,height);
    const mobile=width<700, cx=width*(mobile?.51:.77), cy=height*(mobile?.65:.47);
    const radius=Math.min(width*(mobile?.38:.235),height*.31);
    const collapse=smooth(progress/.65), rotation=time+progress*6;
    const centerX=cx+(width/2-cx)*smooth(progress/.4), centerY=cy+(height*.5-cy)*smooth(progress/.4);
    const projected=[];
    const sphereVisibility=1-smooth((progress-.11)/.19);
    // A quiet, distant star field establishes scale before the camera moves.
    for(const star of stars){
      const shiftX=pointer.x>-100?(pointer.x/width-.5)*10:0;
      const shiftY=pointer.y>-100?(pointer.y/height-.5)*10:0;
      const brightness=(.16+(Math.sin(time*.8+star.phase)+1)*.09)*(1-smooth((progress-.4)/.2));
      ctx.fillStyle='rgba(196,219,236,'+brightness+')';ctx.beginPath();ctx.arc(star.x+shiftX,star.y+shiftY,star.size,0,Math.PI*2);ctx.fill();
    }
    const halo=ctx.createRadialGradient(centerX,centerY,0,centerX,centerY,radius*1.8);
    halo.addColorStop(0,'rgba(90,211,167,0.02)');halo.addColorStop(.45,`rgba(100,220,173,${.05+collapse*.08})`);halo.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
    for(const p of points){
      const ring=Math.sqrt(1-p.y*p.y);let x=Math.cos(p.theta)*ring,y=p.y,z=Math.sin(p.theta)*ring;
      const rx=x*Math.cos(rotation)+z*Math.sin(rotation),rz=-x*Math.sin(rotation)+z*Math.cos(rotation);
      const tilt=.22, ry=y*Math.cos(tilt)-rz*Math.sin(tilt), zz=y*Math.sin(tilt)+rz*Math.cos(tilt);
      const perspective=3.3/(3.3-zz),scale=radius*perspective;
      let tx=centerX+rx*scale,ty=centerY+ry*scale;
      if(collapse>0){const angle=p.theta+time*(.4+p.seed)+progress*12;const r=radius*(.25+p.seed*1.1);const bx=centerX+Math.cos(angle)*r*1.6,by=centerY+Math.sin(angle)*r*.39;tx+=(bx-tx)*collapse;ty+=(by-ty)*collapse;}
      const flight=smooth((progress-.73)/.27); tx=centerX+(tx-centerX)*(1+flight*5);ty=centerY+(ty-centerY)*(1+flight*5);
      const dist=Math.hypot(tx-pointer.x,ty-pointer.y);if(dist<100&&!paused){const force=(1-dist/100)*20;tx+=(tx-pointer.x)/(dist||1)*force;ty+=(ty-pointer.y)/(dist||1)*force;}
      const ease=paused?1:Math.min(1,.045*Math.max(dt,1));p.x+=(tx-p.x)*ease;p.y2+=(ty-p.y2)*ease;p.z=zz;
      projected.push({x:p.x,y:p.y2,z:zz,alpha:(.3+(zz+1)*.28)*(1-flight*.8),r:(.7+(zz+1)*.65),i:p.i});
    }
    for(let i=0;i<projected.length;i++){const p=projected[i];for(let j=i+1;j<Math.min(projected.length,i+22);j++){const q=projected[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<radius*.29&&Math.abs(p.z-q.z)<.6){ctx.strokeStyle=`rgba(139,224,190,${(1-d/(radius*.29))*.25*(1-collapse*.6)*(1-progress*.5)*sphereVisibility})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}ctx.fillStyle=`rgba(${p.i%9===0?'226,255,238':'139,224,190'},${p.alpha*sphereVisibility})`;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}


    const approach=smooth((progress-.27)/.3);
    const crossing=smooth((progress-.53)/.1);
    const exit=smooth((progress-.76)/.2);
    // Fine orbital paths and travelling energy packets give the sphere a signature.
    const orbitAlpha=(1-smooth(progress/.23));
    if(orbitAlpha>.001){
      ctx.save();ctx.translate(centerX,centerY);ctx.globalCompositeOperation='lighter';
      for(let orbit=0;orbit<3;orbit++){
        const angle=-.55+orbit*.7;
        ctx.save();ctx.rotate(angle);
        ctx.strokeStyle='rgba(155,228,201,'+orbitAlpha*.22+')';ctx.lineWidth=.6;
        ctx.beginPath();ctx.ellipse(0,0,radius*1.13,radius*(.3+orbit*.12),0,0,Math.PI*2);ctx.stroke();
        const phase=time*(orbit%2?-.9:.65)+orbit*2;
        const px=Math.cos(phase)*radius*1.13,py=Math.sin(phase)*radius*(.3+orbit*.12);
        ctx.shadowColor='#adffda';ctx.shadowBlur=14;ctx.fillStyle='rgba(214,255,236,'+orbitAlpha+')';ctx.beginPath();ctx.arc(px,py,2.4,0,Math.PI*2);ctx.fill();ctx.restore();
      }
      ctx.restore();
    }

    if(progress>.045 && progress<.67){
      const strength=smooth((progress-.045)/.16)*(1-crossing);
      const hole=radius*(.24+approach*3.1), flatten=.23+approach*.55;
      const spin=time*.75+progress*2, tau=Math.PI*2;
      ctx.save();ctx.translate(centerX,centerY);ctx.rotate(-.23*(1-approach));
      // Emission is concentrated in a thin, turbulent accretion disk.
      ctx.save();ctx.scale(1,flatten);
      const gas=ctx.createRadialGradient(0,0,hole,0,0,hole*4.4);
      gas.addColorStop(0,'rgba(193,235,255,0)');
      gas.addColorStop(.12,'rgba(104,169,255,'+strength*.32+')');
      gas.addColorStop(.42,'rgba(47,72,158,'+strength*.13+')');
      gas.addColorStop(1,'rgba(14,24,70,0)');
      ctx.fillStyle=gas;ctx.fillRect(-hole*5,-hole*5,hole*10,hole*10);ctx.restore();
      ctx.globalCompositeOperation='lighter';
      const bands=mobile?48:78;
      for(let band=0;band<bands;band++){
        const lane=band/bands,r=hole*(1.08+lane*3.1);
        for(let j=0;j<20;j++){
          const a=j*tau/20;
          const beam=.17+.83*Math.pow((Math.cos(a+.5)+1)/2,2);
          const noise=.18+.82*Math.pow((Math.sin(band*1.7+j*.8+spin/(.3+lane))+1)/2,2);
          const alpha=strength*Math.pow(1-lane,1.8)*beam*noise*.7;
          ctx.strokeStyle='rgba('+(lane<.13?'225,248,255':lane<.4?'125,195,255':'54,88,166')+','+alpha+')';
          ctx.lineWidth=Math.max(.65,hole*(.012+lane*.018));
          ctx.beginPath();ctx.ellipse(0,0,r,r*flatten,0,a,a+tau/20*.87);ctx.stroke();
        }
      }
      // A lensed image of the far disk rises above the central shadow.
      const lensBands=mobile?38:62;
      for(let j=0;j<lensBands;j++){
        const lane=j/lensBands,r=hole*(1.025+lane*.64);
        const alpha=strength*Math.pow(1-lane,1.6)*.48;
        ctx.strokeStyle='rgba('+(lane<.15?'228,251,255':lane<.45?'137,214,255':'62,102,195')+','+alpha+')';
        ctx.lineWidth=Math.max(.7,hole*.014);
        ctx.beginPath();ctx.ellipse(0,0,r,r*(1.01+lane*.09),0,Math.PI,Math.PI*2);ctx.stroke();
        ctx.strokeStyle='rgba(123,173,249,'+alpha*.24+')';
        ctx.beginPath();ctx.ellipse(0,0,r,r*.98,0,0,Math.PI);ctx.stroke();
      }
      for(let k=0;k<(mobile?480:900);k++){
        const lane=(k*.61803398875)%1,r=hole*(1.1+lane*3);
        const a=k*2.399963+spin/(.25+lane);
        ctx.strokeStyle='rgba(176,224,255,'+strength*(1-lane)*(.08+.3*Math.pow((Math.cos(a+.5)+1)/2,2))+')';
        ctx.lineWidth=.5+(1-lane)*.8;
        ctx.beginPath();ctx.ellipse(0,0,r,r*flatten,0,a,a+.01+(1-lane)*.045);ctx.stroke();
      }
      ctx.globalCompositeOperation='source-over';
      ctx.fillStyle='rgba(1,2,3,'+strength+')';ctx.beginPath();ctx.arc(0,0,hole,0,tau);ctx.fill();
      // Narrow photon ring, with diffuse light falling off outside the shadow.
      const rim=ctx.createRadialGradient(0,0,hole*.995,0,0,hole*1.14);
      rim.addColorStop(0,'rgba(0,0,0,0)');
      rim.addColorStop(.1,'rgba(225,251,255,'+strength*.85+')');
      rim.addColorStop(.23,'rgba(124,207,255,'+strength*.25+')');
      rim.addColorStop(1,'rgba(64,117,223,0)');
      ctx.fillStyle=rim;ctx.beginPath();ctx.arc(0,0,hole*1.14,0,tau);ctx.fill();
      // Individual orbiting grains replace the hard foreground band.
      ctx.save();ctx.globalCompositeOperation='lighter';
      const grains=mobile?300:600;
      for(let k=0;k<grains;k++){
        const seed=(k*.61803398875)%1;
        const phase=(seed+time*.035/(.35+(k%17)/17))%1;
        const r=hole*(1.18+Math.pow(1-phase,.8)*3.6);
        const angle=k*2.399963+spin/(.35+seed)+phase*3.5;
        const thickness=Math.sin(k*1.73+time*.4)*hole*(.025+seed*.11);
        const x=Math.cos(angle)*r,y=Math.sin(angle)*r*flatten+thickness;
        // Far-side particles disappear behind the shadow.
        if(x*x+y*y<hole*hole*1.035)continue;
        const fade=Math.sin(phase*Math.PI)*(.2+(1-seed)*.65)*strength;
        const trail=.012+(1-seed)*.032;
        const tx=Math.cos(angle-trail)*r,ty=Math.sin(angle-trail)*r*flatten+thickness;
        ctx.strokeStyle='rgba(147,207,255,'+fade*.62+')';
        ctx.lineWidth=.45+(1-seed)*.8;
        ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(x,y);ctx.stroke();
        ctx.fillStyle='rgba(213,242,255,'+fade+')';
        ctx.beginPath();ctx.arc(x,y,.45+(1-seed)*.9,0,tau);ctx.fill();
      }
      ctx.restore();ctx.restore();
    }
    if(progress>.52){
      const inside=smooth((progress-.52)/.09)*(1-exit);
      ctx.fillStyle='rgba(3,6,13,'+inside*.96+')';ctx.fillRect(0,0,width,height);
      const tunnel=smooth((progress-.56)/.22);
      const travel=tunnel*3.6+time*.045;
      const maxRadius=Math.hypot(width,height)*.65;
      for(let k=0;k<(mobile?150:260);k++){
        const angle=k*2.399963+progress*.7+Math.sin(k*.3+tunnel*2)*.06;
        const depth=(k*.037+travel)%1;
        const r=26/(1.025-depth);
        const spread=r*(maxRadius/430);
        const stretch=(15+tunnel*100)*depth*depth;
        const bendX=Math.sin(tunnel*3.5)*width*.055*(1-exit);
        const bendY=Math.sin(tunnel*2.2)*height*.04*(1-exit);
        const x=width/2+bendX*(1-depth)+Math.cos(angle)*spread,y=height/2+bendY*(1-depth)+Math.sin(angle)*spread;
        ctx.strokeStyle='rgba('+(k%5===0?'180,168,255':'153,244,209')+','+inside*depth*.85+')';ctx.lineWidth=.5+depth*1.4;
        ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.cos(angle+.05)*stretch*.5,y+Math.sin(angle+.05)*stretch*.5,x+Math.cos(angle+.07)*stretch,y+Math.sin(angle+.07)*stretch);ctx.stroke();
      }
      for(let k=0;k<24;k++){
        const depth=(k/24+travel*.15)%1;
        const r=30+depth*depth*maxRadius;
        ctx.strokeStyle='rgba(119,179,191,'+inside*(1-depth)*.16+')';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(width/2,height/2,r,r*(.84+Math.sin(k*.8+tunnel)*.05),progress*.3,0,Math.PI*2);ctx.stroke();
      }
      // The exit opens gently; no full-screen flash.
      if(exit>0){
        const glow=ctx.createRadialGradient(width/2,height/2,0,width/2,height/2,maxRadius*exit);
        glow.addColorStop(0,'rgba(155,233,201,'+Math.sin(exit*Math.PI)*.2+')');glow.addColorStop(1,'rgba(10,14,19,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
        for(let k=0;k<110;k++){
          const angle=k*2.399963,r=(.15+(k*.061)%1)*maxRadius;
          ctx.fillStyle='rgba(183,235,215,'+exit*.6+')';ctx.beginPath();ctx.arc(width/2+Math.cos(angle)*r,height/2+Math.sin(angle)*r,.6+(k%3)*.4,0,Math.PI*2);ctx.fill();
        }
      }
    }
  }
  function animate(now){frame=null;const dt=last?Math.min((now-last)/16.667,2):1;last=now;draw(dt);start();}
  function start(){if(!paused&&visible&&!document.hidden&&frame===null)frame=requestAnimationFrame(animate);}
  function stop(){if(frame!==null)cancelAnimationFrame(frame);frame=null;last=0;}
  reduced.addEventListener('change',e=>{paused=e.matches;updateScroll();if(paused){stop();draw(0);}else start();});
  hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const rect=canvas.getBoundingClientRect();pointer.x=e.clientX-rect.left;pointer.y=e.clientY-rect.top;});
  hero.addEventListener('pointerleave',()=>{pointer.x=pointer.y=-1000;});
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  window.addEventListener('scroll',updateScroll,{passive:true});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();}).observe(hero);
  new ResizeObserver(resize).observe(canvas);
})();

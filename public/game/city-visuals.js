/* Original D6X8 city art and camera controls. No remote assets or paid services. */
(function(root){
'use strict';
root.createCityVisuals=function({THREE,scene,renderer,camera,box,softBox,cyl,sphere,mat,canvas}){
  const cars=[],nightMaterials=[],decorations=new THREE.Group();scene.add(decorations);
  const metal=mat('#536578',.65,.35),stone=mat('#e7e6dc',0,.78);
  const glass=Array.from({length:5},(_,i)=>{const m=new THREE.MeshStandardMaterial({color:['#2b6886','#357d9b','#25526e','#4b91aa','#326d8a'][i],metalness:.3,roughness:.26,emissive:'#ffe1a0',emissiveIntensity:0});nightMaterials.push(m);return m});
  const foliage=['#246e43','#358650','#4b9658','#67a862'];
  let profile='balanced',lastNight=null;
  function decorateBuilding(group,w,h,d,kind){
    const house=/house/i.test(kind),home=/house|apartment/i.test(kind),accent=mat(home?'#f0e1c6':'#c9dce1',.05,.6);
    // Side facades have actual frames, floor bands and roof silhouettes.
    for(let side of [-1,1]){
      box(side*(w/2+.035),.45,0,.09,.55,d+.1,stone,group);
      box(side*(w/2+.06),h-.12,0,.12,.22,d+.2,accent,group);
      for(let y=1.65;y<h-.6;y+=2.65)for(let z of [-d*.28,d*.28]){
        box(side*(w/2+.075),y,z,.04,1.25,1.2,glass[Math.abs(Math.round(w+h+z))%5],group);
        box(side*(w/2+.1),y-.67,z,.16,.1,1.4,accent,group);
        box(side*(w/2+.11),y,z,.035,1.3,.055,stone,group);
      }
    }
    for(let x of [-w/2+.15,w/2-.15])box(x,h/2,d/2+.095,.17,h,.12,accent,group);
    for(let y=3.15;y<h-.4;y+=2.65)box(0,y,d/2+.105,w,.1,.15,accent,group);
    // Front glazing and trim establish a stronger facade from street level.
    for(let y=1.7;y<h-.55;y+=2.65)for(let side of [-1,1]){
      const x=side*w*.30;box(x,y,d/2+.15,1.34,1.36,.055,glass[Math.abs(Math.round(x+h))%5],group);
      for(let edge of [-1,1])box(x+edge*.69,y,d/2+.18,.065,1.45,.065,stone,group);
      box(x,y,d/2+.19,1.4,.06,.05,stone,group);box(x,y,d/2+.20,.06,1.4,.04,stone,group);
      if(house)for(let edge of [-1,1]){box(x+edge*.88,y,d/2+.14,.28,1.44,.10,'#315b69',group);for(let n=0;n<5;n++)box(x+edge*.88,y-.5+n*.24,d/2+.21,.27,.025,.02,'#568591',group)}
    }
    if(house){
      box(0,2.75,d/2+.45,2.7,.14,.92,'#f2e8d6',group);
      for(let side of [-1,1]){box(side*1.22,1.4,d/2+.57,.12,2.7,.12,'#f7eee0',group);cyl(side*1.4,.3,d/2+.28,.18,.38,'#b95e43',group);sphere(side*1.4,.58,d/2+.28,.28,.32,.28,foliage[1],group)}
    }else if(/apartment/i.test(kind)){
      for(let y=4.4;y<h-.5;y+=2.65)for(let side of [-1,1]){box(side*w*.30,y-.65,d/2+.35,1.9,.12,.65,'#d3dedf',group);box(side*w*.30,y-.25,d/2+.62,1.9,.6,.055,'#476f82',group);}
    }
    // Rooftop equipment stays inside the existing building footprint.
    if(!/house/i.test(kind)){
      box(0,h+.2,0,w*.48,.32,d*.42,metal,group);
      for(let x of [-w*.22,w*.22]){box(x,h+.65,-d*.2,1.15,.6,1.1,'#b3c0bf',group);for(let n=0;n<4;n++)box(x-.36+n*.24,h+.96,-d*.2,.06,.025,.83,metal,group)}
      for(let x of [-w/2+.1,w/2-.1])box(x,h+.32,0,.16,.5,d,accent,group);
      box(0,h+.32,-d/2+.1,w,.5,.16,accent,group);
    }
    if(!home){
      for(let x=-w/2+.5;x<w/2-.4;x+=.65)box(x,2.73,d/2+.43,.63,.13,.78,(Math.round((x+w)*10)%2)?'#e2c08b':'#446e7a',group);
    }
    // Shallow flower boxes do not intrude into doorways or pedestrian routes.
    for(let x of [-w*.32,w*.32]){
      box(x,.35,d/2+.17,1,.38,.3,'#aa8b69',group);
      for(let n=0;n<3;n++)sphere(x-.28+n*.28,.65,d/2+.17,.19,.25,.16,foliage[n],group);
    }
  }
  function tree(x,z,parent=scene){
    const shade=foliage[Math.abs(Math.round(x*3+z))%foliage.length];
    cyl(x,1.35,z,.15,2.7,'#735943',parent);
    for(let side of [-1,1]){let branch=cyl(x+side*.23,2.08,z,.075,1.25,'#735943',parent);branch.rotation.z=-side*.5}
    sphere(x,3.4,z,1.05,1.5,1.05,shade,parent);
    for(let i=0;i<5;i++){let a=i*Math.PI*2/5;sphere(x+Math.cos(a)*.72,2.85+(i%2)*.33,z+Math.sin(a)*.72,.78,.92,.78,foliage[(i+Math.abs(Math.round(x)))%4],parent)}
    box(x,.095,z,1.65,.16,1.65,'#d2c8af',parent);box(x,.185,z,1.42,.025,1.42,'#607953',parent);
  }
  const bodyShape=new THREE.Shape();bodyShape.moveTo(-1.78,.40);bodyShape.lineTo(-1.78,.73);bodyShape.lineTo(-1.38,.94);bodyShape.lineTo(-.8,1.02);bodyShape.lineTo(.65,1.02);bodyShape.lineTo(1.48,.87);bodyShape.lineTo(1.78,.66);bodyShape.lineTo(1.70,.40);bodyShape.closePath();
  const bodyGeometry=new THREE.ExtrudeGeometry(bodyShape,{depth:1.62,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.055,bevelThickness:.045});bodyGeometry.translate(0,0,-.81);
  function carBody(g,color,truck){if(truck){softBox(0,.66,0,4.6,.75,1.65,mat(color,.3,.32),g);return}let body=new THREE.Mesh(bodyGeometry,mat(color,.42,.27));body.castShadow=true;body.receiveShadow=true;g.add(body);for(let side of [-1,1]){let hood=softBox(1.05,.94,side*.36,.9,.08,.68,mat(color,.42,.27),g);hood.rotation.z=-.10;box(-.23,1.61,side*.68,1.9,.055,.045,'#cad9de',g)}}
  const tireGeometry=new THREE.CylinderGeometry(1,1,1,16),rimGeometry=new THREE.CylinderGeometry(1,1,1,12);
  function enhanceCar(g,truck){
    const trim=mat('#d6e0de',.8,.27),rubber=mat('#253039',0,.95);const wheels=[];
    for(let x of truck?[-1.7,1.7]:[-1.1,1.1])for(let side of [-1,1]){
      let tire=new THREE.Mesh(tireGeometry,rubber);tire.position.set(x,.43,side*.84);tire.scale.set(.365,.21,.365);tire.rotation.x=Math.PI/2;g.add(tire);
      let rim=new THREE.Mesh(rimGeometry,trim);rim.position.set(x,.43,side*.96);rim.scale.set(.225,.035,.225);rim.rotation.x=Math.PI/2;g.add(rim);wheels.push(rim);
      for(let n=0;n<5;n++){let a=n*Math.PI*2/5;let spoke=box(Math.cos(a)*.57,0,Math.sin(a)*.57,.65,.9,.08,metal,rim);spoke.rotation.y=-a}
    }
    for(let side of [-1,1]){
      softBox(truck?1.4:.45,1.35,side*.91,.28,.15,.2,metal,g);
      box(truck?1.55:-.45,.97,side*.837,truck?.18:.23,.035,.027,trim,g);
      box(0,.48,side*.82,truck?4.1:3.15,.07,.065,metal,g);
    }
    box(truck?2.34:1.8,.51,0,.06,.13,1.25,trim,g);
    for(let n=0;n<5;n++)box(truck?2.345:1.81,.7,-.25+n*.125,.027,.14,.045,metal,g);
    cars.push({g,wheels,x:g.position.x,z:g.position.z});
  }
  // Streets receive readable curbs and landscaped verges without extra colliders.
  function streets(){
    for(let z of [-72,-42,52,82])for(let side of [-1,1]){
      box(0,.09,z+side*3.25,266,.14,.28,'#d8d9ca',decorations);
      box(0,.04,z+side*4.05,266,.06,1.2,'#bdc6ba',decorations);
    }
    for(let x of [-102,-72,-42,42,72,102])for(let side of [-1,1])box(x+side*3.25,.08,4,.26,.14,216,'#d8d9ca',decorations);
    for(let x of [-112,-82,-52,52,82,112])for(let z of [-48,46,86]){
      for(let n=0;n<3;n++)sphere(x-1+n,.4,z+1.25,.45,.4,.4,foliage[n],decorations);
    }
  }
  const view={active:false,x:0,z:0,angle:.62,distance:65,drag:null};
  function toggle(player){view.active=!view.active;view.x=player.x;view.z=player.z;view.drag=null;document.exitPointerLock?.();updateButtons();return view.active}
  function updateButtons(){root.cityCameraActive=view.active;document.getElementById('cityView').textContent=view.active?'Walk view · C':'City view · C';document.getElementById('cityControls').hidden=!view.active;document.body.classList.toggle('city-view',view.active);root.ControlLayout?.apply()}
  function zoom(factor){view.distance=Math.max(24,Math.min(145,view.distance*factor))}
  document.getElementById('cityZoomIn').onclick=()=>zoom(.82);
  document.getElementById('cityZoomOut').onclick=()=>zoom(1.22);
  document.getElementById('cityRotateLeft').onclick=()=>view.angle-=Math.PI/8;
  document.getElementById('cityRotateRight').onclick=()=>view.angle+=Math.PI/8;
  canvas.addEventListener('wheel',e=>{if(!view.active)return;e.preventDefault();zoom(e.deltaY>0?1.08:.92)},{passive:false});
  canvas.addEventListener('pointerdown',e=>{if(!view.active)return;view.drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture?.(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{if(!view.active||view.drag?.id!==e.pointerId)return;const dx=e.clientX-view.drag.x,dy=e.clientY-view.drag.y,k=view.distance*.0018;view.x-= (Math.cos(view.angle)*dx+Math.sin(view.angle)*dy)*k;view.z-=(-Math.sin(view.angle)*dx+Math.cos(view.angle)*dy)*k;view.drag.x=e.clientX;view.drag.y=e.clientY});
  for(let event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>view.drag=null);
  function frame(dt,{clock,player,keys,paused,owner,carried,driving=false,controllerKeys={}}){
    const night=WorldEnvironment.daylight(clock).night;
    if(night!==lastNight){lastNight=night;nightMaterials.forEach((m,i)=>m.emissiveIntensity=night?(i%3===0?.45:.16):0)}
    cars.forEach(c=>{const distance=Math.hypot(c.g.position.x-c.x,c.g.position.z-c.z);if(distance<5)for(let w of c.wheels)w.rotation.y+=distance/.36;c.x=c.g.position.x;c.z=c.g.position.z});
    if(!view.active)return false;
    if(!paused){const forward=Number(!!(keys.KeyW||keys.ArrowUp||controllerKeys.KeyW))-Number(!!(keys.KeyS||keys.ArrowDown||controllerKeys.KeyS)),side=Number(!!(keys.KeyD||keys.ArrowRight||controllerKeys.KeyD))-Number(!!(keys.KeyA||keys.ArrowLeft||controllerKeys.KeyA)),length=Math.max(1,Math.hypot(forward,side)),speed=dt*view.distance*.35/length;view.x+=(Math.cos(view.angle)*side-Math.sin(view.angle)*forward)*speed;view.z+=(-Math.sin(view.angle)*side-Math.cos(view.angle)*forward)*speed;}
    view.x=Math.max(player.x-90,Math.min(player.x+90,view.x));view.z=Math.max(player.z-90,Math.min(player.z+90,view.z));
    camera.position.set(view.x+Math.sin(view.angle)*view.distance*.65,view.distance*.85,view.z+Math.cos(view.angle)*view.distance*.65);camera.lookAt(view.x,0,view.z);owner.visible=!driving;carried.visible=false;return true;
  }
  function quality(mode){profile=mode;const high=mode==='high',low=mode==='performance';renderer.setPixelRatio(Math.min(root.devicePixelRatio||1,high?1.75:low?1:1.25)*(root.ControlLayout?.renderScale||1));renderer.shadowMap.enabled=!low;decorations.visible=!low;}
  return {carBody,decorations,decorateBuilding,tree,enhanceCar,streets,frame,toggle,zoom,view,quality,center(player){view.x=player.x;view.z=player.z},get profile(){return profile}};
};
})(typeof window!=='undefined'?window:globalThis);

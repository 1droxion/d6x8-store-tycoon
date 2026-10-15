const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const memory=new Map(),context={module:{exports:{}},localStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)},innerWidth:390,innerHeight:844,navigator:{maxTouchPoints:1},requestAnimationFrame:()=>{}};
vm.createContext(context);vm.runInContext(fs.readFileSync('public/game/controls.js','utf8'),context);const C=context.module.exports;
const nodes=Object.fromEntries(['interactionPanel','interact','prompt'].map(id=>[id,{hidden:false,textContent:'',setAttribute(){},classList:{toggle(){}}}]));context.document={getElementById:id=>nodes[id]};
C.updateContext(null,false);assert.equal(nodes.interactionPanel.hidden,true);
C.updateContext({label:'Checkout'},false);assert.equal(nodes.interactionPanel.hidden,false);assert.match(nodes.interact.textContent,/Tap · Checkout/);assert.match(nodes.prompt.textContent,/3 tips/);
for(let i=0;i<3;i++)C.recordInteraction();C.updateContext({label:'Checkout'},false);assert.equal(nodes.prompt.textContent,'');assert.equal(memory.get('d6x8-action-tips'),'3');
C.updateContext({label:'Checkout'},true);assert.equal(nodes.interactionPanel.hidden,true);
for(const [w,h]of [[320,568],[390,844],[844,390],[1024,768],[768,1024],[1366,1024]]){const sizes={movement:{w:166,h:109},actions:{w:56,h:52},interact:{w:Math.min(300,w-32),h:84}},mode=C.device(w,h,true),points=C.defaultsFor(w,h,sizes,C.settings,mode);for(const id of Object.keys(sizes)){assert(points[id].x>=0&&points[id].y>=0);assert(points[id].x+sizes[id].w<=w);assert(points[id].y+sizes[id].h<=h)}}
console.log('Nearby-only action, paused hiding, three saved tips, touch labels and six phone/tablet layout bounds passed.');

for(const [x,y]of [[0,0],[2,0],[100,0],[0,-100],[100,100],[-100,100]]){let a=C.stickAxes(x,y);assert(Math.hypot(a.forward,a.side)<=1.00001);assert(Math.hypot(a.x,a.y)<=38.00001)}
assert.equal(C.stickAxes(2,0).side,0);assert.equal(C.stickAxes(0,-38).forward,1);assert.equal(C.stickAxes(38,0).side,1);assert.equal(C.stickAxes(NaN,1).side,0);
assert.equal(C.smoothDistance(3.2,.6,1/60),.6);let d=.6;for(let i=0;i<60;i++){let next=C.smoothDistance(d,3.2,1/60);assert(next>=d&&next<=3.2);d=next}assert(d>3.19);
let a=C.smoothDistance(.6,3.2,1/30),b=C.smoothDistance(C.smoothDistance(.6,3.2,1/60),3.2,1/60);assert(Math.abs(a-b)<1e-10);
console.log('Joystick dead zone, diagonal normalization, invalid input and frame-independent camera recovery passed.');

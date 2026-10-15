const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function setup(result, age = 'adult') {
  const nodes = [];
  const store = new Map([['d6x8-ad-adult-choice', age]]);
  const document = { createElement(tag) { const n = { tag, children: [], append(...a) { this.children.push(...a); }, textContent: '', disabled: false }; nodes.push(n); return n; } };
  let ready, saved = 0, statusCalls = 0, adCalls = 0;
  const context = { document, localStorage: { getItem:k=>store.get(k), setItem:(k,v)=>store.set(k,v) }, s: {cash: 500}, save:()=>saved++, updateHUD:()=>{}, toast:()=>{}, show:()=>{} };
  context.window = { addEventListener:(name,cb)=>ready=cb, Capacitor:{Plugins:{StoreRewards:{status:async()=>{statusCalls++;return {ready:true,cooldownMs:0,testMode:true};},show:async()=>{adCalls++; if(result instanceof Error)throw result;return result;},prepare:async()=>({}),privacy:async()=>({})}}} };
  vm.runInNewContext(fs.readFileSync(__dirname+'/native-ui.js','utf8'), context); ready();
  return {context,nodes,counts:()=>({saved,adCalls,statusCalls})};
}
(async()=>{
  for(const [result,expected] of [[{earned:true,cashCents:10000},10500],[{earned:false,cashCents:0},500],[{earned:true,cashCents:20000},500],[new Error('no fill'),500]]) {
    const t=setup(result);await t.context.window.onlineScreen();
    const b=t.nodes.find(x=>x.textContent==='Watch ad · +100 store cash');assert(b&&!b.disabled);
    await b.onclick();assert.equal(t.context.s.cash,expected);assert.equal(t.counts().saved,expected===10500?1:0);
  }
  const child=setup({earned:true,cashCents:10000},'no-ads');await child.context.window.onlineScreen();assert(!child.nodes.some(x=>x.textContent==='Watch ad · +100 store cash'));assert.equal(child.counts().adCalls,0);
  const t=setup({earned:true,cashCents:10000});await t.context.window.onlineScreen();const b=t.nodes.find(x=>x.textContent==='Watch ad · +100 store cash');await Promise.all([b.onclick(),b.onclick()]);assert.equal(t.counts().adCalls,1);assert.equal(t.context.s.cash,10500);
  console.log('Reward UI: earned-only exact grant, dismissal/no-fill, invalid amount, under-18/no-ads and duplicate-tap checks passed.');
})().catch(e=>{console.error(e);process.exit(1);});

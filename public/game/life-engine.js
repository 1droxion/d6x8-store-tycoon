(function(root){
const meals=[{id:'burger',name:'Burger & fries',cost:900,food:45},{id:'pizza',name:'Fresh pizza',cost:1200,food:60},{id:'salad',name:'Salad bowl',cost:700,food:35},{id:'coffee',name:'Coffee',cost:300,food:5,energy:20}];
function normalize(s){let old=s.life||{};s.life={food:Number.isFinite(old.food)?Math.max(0,Math.min(100,old.food)):100,energy:Number.isFinite(old.energy)?Math.max(0,Math.min(100,old.energy)):100,fun:Number.isFinite(old.fun)?Math.max(0,Math.min(100,old.fun)):80,meals:Number.isSafeInteger(old.meals)&&old.meals>=0?old.meals:0};return s.life}
function eat(s,id){let meal=meals.find(m=>m.id===id);if(!meal)return {ok:false,error:'Choose a meal.'};let life=normalize(s);if(s.cash<meal.cost)return {ok:false,error:'Not enough in-game cash.'};if(life.food>=100&&!meal.energy)return {ok:false,error:'You are already full.'};s.cash-=meal.cost;life.food=Math.min(100,life.food+meal.food);life.energy=Math.min(100,life.energy+(meal.energy||0));life.meals++;return {ok:true,meal}}
function rest(s){let life=normalize(s);life.energy=100;return {ok:true}}
function tick(s,dt,running){let life=s.life||normalize(s);dt=Math.max(0,Math.min(Number.isFinite(dt)?dt:0,1));life.food=Math.max(0,life.food-dt*.018);life.energy=Math.max(0,life.energy-dt*(running?.08:.012));life.fun=Math.max(0,life.fun-dt*.006)}
const api={meals,normalize,eat,rest,tick};root.CityLifeEngine=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);

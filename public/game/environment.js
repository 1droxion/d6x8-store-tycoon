(function(root){function signal(clock){let t=((clock%60)+60)%60;return {main:t<24?'green':t<28?'yellow':'red',side:t>=32&&t<54?'green':t>=54&&t<58?'yellow':'red',walk:t>=32&&t<49}}
function weather(clock){let phase=Math.floor(Math.max(0,clock)/180)%6;return ['clear','cloudy','rain','cloudy','clear','rain'][phase]}
function daylight(clock){let hour=(8+clock/50)%24;let sun=Math.sin((hour-6)/12*Math.PI);return {hour,light:Math.max(.035,sun),night:hour<6||hour>=19,period:hour<6?'Night':hour<11?'Morning':hour<16?'Midday':hour<19?'Evening':'Night'}}
function stopForSignal(clock,x,direction,step,centers=[-9,0,9]){if(signal(clock).main==='green')return null;for(let center of centers){let stop=center-direction*4.5,d=(stop-x)*direction;if(d>=0&&d<=step+.12)return stop}return null}
root.WorldEnvironment={signal,weather,daylight,stopForSignal};if(typeof module!=='undefined')module.exports=root.WorldEnvironment})(globalThis);

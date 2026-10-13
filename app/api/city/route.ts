import { env } from 'cloudflare:workers';
export const dynamic='force-dynamic';
const json=(v:unknown,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 const userId=request.headers.get('oai-authenticated-user-id');
 if(!userId)return json({error:'Sign in to join the city.'},401);
 const origin=request.headers.get('origin');if(!origin||origin!==new URL(request.url).origin)return json({error:'Invalid origin.'},403);
 if(Number(request.headers.get('content-length')||0)>1024)return json({error:'Request too large.'},413);
 let data;try{const text=await request.text();if(text.length>1024)return json({error:'Request too large.'},413);data=JSON.parse(text)}catch{return json({error:'Invalid request.'},400)}
 if(!data||typeof data!=='object'||Array.isArray(data))return json({error:'Invalid request.'},400);
 if(!env.DB)return json({error:'City server unavailable.'},503);
 if(data.leave===true){await env.DB.prepare('DELETE FROM city_players WHERE user_id = ?').bind(userId).run();return json({players:[]})}
 if(![data.x,data.z,data.yaw].every(v=>typeof v==='number'&&Number.isFinite(v))||Math.abs(data.x)>100000||Math.abs(data.z)>100000||Math.abs(data.yaw)>100000)return json({error:'Invalid position.'},400);
 const name=typeof data.name==='string'?data.name.replace(/[\x00-\x1f]/g,'').trim().slice(0,24):'Player';const now=Date.now();
 const existing=await env.DB.prepare('SELECT updated FROM city_players WHERE user_id = ?').bind(userId).first<{updated:number}>();
 if(existing&&now-existing.updated<1500)return json({error:'Update too frequent.'},429);
 await env.DB.prepare('DELETE FROM city_players WHERE updated < ?').bind(now-30000).run();
 if(!existing){let n=await env.DB.prepare('SELECT COUNT(*) AS n FROM city_players').first<{n:number}>();if((n?.n||0)>=64)return json({error:'This city is full. Try again later.'},409)}
 await env.DB.prepare('INSERT INTO city_players (user_id, public_id, name, x, z, yaw, updated) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET name=excluded.name,x=excluded.x,z=excluded.z,yaw=excluded.yaw,updated=excluded.updated').bind(userId,crypto.randomUUID(),name||'Player',data.x,data.z,data.yaw,now).run();
 const rows=await env.DB.prepare('SELECT public_id AS id, name, x, z, yaw FROM city_players WHERE updated > ? AND user_id != ? LIMIT 63').bind(now-20000,userId).all();
 return json({players:rows.results,online:rows.results.length+1});
}

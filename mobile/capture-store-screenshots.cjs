// Capture genuine game rendering from the same assets packaged in Android.
// No fabricated UI, generated gameplay images, save injection or progress edits.
const {chromium} = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
(async()=>{
 const root=path.join(__dirname,'www'), output=path.join(__dirname,'store-screenshots');
 await fs.mkdir(output,{recursive:true});
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.hdr':'application/octet-stream'};
 const server=http.createServer(async(req,res)=>{
  try {const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const filename=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!filename.startsWith(root+path.sep)){res.writeHead(403).end();return;}const bytes=await fs.readFile(filename);res.setHeader('Content-Type',types[path.extname(filename)]||'application/octet-stream');res.end(bytes);}catch{res.writeHead(404).end();}
 });
 await new Promise(r=>server.listen(8080,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,channel:'chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try {
  const context=await browser.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1.5,isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36'});
  const page=await context.newPage();page.setDefaultTimeout(120000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
  await page.locator('#play').click();await page.locator('#skipIntro').click();
  await page.waitForTimeout(4000);
  assert(!await page.getByText('WebGL is unavailable.',{exact:false}).count(),'WebGL failed');
  async function capture(name){console.log('Capturing '+name);await page.waitForTimeout(3000);await page.screenshot({path:path.join(output,name+'.png'),timeout:120000,animations:'disabled'});console.log('Saved '+name);}
  await capture('01-your-neighborhood-store');
  await page.locator('#moreMenu').click();
  await page.locator('#cityView').click();await capture('02-explore-the-city');
  await page.locator('#cityZoomIn').click();await page.locator('#cityRotateRight').click();await capture('03-your-city-from-above');
  await page.locator('#cityView').click();
  await page.locator('#phone').click();
  await page.getByRole('button',{name:'Store management',exact:true}).click();await capture('04-manage-your-store');
  await fs.writeFile(path.join(output,'CAPTURE-NOTES.txt'),'Actual unaltered game rendering from the Android-packaged game assets. Captured at 1920x1080 with mobile/touch input and Chromium software WebGL. Store and city views and real in-game management UI; no generated gameplay art, save injection or fake features. Browser rendering is not a physical-device performance certification.\nPage errors: '+JSON.stringify(errors)+'\n');
  assert.equal(errors.length,0,errors.join('\n'));
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});

// CI-only capture automation. Never included by prepare:web or signed release builds.
import {readFile,writeFile} from 'node:fs/promises';
const file=new URL('../www/index.html',import.meta.url);
let html=await readFile(file,'utf8');
const automation=`<script>
window.addEventListener('load',()=>{
 setTimeout(()=>{document.getElementById('play').click();document.getElementById('skipIntro').click();},2000);
 setTimeout(()=>{document.getElementById('moreMenu').click();document.getElementById('phone').click();},20000);
 setTimeout(()=>{document.getElementById('play').click();document.getElementById('cityView').click();},35000);
});
</script>`;
await writeFile(file,html.replace('</body>',automation+'</body>'));

import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
const root = new URL('../public/game/', import.meta.url);
const destination = new URL('./www/', import.meta.url);
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(root, destination, { recursive: true });
// The packaged build has no Sites authentication/backend. Never send native
// presence requests to localhost or imply that online play/payments work.
await cp(new URL('./native-ui.js', import.meta.url), new URL('native-ui.js', destination));
const native = '<script src="native-ui.js"></script>\n';
const index = new URL('index.html', destination);
let html = await readFile(index, 'utf8');
html = html.replace('</body>', native + '</body>').replaceAll('Online & store', 'Rewards & privacy');
await writeFile(index, html);
console.log('Packaged local game assets with optional native rewarded ads.');

import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
const root = new URL('../public/game/', import.meta.url);
const destination = new URL('./www/', import.meta.url);
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(root, destination, { recursive: true });
// The packaged build has no Sites authentication/backend. Never send native
// presence requests to localhost or imply that online play/payments work.
const native = `\n<script>\nwindow.addEventListener('DOMContentLoaded', function () {\n  window.onlineScreen = function () {\n    show('Android preview', '<p>This Android preview supports single-player play. Progress is saved on this device.</p><p>Online play, real ads and purchases are not available in this build.</p>', 'phone');\n  };\n});\n</script>\n`;
const index = new URL('index.html', destination);
let html = await readFile(index, 'utf8');
html = html.replace('</body>', native + '</body>');
await writeFile(index, html);
console.log('Packaged local game assets; online/purchase screen is preview-only.');

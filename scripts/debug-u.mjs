import fs from 'fs';
const html = fs.readFileSync('scripts/u_transfers.html', 'utf8');
const p = html.indexOf('Altas');
console.log(JSON.stringify(html.slice(p - 20, p + 50)));
const p2 = html.indexOf('Bajas');
console.log(JSON.stringify(html.slice(p2 - 20, p2 + 50)));

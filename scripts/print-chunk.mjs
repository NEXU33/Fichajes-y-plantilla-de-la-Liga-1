import fs from 'fs';

const html = fs.readFileSync('scripts/u_transfers.html', 'utf8');
const pos = html.indexOf('Altas');
const chunk = html.slice(pos, pos + 4000);
console.log(chunk);

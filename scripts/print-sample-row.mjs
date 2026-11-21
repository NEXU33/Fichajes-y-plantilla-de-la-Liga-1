import fs from 'fs';

const html = fs.readFileSync('scripts/u_transfers.html', 'utf8');
const p = html.indexOf('Altas            </h2>');
const tr1 = html.indexOf('<tr class="odd">', p);
const tr1End = html.indexOf('</tr>', tr1);
console.log('--- FIRST ROW ALTAS ---');
console.log(html.slice(tr1, tr1End + 5));

const p2 = html.indexOf('Bajas            </h2>');
const tr2 = html.indexOf('<tr class="odd">', p2);
const tr2End = html.indexOf('</tr>', tr2);
console.log('\n--- FIRST ROW BAJAS ---');
console.log(html.slice(tr2, tr2End + 5));

import fs from 'fs';

const html = fs.readFileSync('scripts/u_transfers.html', 'utf8');
const posAltas = html.indexOf('Altas');
console.log(html.slice(posAltas, posAltas + 2000).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
const posBajas = html.indexOf('Bajas');
console.log(html.slice(posBajas, posBajas + 2000).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));

import fs from 'fs';
const html = fs.readFileSync('scripts/transfers_universitario-de-deportes.html', 'utf8');
const posAltas = html.indexOf('Altas');
console.log('Pos altas:', posAltas);
console.log(html.slice(posAltas, posAltas + 1000));

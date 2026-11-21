import fs from 'fs';
const html = fs.readFileSync('scripts/besoccer_clausura_peru_latest.html', 'utf8');
const cIdx = html.indexOf('Cienciano</h3>');
const slice = html.substring(cIdx - 200, cIdx + 500);
console.log('Snippet around Cienciano:');
console.log(slice);

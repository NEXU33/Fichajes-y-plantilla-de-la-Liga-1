import fs from 'fs';

const html = fs.readFileSync('scripts/besoccer_club_cienciano.html', 'utf8');

const bIdx = html.indexOf('320484');
if (bIdx !== -1) {
  console.log('=== K. Becerra block ===');
  console.log(html.substring(bIdx - 200, bIdx + 800));
}

const nIdx = html.indexOf('362461');
if (nIdx !== -1) {
  console.log('=== Claudio Nunez block ===');
  console.log(html.substring(nIdx - 200, nIdx + 800));
}

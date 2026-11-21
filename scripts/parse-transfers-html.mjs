import fs from 'fs';

const html = fs.readFileSync('scripts/transfers_universitario-de-deportes.html', 'utf8');
const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('H2s:', h2s);

// Look for table headers or responsive tables
const tables = [...html.matchAll(/<div class="responsive-table">([\s\S]*?)<\/table>/g)];
console.log('Responsive tables:', tables.length);

for (let i = 0; i < tables.length; i++) {
  console.log(`\nTable ${i}:`);
  const rows = [...tables[i][1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
  for (const r of rows) {
    const text = r[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text && !text.includes('Jugadores/Posición')) {
      console.log('  row:', text);
    }
  }
}

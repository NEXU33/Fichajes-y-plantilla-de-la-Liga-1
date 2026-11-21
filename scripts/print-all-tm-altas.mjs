import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/all_tm_transfers_exact.json', 'utf8'));

for (const [slug, info] of Object.entries(data)) {
  console.log(`\n=================== ${info.name} (${slug}) ===================`);
  console.log(`ALTAS (${info.altas.length}):`);
  for (const a of info.altas) {
    console.log(`  + ${a.player} (${a.pos}) | Desde: ${a.club} | Coste: ${a.fee}`);
  }
}

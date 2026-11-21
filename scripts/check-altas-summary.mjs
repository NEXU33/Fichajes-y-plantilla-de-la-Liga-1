import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/all_tm_transfers_exact.json', 'utf8'));

for (const [slug, info] of Object.entries(data)) {
  console.log(`Club: ${slug} (${info.name}) has ${info.altas.length} altas:`);
  info.altas.slice(0, 5).forEach(a => console.log(`   - ${a.player} (${a.pos}) from ${a.club} [fee: ${a.fee}]`));
}

import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/all_tm_transfers_exact.json', 'utf8'));

for (const club of ['sport-boys', 'cienciano', 'fbc-melgar', 'utc-cajamarca', 'fc-cajamarca']) {
  console.log(`\n=== ${club.toUpperCase()} ALTAS ===`);
  console.table(data[club].altas.slice(0, 15));
}

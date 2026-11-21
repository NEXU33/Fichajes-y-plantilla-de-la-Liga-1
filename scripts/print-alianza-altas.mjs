import fs from 'fs';

const html = fs.readFileSync('scripts/alianza_transfers.html', 'utf8');
const match = html.match(/<h2[^>]*>\s*Altas\s*<\/h2>([\s\S]*?)<\/tbody>/i);
if (match) {
  const rawRows = match[1].split(/<tr class="(?:odd|even)">/);
  rawRows.shift();
  const list = rawRows.map(row => {
    const player = row.match(/<td class="hauptlink">\s*<a title="([^"]+)"/)?.[1];
    const pos = row.match(/<tr>\s*<td>([^<]+)<\/td>\s*<\/tr>/)?.[1];
    const hauptlinks = [...row.matchAll(/<td class="hauptlink">\s*<a title="([^"]+)"/g)];
    const club = hauptlinks[1] ? hauptlinks[1][1] : (row.includes('Sin equipo') ? 'Sin equipo' : 'Desconocido');
    const feeMatch = row.match(/<td class="rechts[^"]*">([\s\S]*?)<\/td>\s*$/) || row.match(/<td class="rechts[^"]*">([\s\S]*?)<\/td>/);
    const fee = feeMatch ? feeMatch[1].replace(/<[^>]+>/g, '').trim() : '-';
    return { player, pos, club, fee };
  }).filter(p => p.player);
  console.log(`=== ALIANZA LIMA ALTAS (${list.length}) ===`);
  console.table(list);
}

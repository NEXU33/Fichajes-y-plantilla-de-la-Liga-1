import fs from 'fs';

const html = fs.readFileSync('scripts/u_transfers.html', 'utf8');

function extractTransfers(title) {
  const marker = `${title}            </h2>`;
  const pos = html.indexOf(marker);
  if (pos === -1) {
    console.log(`Marker not found for ${title}`);
    return [];
  }
  const chunk = html.slice(pos, pos + 25000);
  const endTable = chunk.indexOf('</tbody>');
  const tableChunk = chunk.slice(0, endTable);

  const rows = [...tableChunk.matchAll(/<tr class="(?:odd|even)">([\s\S]*?)<\/tr>/g)];
  const list = [];
  for (const r of rows) {
    const row = r[1];
    const playerMatch = row.match(/<a title="([^"]+)" href="\/[^\/]+\/profil\/spieler\/\d+"/);
    const posMatch = row.match(/<tr>\s*<td>([^<]+)<\/td>\s*<\/tr>/);
    const natMatch = row.match(/<img[^>]*class="flaggenrahmen"[^>]*title="([^"]+)"/);
    
    // Club
    const clubMatch = row.match(/<td class="no-border-links verein-flagge-transfer-cell">[\s\S]*?<a title="([^"]+)"/) ||
                      row.match(/<td class="no-border-links[^"]*"[^>]*>[\s\S]*?<a title="([^"]+)"/);
    
    // Fee / Coste
    const feeMatch = row.match(/<td class="rechts hauptlink">[\s\S]*?<a[^>]*>([^<]+)<\/a>/) ||
                     row.match(/<td class="rechts[^"]*">([^<]+)<\/td>/);

    if (playerMatch) {
      list.push({
        player: playerMatch[1].trim(),
        pos: posMatch ? posMatch[1].trim() : '-',
        nat: natMatch ? natMatch[1].trim() : 'Perú',
        club: clubMatch ? clubMatch[1].trim() : (row.includes('Sin equipo') ? 'Sin equipo' : '-'),
        fee: feeMatch ? feeMatch[1].trim() : '-'
      });
    }
  }
  return list;
}

console.log('=== ALTAS UNIVERSITARIO (TRANSFERMARKT) ===');
console.table(extractTransfers('Altas'));

console.log('=== BAJAS UNIVERSITARIO (TRANSFERMARKT) ===');
console.table(extractTransfers('Bajas'));

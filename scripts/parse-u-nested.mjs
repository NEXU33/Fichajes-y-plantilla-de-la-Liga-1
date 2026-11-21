import fs from 'fs';

const html = fs.readFileSync('scripts/u_transfers.html', 'utf8');

function parseTransfers(title) {
  const marker = `${title}            </h2>`;
  const pos = html.indexOf(marker);
  if (pos === -1) return [];
  const chunk = html.slice(pos, pos + 35000);
  const endTbody = chunk.indexOf('</tbody>');
  const tbody = chunk.slice(0, endTbody);

  const rawRows = tbody.split(/<tr class="(?:odd|even)">/);
  rawRows.shift(); // remove header

  return rawRows.map(row => {
    // Player
    const playerMatch = row.match(/<td class="hauptlink">\s*<a title="([^"]+)"/);
    // Pos
    const posMatch = row.match(/<tr>\s*<td>([^<]+)<\/td>\s*<\/tr>/);
    // Age
    const ageMatch = row.match(/<td class="zentriert">(\d+)<\/td>/);
    // Nat
    const natMatch = row.match(/<img[^>]*class="flaggenrahmen"[^>]*title="([^"]+)"/);
    
    // Club: look for second table inline-table or club wappen/name
    // Usually <td class="hauptlink">\s*<a title="Club"
    const hauptlinks = [...row.matchAll(/<td class="hauptlink">\s*<a title="([^"]+)"/g)];
    const club = hauptlinks[1] ? hauptlinks[1][1] : (row.includes('Sin equipo') ? 'Sin equipo' : 'Desconocido');

    // Fee: usually last <td> in row
    const feeMatch = row.match(/<td class="rechts[^"]*">([\s\S]*?)<\/td>\s*$/) || row.match(/<td class="rechts[^"]*">([\s\S]*?)<\/td>/);
    const fee = feeMatch ? feeMatch[1].replace(/<[^>]+>/g, '').trim() : '-';

    return {
      player: playerMatch ? playerMatch[1].trim() : null,
      pos: posMatch ? posMatch[1].trim() : '-',
      age: ageMatch ? ageMatch[1] : '-',
      nat: natMatch ? natMatch[1].trim() : 'Perú',
      club,
      fee
    };
  }).filter(p => p.player);
}

console.log('=== ALTAS UNIVERSITARIO (EXACTAS DE TRANSFERMARKT) ===');
console.table(parseTransfers('Altas'));

console.log('=== BAJAS UNIVERSITARIO (EXACTAS DE TRANSFERMARKT) ===');
console.table(parseTransfers('Bajas'));

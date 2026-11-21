import fs from 'fs';

function parseTransfers(html, title) {
  const match = html.match(new RegExp(`<h2[^>]*>\\s*${title}\\s*<\\/h2>([\\s\\S]*?)<\\/tbody>`, 'i'));
  if (!match) return [];
  const tbody = match[1];
  const rawRows = tbody.split(/<tr class="(?:odd|even)">/);
  rawRows.shift();

  return rawRows.map(row => {
    // Player
    const playerMatch = row.match(/<td class="hauptlink">\s*<a title="([^"]+)"/);
    // Pos
    const posMatch = row.match(/<tr>\s*<td>([^<]+)<\/td>\s*<\/tr>/);
    // Nat
    const natMatch = row.match(/<img[^>]*class="flaggenrahmen"[^>]*title="([^"]+)"/);
    // Club
    const hauptlinks = [...row.matchAll(/<td class="hauptlink">\s*<a title="([^"]+)"/g)];
    const club = hauptlinks[1] ? hauptlinks[1][1] : (row.includes('Sin equipo') ? 'Sin equipo' : 'Desconocido');
    // Fee
    const feeMatch = row.match(/<td class="rechts[^"]*">([\s\S]*?)<\/td>\s*$/) || row.match(/<td class="rechts[^"]*">([\s\S]*?)<\/td>/);
    const fee = feeMatch ? feeMatch[1].replace(/<[^>]+>/g, '').trim() : '-';

    return {
      player: playerMatch ? playerMatch[1].trim() : null,
      pos: posMatch ? posMatch[1].trim() : '-',
      nat: natMatch ? natMatch[1].trim() : 'Perú',
      club,
      fee
    };
  }).filter(p => p.player);
}

const uHtml = fs.readFileSync('scripts/u_transfers.html', 'utf8');
console.log('=== UNIVERSITARIO ALTAS ===');
console.table(parseTransfers(uHtml, 'Altas'));
console.log('=== UNIVERSITARIO BAJAS ===');
console.table(parseTransfers(uHtml, 'Bajas'));

const aliHtml = fs.readFileSync('scripts/alianza_transfers.html', 'utf8');
console.log('\n=== ALIANZA LIMA ALTAS ===');
console.table(parseTransfers(aliHtml, 'Altas'));
console.log('=== ALIANZA LIMA BAJAS ===');
console.table(parseTransfers(aliHtml, 'Bajas'));

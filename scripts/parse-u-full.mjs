import fs from 'fs';

const html = fs.readFileSync('scripts/u_transfers.html', 'utf8');

function extractTransfers(sectionTitle) {
  const parts = html.split(new RegExp(`<h2>\\s*${sectionTitle}\\s*<\\/h2>`));
  if (parts.length < 2) return [];
  const section = parts[1].split('</table>')[0];

  const rows = [...section.matchAll(/<tr class="(?:odd|even)">([\s\S]*?)<\/tr>/g)];
  const list = [];
  for (const r of rows) {
    const row = r[1];
    // player name
    const playerMatch = row.match(/<td class="hauptlink">\s*<a[^>]*title="([^"]+)"[^>]*>/);
    const posMatch = row.match(/<tr>\s*<td>([^<]+)<\/td>\s*<\/tr>/);
    // nationalities
    const nats = [...row.matchAll(/<img[^>]*class="flaggenrahmen"[^>]*title="([^"]+)"/g)].map(m => m[1]);
    // club
    const clubMatch = row.match(/<td class="hauptlink">\s*<a[^>]*title="([^"]+)"[^>]*>[^<]+<\/a>\s*<\/td>/g);
    // club is the second hauptlink
    const allHauptlinks = [...row.matchAll(/<td class="hauptlink">\s*<a[^>]*title="([^"]+)"[^>]*>([^<]+)<\/a>/g)];
    const player = allHauptlinks[0] ? allHauptlinks[0][2].trim() : null;
    const club = allHauptlinks[1] ? allHauptlinks[1][2].trim() : (row.includes('Libre') ? 'Libre / Sin equipo' : 'Desconocido');

    // fee
    const feeMatch = row.match(/<td class="rechts hauptlink">[\s\S]*?<a[^>]*>([^<]+)<\/a>/) || row.match(/<td class="rechts[^"]*">([^<]+)<\/td>/);
    const fee = feeMatch ? feeMatch[1].trim() : '-';

    if (player) {
      list.push({ player, pos: posMatch ? posMatch[1].trim() : '-', nats: nats[0] || 'Perú', club, fee });
    }
  }
  return list;
}

console.log('=== ALTAS UNIVERSITARIO ===');
console.table(extractTransfers('Altas'));

console.log('=== BAJAS UNIVERSITARIO ===');
console.table(extractTransfers('Bajas'));

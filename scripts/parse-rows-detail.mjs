import fs from 'fs';

const html = fs.readFileSync('scripts/u_transfers.html', 'utf8');

function parseRows(title) {
  const marker = `${title}            </h2>`;
  const pos = html.indexOf(marker);
  if (pos === -1) return [];
  const chunk = html.slice(pos, pos + 35000);
  const endTable = chunk.indexOf('</tbody>');
  const tableChunk = chunk.slice(0, endTable);

  const rows = [...tableChunk.matchAll(/<tr class="(?:odd|even)">([\s\S]*?)<\/tr>/g)];
  return rows.map(r => {
    const row = r[1];
    const player = row.match(/<a title="([^"]+)" href="\/[^\/]+\/profil\/spieler\/\d+"/)?.[1]?.trim();
    // position
    const pos = row.match(/<tr>\s*<td>([^<]+)<\/td>\s*<\/tr>/)?.[1]?.trim() || 
                row.match(/<td class="pos"[^>]*>([^<]+)<\/td>/)?.[1]?.trim();
    // age
    const age = row.match(/<td class="zentriert">(\d+)<\/td>/)?.[1];
    // nat
    const nat = row.match(/<img[^>]*class="flaggenrahmen"[^>]*title="([^"]+)"/)?.[1];
    
    // club
    // Search for <td class="no-border-links ...">
    const clubTd = row.match(/<td class="no-border-links[^"]*"[^>]*>([\s\S]*?)<\/td>/)?.[1] || '';
    const club = clubTd.match(/<a title="([^"]+)"/)?.[1] ||
                 clubTd.match(/<a[^>]*>([^<]+)<\/a>/)?.[1]?.trim() ||
                 (clubTd.includes('Sin equipo') ? 'Sin equipo' : 'Desconocido');
    
    // fee / type
    const feeTd = row.match(/<td class="rechts hauptlink"[^>]*>([\s\S]*?)<\/td>/)?.[1] ||
                  row.match(/<td class="rechts"[^>]*>([\s\S]*?)<\/td>/)?.[1] || '';
    const fee = feeTd.replace(/<[^>]+>/g, '').trim();

    return { player, pos, age, nat, club, fee };
  });
}

console.log('=== ALTAS UNIVERSITARIO ===');
console.table(parseRows('Altas'));

console.log('=== BAJAS UNIVERSITARIO ===');
console.table(parseRows('Bajas'));

import fs from 'fs';

const html = fs.readFileSync('scripts/u_transfers.html', 'utf8');

function parseTable(sectionName) {
  const pos = html.indexOf(`>${sectionName}</h2>`);
  if (pos === -1) return [];
  const after = html.slice(pos);
  const nextH2 = after.indexOf('<h2', 10);
  const sectionHtml = nextH2 !== -1 ? after.slice(0, nextH2) : after;

  const rows = [...sectionHtml.matchAll(/<tr class="(?:odd|even)">([\s\S]*?)<\/tr>/g)];
  const results = [];
  for (const r of rows) {
    const rowHtml = r[1];
    // player name & link
    const nameMatch = rowHtml.match(/<a class="inline-table__bold"[^>]*>([^<]+)<\/a>/) ||
                      rowHtml.match(/<a href="\/[^\/]+\/profil\/spieler\/\d+"[^>]*>([^<]+)<\/a>/) ||
                      rowHtml.match(/<td class="hauptlink"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
    const name = nameMatch ? nameMatch[1].trim() : null;

    // Position
    const posMatch = rowHtml.match(/<td class="pos"[^>]*>([^<]+)<\/td>/) ||
                     rowHtml.match(/<td class="kurzpos"[^>]*>([^<]+)<\/td>/) ||
                     rowHtml.match(/<td>(Portero|Defensa central|Lateral izquierdo|Lateral derecho|Pivote|Mediocentro|Mediapunta|Extremo izquierdo|Extremo derecho|Delantero centro|Medio campo|Defensa|Delantero)<\/td>/i);
    const position = posMatch ? posMatch[1].trim() : '-';

    // Age
    const ageMatch = rowHtml.match(/<td class="zentriert alter"[^>]*>(\d+)<\/td>/) || rowHtml.match(/<td class="zentriert"[^>]*>(\d{2})<\/td>/);
    const age = ageMatch ? ageMatch[1] : '-';

    // Nationality
    const nats = [...rowHtml.matchAll(/<img[^>]*class="flaggenrahmen"[^>]*title="([^"]+)"/g)].map(m => m[1]);

    // Club (from / to)
    const clubMatch = rowHtml.match(/<td class="no-border-links verein-flagge-transfer-cell">[\s\S]*?<a[^>]*title="([^"]+)"/) ||
                      rowHtml.match(/<td class="no-border-links[^"]*"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
    const club = clubMatch ? clubMatch[1].trim() : 'Libre / Desconocido';

    // Fee / Coste
    const feeMatch = rowHtml.match(/<td class="rechts hauptlink"[^>]*>([\s\S]*?)<\/td>/) ||
                     rowHtml.match(/<td class="rechts"[^>]*>([\s\S]*?)<\/td>/);
    const fee = feeMatch ? feeMatch[1].replace(/<[^>]+>/g, '').trim() : '-';

    if (name) {
      results.push({ name, position, age, nats: nats.join(' / '), club, fee });
    }
  }
  return results;
}

console.log('=== ALTAS (UNIVERSITARIO) ===');
console.table(parseTable('Altas'));

console.log('\n=== BAJAS (UNIVERSITARIO) ===');
console.table(parseTable('Bajas'));

import fs from 'fs';

async function fetchTeam(name, url) {
  console.log(`\n================== Fetching ${name} ==================`);
  console.log(`URL: ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    });
    const html = await res.text();
    const rows = [...html.matchAll(/<tr class="(?:odd|even)">([\s\S]*?)<\/tr>/g)];
    console.log(`Total rows found: ${rows.length}`);

    const players = [];
    for (const r of rows) {
      const text = r[1];
      // Name
      const nameM = text.match(/<a href="\/[^\/]+\/profil\/spieler\/\d+"[^>]*>([^<]+)<\/a>/);
      if (!nameM) continue;
      const playerName = nameM[1].trim();

      // Number
      const numM = text.match(/<div class="rn_nummer">(\d+)<\/div>/);
      const number = numM ? parseInt(numM[1]) : null;

      // Position (in the second row of the player inline-table)
      const posM = text.match(/<td>(Portero|Defensa central|Lateral izquierdo|Lateral derecho|Pivote|Mediocentro|Mediapunta|Extremo izquierdo|Extremo derecho|Delantero centro)<\/td>/i);
      const pos = posM ? posM[1].trim() : 'Futbolista';

      // Nationality
      const natMatches = [...text.matchAll(/<img[^>]*class="flaggenrahmen"[^>]*title="([^"]+)"/g)];
      const nat = natMatches.map(m => m[1].trim()).join(' / ') || 'Peruano';

      // Age / Birth date
      const birthM = text.match(/<td class="zentriert">(\d{2}\/\d{2}\/\d{4})\s*\(\d+\)<\/td>/);
      const birthStr = birthM ? birthM[1] : null;

      // Market Value
      const valM = text.match(/<td class="rechts hauptlink">([^<]+)<\/td>/);
      let eur = 150000;
      let valRaw = '-';
      if (valM) {
        valRaw = valM[1].trim();
        if (valRaw.includes('millón') || valRaw.includes('millones') || valRaw.includes('mil mill.')) {
          eur = Math.round(parseFloat(valRaw.replace(/[^\d,]/g, '').replace(',', '.')) * 1000000);
        } else if (valRaw.includes('mil') || valRaw.includes('k')) {
          eur = Math.round(parseFloat(valRaw.replace(/[^\d,]/g, '').replace(',', '.')) * 1000);
        }
      }

      players.push({
        number,
        name: playerName,
        pos,
        nat,
        birthStr,
        eur,
        valRaw
      });
    }

    console.log(`Extracted ${players.length} players for ${name}:`);
    players.forEach((p, idx) => {
      console.log(`${idx + 1}. #${p.number || '-'} ${p.name} | ${p.pos} | ${p.nat} | €${p.eur.toLocaleString()} (${p.valRaw}) | ${p.birthStr || ''}`);
    });

    return players;
  } catch (err) {
    console.error(`Error fetching ${name}:`, err.message);
    return [];
  }
}

async function main() {
  const jpii = await fetchTeam('Club Juan Pablo II College', 'https://www.transfermarkt.pe/club-juan-pablo-ii-college/kader/verein/99517');
  const adt = await fetchTeam('Asociación Deportiva Tarma (ADT)', 'https://www.transfermarkt.pe/asociacion-deportiva-tarma/kader/verein/35588');

  fs.writeFileSync('scripts/jpii_scraped.json', JSON.stringify(jpii, null, 2));
  fs.writeFileSync('scripts/adt_scraped.json', JSON.stringify(adt, null, 2));
}

main();

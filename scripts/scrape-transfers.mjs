import fs from 'fs';

async function checkClubTransfers(slug, vereinId) {
  const url = `https://www.transfermarkt.pe/${slug}/transfers/verein/${vereinId}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    });
    console.log(`URL: ${url} -> Status: ${res.status}`);
    const html = await res.text();

    fs.writeFileSync(`scripts/transfers_${slug}.html`, html);

    // Look for h2 box headers and following tables
    const boxes = [...html.matchAll(/<div class="box">([\s\S]*?)<\/div>\s*<\/div>/g)];
    console.log(`Total boxes found: ${boxes.length}`);
    
    // Altas / Bajas
    // Let's search for "Altas" or "Bajas"
    const altaMatches = [...html.matchAll(/<h2>\s*(Altas|Bajas|Fichajes)[\s\S]*?<\/h2>([\s\S]*?)<\/table>/g)];
    console.log(`Alta/Baja tables found: ${altaMatches.length}`);
    for (const m of altaMatches) {
      const type = m[1];
      const tableHtml = m[2];
      console.log(`\n--- TABLE: ${type} ---`);
      const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
      for (const r of rows) {
        const nameMatch = r[1].match(/<a href="\/[^\/]+\/profil\/spieler\/\d+"[^>]*>([^<]+)<\/a>/);
        const clubMatch = r[1].match(/<a href="\/[^\/]+\/transfers\/verein\/\d+"[^>]*>([^<]+)<\/a>/) || r[1].match(/<td class="no-border-links[^"]*"[^>]*>([\s\S]*?)<\/td>/);
        if (nameMatch) {
          console.log(`  Player: ${nameMatch[1].trim()} | Info: ${clubMatch ? clubMatch[1].replace(/<[^>]+>/g, '').trim() : ''}`);
        }
      }
    }
  } catch (err) {
    console.error('Error fetching transfers for', slug, err);
  }
}

async function main() {
  await checkClubTransfers('universitario-de-deportes', 8488);
}

main();

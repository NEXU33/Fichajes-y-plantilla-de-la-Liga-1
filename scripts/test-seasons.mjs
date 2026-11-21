import fs from 'fs';

async function fetchSeason(saisonId) {
  const url = `https://www.transfermarkt.pe/universitario-de-deportes/transfers/verein/8488/saison_id/${saisonId}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  });
  console.log(`saison_id ${saisonId} -> Status: ${res.status}`);
  const html = await res.text();
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('H2s:', h2s);

  // Search for player rows inside table class="items"
  const tables = [...html.matchAll(/<table class="items">([\s\S]*?)<\/table>/g)];
  console.log('Items tables:', tables.length);
  tables.forEach((t, idx) => {
    console.log(`\nTable ${idx}:`);
    const rows = [...t[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
    for (const r of rows) {
      const nameMatch = r[1].match(/<a href="\/[^\/]+\/profil\/spieler\/\d+"[^>]*>([^<]+)<\/a>/);
      const fromMatch = r[1].match(/<td class="no-border-links[^"]*"[^>]*>([\s\S]*?)<\/td>/);
      const feeMatch = r[1].match(/<td class="rechts[^"]*"[^>]*>([\s\S]*?)<\/td>/);
      if (nameMatch) {
        console.log(`  - ${nameMatch[1].trim()} | From/To: ${fromMatch ? fromMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '-'} | Fee: ${feeMatch ? feeMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '-'}`);
      }
    }
  });
}

async function main() {
  console.log('Checking 2025:');
  await fetchSeason('2025');
  console.log('\nChecking 2024:');
  await fetchSeason('2024');
}

main();

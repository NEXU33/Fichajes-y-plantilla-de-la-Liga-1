import fs from 'fs';

async function main() {
  const url = 'https://www.transfermarkt.pe/universitario-de-deportes/transfers/verein/6593';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  fs.writeFileSync('scripts/u_transfers.html', html);

  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('H2s:', h2s);

  // Parse Altas and Bajas tables
  const sections = html.split(/<h2[^>]*>/);
  for (const s of sections) {
    const titleMatch = s.match(/^([^<]+)<\/h2>/);
    const title = titleMatch ? titleMatch[1].trim() : '';
    if (title === 'Altas' || title === 'Bajas') {
      console.log(`\n=================== ${title.toUpperCase()} ===================`);
      const rows = [...s.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
      for (const r of rows) {
        const nameMatch = r[1].match(/<a href="\/[^\/]+\/profil\/spieler\/\d+"[^>]*>([^<]+)<\/a>/);
        const posMatch = r[1].match(/<td>([^<]+)<\/td>/);
        const fromMatch = r[1].match(/<td class="no-border-links[^"]*"[^>]*>([\s\S]*?)<\/td>/);
        const feeMatch = r[1].match(/<td class="rechts[^"]*"[^>]*>([\s\S]*?)<\/td>/);
        if (nameMatch) {
          const name = nameMatch[1].trim();
          const fromClub = fromMatch ? fromMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '-';
          const fee = feeMatch ? feeMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '-';
          console.log(` * ${name} | Procedencia/Destino: ${fromClub} | Coste/Detalle: ${fee}`);
        }
      }
    }
  }
}

main();

import fs from 'fs';

async function fetchSeason(saisonId) {
  const url = `https://www.transfermarkt.pe/universitario-de-deportes/transfers/verein/8488/saison_id/${saisonId}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  });
  const html = await res.text();
  const posAltas = html.indexOf('Altas');
  console.log(`\n=== Season ${saisonId} Altas (pos: ${posAltas}) ===`);
  const chunk = html.slice(posAltas, posAltas + 3000);
  console.log(chunk.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}

async function main() {
  await fetchSeason('2024');
  await fetchSeason('2023');
}

main();

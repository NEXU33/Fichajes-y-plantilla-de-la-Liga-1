async function checkAlianza(saisonId) {
  const url = `https://www.transfermarkt.pe/club-alianza-lima/transfers/verein/184${saisonId ? `/saison_id/${saisonId}` : ''}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  });
  const html = await res.text();
  const altasMatch = html.match(/<h2>\s*Altas\s*<\/h2>([\s\S]*?)<\/tbody>/i);
  const bajasMatch = html.match(/<h2>\s*Bajas\s*<\/h2>([\s\S]*?)<\/tbody>/i);
  console.log(`Alianza (${saisonId || 'default'}): Status ${res.status}`);
  if (altasMatch) {
    const players = [...altasMatch[1].matchAll(/<td class="hauptlink">\s*<a title="([^"]+)"/g)].map(m => m[1]);
    console.log(`  Altas (${players.length}):`, players.slice(0, 8));
  } else {
    console.log('  Altas: None');
  }
  if (bajasMatch) {
    const players = [...bajasMatch[1].matchAll(/<td class="hauptlink">\s*<a title="([^"]+)"/g)].map(m => m[1]);
    console.log(`  Bajas (${players.length}):`, players.slice(0, 8));
  } else {
    console.log('  Bajas: None');
  }
}

async function main() {
  await checkAlianza('');
  await checkAlianza('2025');
  await checkAlianza('2024');
}

main();

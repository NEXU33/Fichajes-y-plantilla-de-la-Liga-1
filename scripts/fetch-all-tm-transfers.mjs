import fs from 'fs';

const clubs = [
  { slug: 'universitario', name: 'Universitario de Deportes', vereinId: 6593, tmSlug: 'universitario-de-deportes' },
  { slug: 'alianza-lima', name: 'Club Alianza Lima', vereinId: 184, tmSlug: 'club-alianza-lima' },
  { slug: 'sporting-cristal', name: 'Sporting Cristal', vereinId: 1450, tmSlug: 'club-sporting-cristal' },
  { slug: 'fbc-melgar', name: 'FBC Melgar', vereinId: 2734, tmSlug: 'fbc-melgar' },
  { slug: 'cusco-fc', name: 'Cusco FC', vereinId: 28999, tmSlug: 'cusco-fc' },
  { slug: 'cienciano', name: 'Club Cienciano', vereinId: 2729, tmSlug: 'club-cienciano' },
  { slug: 'comerciantes-unidos', name: 'Comerciantes Unidos', vereinId: 47107, tmSlug: 'comerciantes-unidos' },
  { slug: 'sport-boys', name: 'Sport Boys Association', vereinId: 2730, tmSlug: 'sport-boys-association' },
  { slug: 'deportivo-garcilaso', name: 'Deportivo Garcilaso', vereinId: 76945, tmSlug: 'deportivo-garcilaso' },
  { slug: 'alianza-atletico', name: 'Alianza Atlético Sullana', vereinId: 17479, tmSlug: 'alianza-atletico-sullana' },
  { slug: 'sport-huancayo', name: 'Sport Huancayo', vereinId: 21655, tmSlug: 'sport-huancayo' },
  { slug: 'juan-pablo-ii', name: 'Club Juan Pablo II College', vereinId: 99517, tmSlug: 'club-juan-pablo-ii-college' },
  { slug: 'adt-tarma', name: 'Asociación Deportiva Tarma', vereinId: 35588, tmSlug: 'asociacion-deportiva-tarma' },
  { slug: 'los-chankas', name: 'CD Los Chankas CYC', vereinId: 54478, tmSlug: 'cd-los-chankas' },
  { slug: 'atletico-grau', name: 'Club Atlético Grau', vereinId: 27861, tmSlug: 'club-atletico-grau' },
  { slug: 'utc-cajamarca', name: 'UTC Cajamarca', vereinId: 21170, tmSlug: 'utc-cajamarca' },
  { slug: 'fc-cajamarca', name: 'FC Cajamarca', vereinId: 120792, tmSlug: 'fc-cajamarca' },
  { slug: 'deportivo-moquegua', name: 'Deportivo Moquegua', vereinId: 114625, tmSlug: 'ucv-moquegua' }
];

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
    const club = hauptlinks[1] ? hauptlinks[1][1] : (row.includes('Sin equipo') ? 'Sin equipo' : (row.includes('Retirado') ? 'Retirado' : 'Desconocido'));
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

async function fetchClub(club) {
  const url = `https://www.transfermarkt.pe/${club.tmSlug}/transfers/verein/${club.vereinId}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    });
    if (!res.ok) {
      console.log(`Failed ${club.slug}: status ${res.status}`);
      return { altas: [], bajas: [] };
    }
    const html = await res.text();
    const altas = parseTransfers(html, 'Altas');
    const bajas = parseTransfers(html, 'Bajas');
    return { altas, bajas };
  } catch (err) {
    console.error(`Error for ${club.slug}:`, err.message);
    return { altas: [], bajas: [] };
  }
}

async function main() {
  const result = {};
  for (const c of clubs) {
    console.log(`Fetching transfers for ${c.name} (${c.slug})...`);
    const { altas, bajas } = await fetchClub(c);
    console.log(`  -> Altas: ${altas.length}, Bajas: ${bajas.length}`);
    result[c.slug] = {
      name: c.name,
      vereinId: c.vereinId,
      altas,
      bajas
    };
    await new Promise(r => setTimeout(r, 400));
  }
  fs.writeFileSync('scripts/all_tm_transfers_exact.json', JSON.stringify(result, null, 2));
  console.log('Saved exact transfers to scripts/all_tm_transfers_exact.json');
}

main();

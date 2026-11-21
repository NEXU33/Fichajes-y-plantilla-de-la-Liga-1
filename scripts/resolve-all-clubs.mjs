import fs from 'fs';

const clubs = [
  { slug: 'universitario', name: 'Universitario de Deportes', vereinId: 6593, tmSlug: 'universitario-de-deportes' },
  { slug: 'alianza-lima', name: 'Club Alianza Lima', tmSlug: 'club-alianza-lima' },
  { slug: 'sporting-cristal', name: 'Sporting Cristal', tmSlug: 'sporting-cristal-lima' },
  { slug: 'fbc-melgar', name: 'FBC Melgar', tmSlug: 'fbc-melgar' },
  { slug: 'cusco-fc', name: 'Cusco FC', vereinId: 28999, tmSlug: 'cusco-fc' },
  { slug: 'cienciano', name: 'Club Cienciano', vereinId: 2729, tmSlug: 'club-cienciano' },
  { slug: 'comerciantes-unidos', name: 'Comerciantes Unidos', vereinId: 47107, tmSlug: 'comerciantes-unidos' },
  { slug: 'sport-boys', name: 'Sport Boys Association', tmSlug: 'sport-boys-association' },
  { slug: 'deportivo-garcilaso', name: 'Deportivo Garcilaso', tmSlug: 'deportivo-garcilaso' },
  { slug: 'alianza-atletico', name: 'Alianza Atlético Sullana', vereinId: 17479, tmSlug: 'alianza-atletico-sullana' },
  { slug: 'sport-huancayo', name: 'Sport Huancayo', tmSlug: 'sport-huancayo' },
  { slug: 'juan-pablo-ii', name: 'Club Juan Pablo II College', vereinId: 99517, tmSlug: 'club-juan-pablo-ii-college' },
  { slug: 'adt-tarma', name: 'Asociación Deportiva Tarma', vereinId: 35588, tmSlug: 'asociacion-deportiva-tarma' },
  { slug: 'los-chankas', name: 'CD Los Chankas CYC', vereinId: 54478, tmSlug: 'cd-los-chankas' },
  { slug: 'atletico-grau', name: 'Club Atlético Grau', tmSlug: 'club-atletico-grau' },
  { slug: 'utc-cajamarca', name: 'UTC Cajamarca', tmSlug: 'universidad-tecnica-de-cajamarca' },
  { slug: 'fc-cajamarca', name: 'FC Cajamarca', tmSlug: 'fc-cajamarca' },
  { slug: 'deportivo-moquegua', name: 'Deportivo Moquegua', tmSlug: 'deportivo-moquegua' }
];

async function resolveVerein(club) {
  if (club.vereinId) return club.vereinId;
  const res = await fetch(`https://www.transfermarkt.pe/schnellsuche/ergebnis/schnellsuche?query=${encodeURIComponent(club.name)}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  });
  const html = await res.text();
  const m = html.match(/\/([a-z0-9\-]+)\/startseite\/verein\/(\d+)/) ||
            html.match(/\/([a-z0-9\-]+)\/[^\/]+\/verein\/(\d+)/);
  if (m) {
    club.tmSlug = m[1];
    club.vereinId = parseInt(m[2]);
    return club.vereinId;
  }
  return null;
}

async function main() {
  for (const c of clubs) {
    const id = await resolveVerein(c);
    console.log(`${c.slug} -> ${c.tmSlug} (verein: ${id})`);
  }
  fs.writeFileSync('scripts/resolved_clubs_tm.json', JSON.stringify(clubs, null, 2));
}

main();

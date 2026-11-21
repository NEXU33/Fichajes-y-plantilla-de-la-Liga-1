import fs from 'fs';

async function searchTM(query) {
  try {
    const res = await fetch(`https://www.transfermarkt.pe/schnellsuche/ergebnis/schnellsuche?query=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/<img[^>]+src=["'](https:\/\/img\.a\.transfermarkt\.technology\/portrait\/[^"']+)["'][^>]*title=["']([^"']+)["']/i);
    if (m && !m[1].includes('default')) {
      const cleanPhoto = m[1].replace('/small/', '/header/').replace('/medium/', '/header/');
      return { photo: cleanPhoto, name: m[2] };
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

const p = JSON.parse(fs.readFileSync('scripts/active_players_2026.json', 'utf8'));
const withoutPhoto = p.filter(x => !x.photo_url || x.photo_url.length <= 5 || x.photo_url.includes('default'));

const testSubset = withoutPhoto.slice(0, 15);
for (const item of testSubset) {
  const res = await searchTM(item.name);
  console.log(`${item.name} (${item.team}) ->`, res?.photo || 'NOT FOUND');
}

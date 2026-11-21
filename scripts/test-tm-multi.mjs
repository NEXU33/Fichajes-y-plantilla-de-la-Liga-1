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
    // Look for portrait image
    const m = html.match(/<img[^>]+src=["'](https:\/\/img\.a\.transfermarkt\.technology\/portrait\/[^"']+)["'][^>]*title=["']([^"']+)["']/i);
    if (m) {
      // Convert /small/ or /header/ to /header/
      const cleanPhoto = m[1].replace('/small/', '/header/').replace('/medium/', '/header/');
      return { photo: cleanPhoto, name: m[2] };
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

const list = ['Paolo Guerrero', 'Hernan Barcos', 'Sebastian Britos', 'Bernardo Cuesta', 'Bryan Reyna', 'Jhilmar Lora', 'Angelo Campos', 'Kevin Becerra'];
for (const p of list) {
  const r = await searchTM(p);
  console.log(`${p} ->`, r);
}

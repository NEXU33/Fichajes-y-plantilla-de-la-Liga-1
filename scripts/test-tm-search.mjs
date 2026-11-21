async function test() {
  const res = await fetch('https://www.transfermarkt.pe/schnellsuche/ergebnis/schnellsuche?query=Alex+Valera', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('Length:', html.length);
  const m = html.match(/<img[^>]+src=["'](https:\/\/img\.a\.transfermarkt\.technology\/portrait\/[^"']+)["'][^>]*title=["']([^"']+)["']/i);
  console.log('Found:', m ? { photo: m[1], title: m[2] } : 'No match');
}
test();

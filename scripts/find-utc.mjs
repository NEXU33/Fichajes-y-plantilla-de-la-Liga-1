async function main() {
  const res = await fetch('https://www.transfermarkt.pe/schnellsuche/ergebnis/schnellsuche?query=UTC', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  const matches = [...html.matchAll(/\/([a-z0-9\-]+)\/[^\/]+\/verein\/(\d+)/g)];
  console.log('UTC matches:', matches.filter(m => m[1].includes('cajamarca') || m[1].includes('utc')).map(m => `${m[1]} -> ${m[2]}`));
}
main();

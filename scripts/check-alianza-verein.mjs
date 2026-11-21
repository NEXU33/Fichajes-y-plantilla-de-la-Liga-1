async function main() {
  const res = await fetch('https://www.transfermarkt.pe/club-alianza-lima/startseite/verein/184', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  console.log('Verein 184 final URL:', res.url);
  const text = await res.text();
  const title = text.match(/<title>([^<]+)<\/title>/)?.[1];
  console.log('Title:', title);

  const res2 = await fetch('https://www.transfermarkt.pe/schnellsuche/ergebnis/schnellsuche?query=Alianza+Lima', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const text2 = await res2.text();
  const matches = [...text2.matchAll(/\/([a-z0-9\-]+)\/startseite\/verein\/(\d+)/g)];
  console.log('Alianza matches:');
  for (const m of matches) {
    console.log(`  ${m[1]} -> ${m[2]}`);
  }
}
main();

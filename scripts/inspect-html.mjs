import fs from 'fs';

async function inspectHtml() {
  const res = await fetch('https://www.transfermarkt.pe/club-juan-pablo-ii-college/kader/verein/99517', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  });
  const html = await res.text();
  const rows = [...html.matchAll(/<tr class="(?:odd|even)">([\s\S]*?)<\/tr>/g)];
  if (rows.length > 0) {
    fs.writeFileSync('scripts/sample_row_jpii.html', rows[0][1]);
    console.log('Saved sample row 0. Length of row:', rows[0][1].length);
  }
}

inspectHtml();

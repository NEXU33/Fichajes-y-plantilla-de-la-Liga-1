import fs from 'fs';

async function checkFlags() {
  const resAdt = await fetch('https://www.transfermarkt.pe/asociacion-deportiva-tarma/kader/verein/35588', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  });
  const html = await resAdt.text();
  
  // Find where Lucumi is
  const lucumiIdx = html.indexOf('Lucum');
  if (lucumiIdx !== -1) {
    console.log('--- Context around Lucumi ---');
    console.log(html.slice(lucumiIdx - 200, lucumiIdx + 600));
  }

  // Find Bauman
  const baumanIdx = html.indexOf('Bauman');
  if (baumanIdx !== -1) {
    console.log('\n--- Context around Bauman ---');
    console.log(html.slice(baumanIdx - 200, baumanIdx + 600));
  }
}

checkFlags();

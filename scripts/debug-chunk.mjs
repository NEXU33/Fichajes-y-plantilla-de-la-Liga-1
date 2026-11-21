import fs from 'fs';

async function debugChunk() {
  const resAdt = await fetch('https://www.transfermarkt.pe/asociacion-deportiva-tarma/kader/verein/35588', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  });
  const html = await resAdt.text();
  const tbodyM = html.match(/<table class="items">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/);
  const tbody = tbodyM[1];
  const chunks = tbody.split(/<tr class="(?:odd|even)">/);
  
  for (const c of chunks) {
    if (c.includes('Lucum')) {
      console.log('=== CHUNK LUCUMI ===');
      console.log(c);
      const matches = [...c.matchAll(/<img[^>]*class="flaggenrahmen"[^>]*title="([^"]+)"/g)];
      console.log('Matches:', matches.map(m => m[1]));
      const allImgs = [...c.matchAll(/<img[^>]*>/g)].map(m => m[0]);
      console.log('All imgs:', allImgs);
    }
  }
}

debugChunk();

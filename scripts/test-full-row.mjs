import fs from 'fs';

async function testFullRow() {
  const res = await fetch('https://www.transfermarkt.pe/club-juan-pablo-ii-college/kader/verein/99517', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  });
  const html = await res.text();
  
  // Cut the tbody of class="items"
  const tbodyM = html.match(/<table class="items">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/);
  if (!tbodyM) {
    console.log('tbody not found');
    return;
  }
  const tbody = tbodyM[1];
  
  // Split by `<tr class="odd">` or `<tr class="even">`
  const chunks = tbody.split(/<tr class="(?:odd|even)">/);
  console.log('Chunks found:', chunks.length);
  
  if (chunks.length > 1) {
    fs.writeFileSync('scripts/chunk1.html', chunks[1]);
    console.log('Saved chunk 1. Length:', chunks[1].length);
  }
}

testFullRow();

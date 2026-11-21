import fs from 'fs';

async function checkData() {
  // Check ADT page for Cedron
  console.log('Fetching ADT page...');
  const resAdt = await fetch('https://www.transfermarkt.pe/asociacion-deportiva-tarma/kader/verein/35588', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  });
  const htmlAdt = await resAdt.text();
  const hasCedron = htmlAdt.toLowerCase().includes('cedr');
  console.log('ADT HTML contains "cedr":', hasCedron);
  if (hasCedron) {
    const idx = htmlAdt.toLowerCase().indexOf('cedr');
    console.log('Context around Cedron in ADT:', htmlAdt.slice(Math.max(0, idx - 200), idx + 400));
  }

  // Also fetch Cedron's profile if needed
  const resCedron = await fetch('https://www.transfermarkt.pe/victor-cedron/profil/spieler/193937', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  });
  const htmlCedron = await resCedron.text();
  console.log('Cedron profile club info:');
  const clubM = htmlCedron.match(/<span class="data-header__club">[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
  console.log('Club:', clubM ? clubM[1].trim() : 'not found');
  const numM = htmlCedron.match(/<span class="data-header__shirt-number">\s*#(\d+)\s*<\/span>/);
  console.log('Shirt number:', numM ? numM[1] : 'not found');
  const posM = htmlCedron.match(/<li class="data-header__label">\s*Posición:\s*<span class="data-header__content">\s*([^<]+)\s*<\/span>/);
  console.log('Position:', posM ? posM[1].trim() : 'not found');
  const valM = htmlCedron.match(/<div class="data-header__market-value-wrapper">[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
  console.log('Market value:', valM ? valM[1].trim() : 'not found');
  const contractM = htmlCedron.match(/Contrato hasta:[\s\S]*?<span class="data-header__content">([^<]+)<\/span>/);
  console.log('Contract:', contractM ? contractM[1].trim() : 'not found');
}

checkData();

import fs from 'fs';

const clubFiles = fs.readdirSync('scripts/besoccer_clubs').filter(f => f.endsWith('.html'));

const allParsed = [];

for (const file of clubFiles) {
  const slug = file.replace('.html', '');
  const html = fs.readFileSync(`scripts/besoccer_clubs/${file}`, 'utf8');

  // Find club title
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const clubName = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').replace(/Fichajes y traspasos\s*/i, '').replace(/: llegadas y salidas.*/i, '').trim() : slug;

  // Each page has tables for seasons. We want 2026.
  // In BeSoccer club pages:
  // <li class="sign-list"> has <p class="date">... 2026</p>
  const liMatches = html.split('<li class="sign-list">');

  const altas2026 = [];
  const bajas2026 = [];

  for (let i = 1; i < liMatches.length; i++) {
    const li = liMatches[i].split('</li>')[0];
    const nameMatch = li.match(/<p class="pl-name[^"]*">([\s\S]*?)<\/p>/i);
    const name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : '';
    const dateMatch = li.match(/<p class="date[^"]*">([\s\S]*?)<\/p>/i);
    const date = dateMatch ? dateMatch[1].replace(/<[^>]+>/g, '').trim() : '';
    const linkMatch = li.match(/href="([^"]+)"/i);
    const url = linkMatch ? linkMatch[1] : '';
    const imgMatch = li.match(/<div class="row-img player">\s*<img[^>]*src="([^"]+)"/i);
    const photo = imgMatch ? imgMatch[1] : '';
    const shieldMatch = li.match(/<div class="row-img shield">\s*<img[^>]*alt="([^"]*)"[^>]*src="([^"]+)"/i);
    const otherClub = shieldMatch ? shieldMatch[1] : '';
    const transferTypeMatch = li.match(/<div class="data-transfer[^"]*">([\s\S]*?)<\/div>/i);
    const transferInfo = transferTypeMatch ? transferTypeMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

    // Check year: ONLY 2026!
    if (!date.includes('2026')) continue;

    // Check if Alta or Baja by looking at preceding table-head
    const prevHtml = html.substring(0, html.indexOf(liMatches[i]));
    const lastTableHead = prevHtml.lastIndexOf('<div class="table-head">');
    const tableHeadText = lastTableHead !== -1 ? prevHtml.substring(lastTableHead, lastTableHead + 60).replace(/<[^>]+>/g, '').trim() : '';

    const isAlta = tableHeadText.toLowerCase().includes('alta') || tableHeadText.toLowerCase().includes('llegada');

    const item = {
      name,
      date,
      otherClub,
      transferInfo,
      url,
      photo
    };

    if (isAlta) {
      altas2026.push(item);
    } else {
      bajas2026.push(item);
    }
  }

  allParsed.push({
    slug,
    clubName,
    altasCount: altas2026.length,
    bajasCount: bajas2026.length,
    altas: altas2026,
    bajas: bajas2026
  });
}

console.log('=== SUMMARY OF ALL 18 CLUBS (FULL 2026 SEASON FROM BESOCCER CLUB PAGES) ===');
let totalAltas = 0;
let totalBajas = 0;
for (const c of allParsed) {
  totalAltas += c.altasCount;
  totalBajas += c.bajasCount;
  console.log(`${c.clubName.padEnd(25)} | Altas: ${String(c.altasCount).padStart(2)} | Bajas: ${String(c.bajasCount).padStart(2)}`);
}
console.log('---');
console.log(`TOTAL: ${totalAltas} Altas, ${totalBajas} Bajas across all 18 clubs!`);

fs.writeFileSync('scripts/besoccer_full_season_2026.json', JSON.stringify(allParsed, null, 2));

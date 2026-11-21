import fs from 'fs';

const html = fs.readFileSync('scripts/besoccer_club_cienciano.html', 'utf8');

// Parse all sign-list items in this page
const liMatches = html.split('<li class="sign-list">');
console.log('Total sign-list items:', liMatches.length - 1);

const signs = [];
for (let i = 1; i < liMatches.length; i++) {
  const li = liMatches[i].split('</li>')[0];
  const nameMatch = li.match(/<p class="pl-name[^"]*">([\s\S]*?)<\/p>/i);
  const name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  const dateMatch = li.match(/<p class="date[^"]*">([\s\S]*?)<\/p>/i);
  const date = dateMatch ? dateMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  const linkMatch = li.match(/href="([^"]+)"/i);
  const url = linkMatch ? linkMatch[1] : '';
  const shieldMatch = li.match(/<div class="row-img shield">\s*<img[^>]*alt="([^"]*)"[^>]*src="([^"]+)"/i);
  const otherClub = shieldMatch ? shieldMatch[1] : '';
  const transferTypeMatch = li.match(/<div class="data-transfer[^"]*">([\s\S]*?)<\/div>/i);
  const transferInfo = transferTypeMatch ? transferTypeMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

  // Determine if it's in Alta or Baja
  const prevHtml = html.substring(0, html.indexOf(liMatches[i]));
  const lastTableHead = prevHtml.lastIndexOf('<div class="table-head">');
  const tableHeadText = lastTableHead !== -1 ? prevHtml.substring(lastTableHead, lastTableHead + 60).replace(/<[^>]+>/g, '').trim() : '';

  signs.push({
    name,
    date,
    otherClub,
    transferInfo,
    type: tableHeadText,
    url
  });
}

console.log('--- CIENCIANO ALL SIGNS ON BESOCCER ---');
for (const s of signs) {
  console.log(`[${s.type}] ${s.name} | ${s.date} | ${s.otherClub} | ${s.transferInfo}`);
}

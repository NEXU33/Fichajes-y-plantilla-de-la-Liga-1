import fs from 'fs';

const html = fs.readFileSync('scripts/besoccer_clausura_peru.html', 'utf8');

// Find all panels in #transfers-panel
const panelRegex = /<div class="panel-head"[^>]*>[\s\S]*?<h3 class="panel-title[^"]*">([\s\S]*?)<\/h3>[\s\S]*?<\/div>\s*<div class="panel-body[\s\S]*?<\/table>\s*<\/div>\s*<\/div>/gi;

// Let's split by <div class="panel-head"
const parts = html.split('<div class="panel-head"');
console.log('Total panel parts:', parts.length);

const clubsData = [];

for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  const clubTitleMatch = part.match(/<h3 class="panel-title[^"]*">([\s\S]*?)<\/h3>/i);
  if (!clubTitleMatch) continue;
  const clubName = clubTitleMatch[1].replace(/<[^>]+>/g, '').trim();

  // Find Alta section and Baja section
  // Usually <div class="table-head">Alta</div> ... <div class="table-head">Baja</div>
  const altaIdx = part.indexOf('<div class="table-head">Alta</div>');
  const bajaIdx = part.indexOf('<div class="table-head">Baja</div>');

  let altaPart = '';
  let bajaPart = '';

  if (altaIdx !== -1 && bajaIdx !== -1) {
    altaPart = part.substring(altaIdx, bajaIdx);
    bajaPart = part.substring(bajaIdx);
  } else if (altaIdx !== -1) {
    altaPart = part.substring(altaIdx);
  } else if (bajaIdx !== -1) {
    bajaPart = part.substring(bajaIdx);
  }

  function parseSigns(sectionHtml) {
    const signs = [];
    const liMatches = sectionHtml.split('<li class="sign-list">');
    for (let j = 1; j < liMatches.length; j++) {
      const li = liMatches[j].split('</li>')[0];
      const linkMatch = li.match(/href="([^"]+)"/i);
      const url = linkMatch ? linkMatch[1] : '';
      const nameMatch = li.match(/<p class="pl-name[^"]*">([\s\S]*?)<\/p>/i);
      const name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      const dateMatch = li.match(/<p class="date[^"]*">([\s\S]*?)<\/p>/i);
      const date = dateMatch ? dateMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      const imgMatch = li.match(/<div class="row-img player">\s*<img[^>]*src="([^"]+)"/i);
      const photo = imgMatch ? imgMatch[1] : '';
      
      // Other club shield & name
      const shieldMatch = li.match(/<div class="row-img shield">\s*<img[^>]*alt="([^"]*)"[^>]*src="([^"]+)"/i);
      const otherClubName = shieldMatch ? shieldMatch[1] : '';
      const otherClubShield = shieldMatch ? shieldMatch[2] : '';

      // Transfer text (e.g. Fichaje gratis, Fin de cesión, Cesión, etc.)
      const transferTypeMatch = li.match(/<div class="data-transfer[^"]*">([\s\S]*?)<\/div>/i);
      const transferInfo = transferTypeMatch ? transferTypeMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

      if (name) {
        signs.push({
          name,
          date,
          url,
          photo,
          otherClubName,
          otherClubShield,
          transferInfo
        });
      }
    }
    return signs;
  }

  const altas = parseSigns(altaPart);
  const bajas = parseSigns(bajaPart);

  clubsData.push({
    clubName,
    altasCount: altas.length,
    bajasCount: bajas.length,
    altas,
    bajas
  });
}

console.log('Parsed clubs:', clubsData.map(c => `${c.clubName}: ${c.altasCount} altas, ${c.bajasCount} bajas`));
fs.writeFileSync('scripts/besoccer_transfers_parsed.json', JSON.stringify(clubsData, null, 2));

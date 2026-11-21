import fs from 'fs';

const html = fs.readFileSync('scripts/besoccer_clausura_peru_latest.html', 'utf8');

const parts = html.split('<div class="panel-head"');
const clubLinks = [];

for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  const clubTitleMatch = part.match(/<h3 class="panel-title[^"]*">([\s\S]*?)<\/h3>/i);
  if (!clubTitleMatch) continue;
  const clubName = clubTitleMatch[1].replace(/<[^>]+>/g, '').trim();

  const linkMatch = part.match(/<a class="color-green"[^>]*href="([^"]+)"/i);
  const link = linkMatch ? linkMatch[1] : '';

  clubLinks.push({ clubName, link });
}

console.log('Total club links found:', clubLinks.length);
console.log(JSON.stringify(clubLinks, null, 2));

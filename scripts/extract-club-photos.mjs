import fs from 'fs';
import path from 'path';

const clubsDir = 'scripts/besoccer_clubs';
const files = fs.readdirSync(clubsDir).filter(f => f.endsWith('.html'));

const foundPhotos = {};

for (const file of files) {
  const html = fs.readFileSync(path.join(clubsDir, file), 'utf8');
  // Match player links or images
  // Example: <a href="...es.besoccer.com/jugador/..." title="Paolo Guerrero">...<img src="..." ...
  // or <img ... src="https://cdn.resfu.com/img_data/players/..." ... alt="..."
  const regex = /<img[^>]+src=["'](https:\/\/cdn\.resfu\.com\/img_data\/players\/[^"']+)["'][^>]*alt=["']([^"']+)["']/g;
  let m;
  while ((m = regex.exec(html)) !== null) {
    const photoUrl = m[1];
    const rawName = m[2].trim();
    if (rawName && !rawName.toLowerCase().includes('escudo') && !rawName.toLowerCase().includes('logo')) {
      foundPhotos[rawName.toLowerCase()] = {
        name: rawName,
        photo: photoUrl,
        club: file.replace('.html', '')
      };
    }
  }
}

console.log('Total extracted player photos from BeSoccer club HTMLs:', Object.keys(foundPhotos).length);
console.log('Sample extracted photos:', Object.values(foundPhotos).slice(0, 10));

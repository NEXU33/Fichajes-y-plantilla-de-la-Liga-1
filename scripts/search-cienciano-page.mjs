import fs from 'fs';

const html = fs.readFileSync('scripts/besoccer_club_cienciano.html', 'utf8');

console.log('Title:', html.match(/<title>([^<]+)<\/title>/i)?.[1]);

// Search for Becerra
const bMatches = [...html.matchAll(/([^\n<]{0,100}becerra[^\n<]{0,100})/gi)];
console.log('Becerra matches:', bMatches.map(m => m[1].trim()));

// Search for Nuñez or Nunez
const nMatches = [...html.matchAll(/([^\n<]{0,100}nu[ñn]ez[^\n<]{0,100})/gi)];
console.log('Nunez matches:', nMatches.map(m => m[1].trim()));

// Search for "01 ene 2026" or "ENE 2026"
const dateMatches = [...html.matchAll(/([^\n<]{0,100}2026[^\n<]{0,100})/gi)];
console.log('2026 matches count:', dateMatches.length);
console.log('Sample 2026 lines:', dateMatches.slice(0, 15).map(m => m[1].trim()));

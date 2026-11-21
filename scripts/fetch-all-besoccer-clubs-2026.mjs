import fs from 'fs';
import { execSync } from 'child_process';

const clubLinks = [
  { clubName: 'ADT de Tarma', slug: 'adt-tarma', url: 'https://es.besoccer.com/equipo/fichajes/adt-tarma' },
  { clubName: 'Alianza Atlético', slug: 'alianza-atletico', url: 'https://es.besoccer.com/equipo/fichajes/alianza-atletico-sullana' },
  { clubName: 'Alianza Lima', slug: 'alianza-lima', url: 'https://es.besoccer.com/equipo/fichajes/alianza-lima' },
  { clubName: 'Atlético Grau', slug: 'atletico-grau', url: 'https://es.besoccer.com/equipo/fichajes/atletico-grau' },
  { clubName: 'Cienciano', slug: 'cienciano', url: 'https://es.besoccer.com/equipo/fichajes/club-cienciano' },
  { clubName: 'Comerciantes Unidos', slug: 'comerciantes-unidos', url: 'https://es.besoccer.com/equipo/fichajes/comerciantes-unidos' },
  { clubName: 'Cusco FC', slug: 'cusco-fc', url: 'https://es.besoccer.com/equipo/fichajes/real-atletico' },
  { clubName: 'Deportivo Garcilaso', slug: 'deportivo-garcilaso', url: 'https://es.besoccer.com/equipo/fichajes/club-deportivo-garcilaso' },
  { clubName: 'Deportivo Moquegua', slug: 'deportivo-moquegua', url: 'https://es.besoccer.com/equipo/fichajes/ucv-moquegua' },
  { clubName: 'FBC Melgar', slug: 'fbc-melgar', url: 'https://es.besoccer.com/equipo/fichajes/fbc-melgar-arequipa' },
  { clubName: 'FC Cajamarca', slug: 'fc-cajamarca', url: 'https://es.besoccer.com/equipo/fichajes/fc-cajamarca' },
  { clubName: 'Juan Pablo II College', slug: 'juan-pablo-ii', url: 'https://es.besoccer.com/equipo/fichajes/juan-pablo-ii-college' },
  { clubName: 'Los Chankas', slug: 'los-chankas', url: 'https://es.besoccer.com/equipo/fichajes/santa-rosa-de-pucallpa' },
  { clubName: 'Sport Boys Association', slug: 'sport-boys', url: 'https://es.besoccer.com/equipo/fichajes/sport-boys-callao' },
  { clubName: 'Sport Huancayo', slug: 'sport-huancayo', url: 'https://es.besoccer.com/equipo/fichajes/sport-huancayo' },
  { clubName: 'Sporting Cristal', slug: 'sporting-cristal', url: 'https://es.besoccer.com/equipo/fichajes/sporting-cristal-lima' },
  { clubName: 'UTC Cajamarca', slug: 'utc-cajamarca', url: 'https://es.besoccer.com/equipo/fichajes/utc-cajamarca' },
  { clubName: 'Universitario Deportes', slug: 'universitario', url: 'https://es.besoccer.com/equipo/fichajes/universitario-lima' }
];

if (!fs.existsSync('scripts/besoccer_clubs')) {
  fs.mkdirSync('scripts/besoccer_clubs', { recursive: true });
}

console.log('Downloading 18 BeSoccer club pages...');
for (const club of clubLinks) {
  const filePath = `scripts/besoccer_clubs/${club.slug}.html`;
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 10000) {
    console.log(`[CACHED] ${club.clubName}`);
    continue;
  }
  console.log(`[FETCHING] ${club.clubName} from ${club.url}...`);
  try {
    execSync(`curl.exe -s "${club.url}" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" -H "Accept-Language: es-ES,es;q=0.9" -o "${filePath}"`);
    console.log(`  -> Saved ${filePath} (${fs.statSync(filePath).size} bytes)`);
  } catch (err) {
    console.error(`  -> Error fetching ${club.clubName}:`, err.message);
  }
}
console.log('Done downloading club pages.');

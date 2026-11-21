import fs from 'fs';
import path from 'path';

const outDir = 'scripts/kit_images';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Data extracted from the page
const kits = [
  { club: 'Alianza Lima', slug: 'alianza-lima', img: '/cdn/2026/03/07/gkwx9pQtWGXJJLs-small/camiseta-local-alianza-lima-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-alianza-lima-2026-434920/' },
  { club: 'AD Tarma', slug: 'ad-tarma', img: '/cdn/2026/01/20/YNpvoS07yVjr9sn-small/camiseta-local-ad-tarma-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-ad-tarma-2026-446591/' },
  { club: 'Alianza Atlético Sullana', slug: 'alianza-atletico-sullana', img: '/cdn/2026/05/04/qZmb0YKBUrVGYW8-small/camiseta-local-alianza-atletico-sullana-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-alianza-atletico-sullana-2026-446660/' },
  { club: 'Atlético Grau', slug: 'atletico-grau', img: '/cdn/2026/01/26/U56gsXMGjtJwSXC-small/camiseta-local-atletico-grau-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-atletico-grau-2026-449231/' },
  { club: 'CD Moquegua', slug: 'cd-moquegua', img: '/cdn/2026/02/06/FHKqFCLazPtj1MU-small/camiseta-local-cd-moquegua-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-cd-moquegua-2026-449234/' },
  { club: 'Cienciano', slug: 'cienciano', img: '/cdn/2026/01/31/6t1BmC4FdEZ2LE2-small/camiseta-local-cienciano-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-cienciano-2026-448463/' },
  { club: 'Comerciantes Unidos', slug: 'comerciantes-unidos', img: '/cdn/2026/05/04/iJwCBEGLjoACny9-small/camiseta-local-comerciantes-unidos-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-comerciantes-unidos-2026-447724/' },
  { club: 'Sport Huancayo', slug: 'csd-sport-huancayo', img: '/cdn/2026/02/06/BVKv5G6rIVIljyl-small/camiseta-local-csd-sport-huancayo-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-csd-sport-huancayo-2026-449603/' },
  { club: 'Cusco FC', slug: 'cusco-fc', img: '/cdn/2026/02/06/0yivsFmslAWgcHZ-small/camiseta-local-cusco-fc-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-cusco-fc-2026-446925/' },
  { club: 'Deportivo Garcilaso', slug: 'deportivo-garcilaso', img: '/cdn/2026/05/04/lSxAUIo8dzn2Eal-small/camiseta-local-deportivo-garcilaso-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-deportivo-garcilaso-2026-460331/' },
  { club: 'FBC Melgar', slug: 'fbc-melgar', img: '/cdn/2025/12/17/BxeTD1W4i95KxjH-small/camiseta-local-fbc-melgar-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-fbc-melgar-2026-437499/' },
  { club: 'FC Cajamarca', slug: 'fc-cajamarca', img: '/cdn/2026/01/31/sFaDXVsY7Pr3TX1-small/camiseta-local-fc-cajamarca-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-fc-cajamarca-2026-441723/' },
  { club: 'Juan Pablo II College', slug: 'juan-pablo-ii-college', img: '/cdn/2026/02/06/MjDjx1VVQbmKuXf-small/camiseta-local-juan-pablo-ii-college-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-juan-pablo-ii-college-2026-447723/' },
  { club: 'Los Chankas', slug: 'los-chankas', img: '/cdn/2026/05/04/iKhFymPVNbBR5cK-small/camiseta-local-los-chankas-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-los-chankas-2026-479107/' },
  { club: 'Sport Boys', slug: 'sport-boys-association', img: '/cdn/2026/02/06/FjAK1JkWXgXdH0C-small/camiseta-local-sport-boys-association-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-sport-boys-association-2026-437759/' },
  { club: 'Sporting Cristal', slug: 'sporting-cristal', img: '/cdn/2026/02/06/VXy04D5HpUSX7tI-small/camiseta-local-sporting-cristal-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-sporting-cristal-2026-443589/' },
  { club: 'Universitario de Deportes', slug: 'universitario-de-deportes', img: '/cdn/2026/02/05/fvNbPZSDwe27wfU-small/camiseta-local-universitario-de-deportes-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-universitario-de-deportes-2026-434402/' },
  { club: 'UTC Cajamarca', slug: 'utc', img: '/cdn/2026/02/06/1kcBN1kADPL5aeB-small/camiseta-local-utc-2026.jpg', url: 'https://www.footballkitarchive.com/es/camiseta-local-utc-2026-445544/' }
];

async function downloadAll() {
  console.log(`Starting download of ${kits.length} official 2026 Local kit images...`);
  
  for (const k of kits) {
    // If '-small/' is in the URL, we can also try the high-res by removing '-small/'
    const highResImg = k.img.replace('-small/', '/');
    const fullUrl = 'https://www.footballkitarchive.com' + highResImg;
    const fallbackUrl = 'https://www.footballkitarchive.com' + k.img;

    try {
      let res = await fetch(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) {
        res = await fetch(fallbackUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      }
      
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        const filePath = path.join(outDir, `${k.slug}_local_2026.jpg`);
        fs.writeFileSync(filePath, buffer);
        console.log(`✅ Downloaded: ${k.club} -> ${filePath} (${buffer.length} bytes)`);
      } else {
        console.log(`❌ Failed: ${k.club} (Status: ${res.status})`);
      }
    } catch (e) {
      console.error(`Error downloading ${k.club}:`, e.message);
    }
  }

  // Also copy to browser_evidence for user artifacts
  const evidenceDir = 'C:/Users/NEXU/.gemini/antigravity/brain/6088883f-c94b-4021-9d1a-dd8a195ffcc6/browser_evidence/kits_2026';
  if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });

  const files = fs.readdirSync(outDir);
  for (const f of files) {
    fs.copyFileSync(path.join(outDir, f), path.join(evidenceDir, f));
  }
  console.log(`Copied ${files.length} kits to browser_evidence/kits_2026!`);
}

downloadAll();

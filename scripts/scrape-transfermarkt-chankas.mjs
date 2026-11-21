import fs from 'fs';

async function fetchRoster() {
  const url = 'https://www.transfermarkt.pe/cd-los-chankas/kader/verein/54478';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    });
    const html = await res.text();
    
    // Find all player rows in the tbody of items
    const rows = [...html.matchAll(/<tr class="(?:odd|even)">([\s\S]*?)<\/tr>/g)];
    console.log('Total table rows found:', rows.length);
    
    const extracted = [];
    for (const r of rows) {
      const rowContent = r[1];
      // Jersey number
      const numMatch = rowContent.match(/<div class="rn_nummer">(\d+)<\/div>/);
      const number = numMatch ? parseInt(numMatch[1]) : null;
      
      // Player name & link
      const nameMatch = rowContent.match(/<a href="\/[^\/]+\/profil\/spieler\/\d+"[^>]*>([^<]+)<\/a>/);
      const name = nameMatch ? nameMatch[1].trim() : null;
      
      // Position
      const posMatch = rowContent.match(/<td>([^<]+)<\/td>\s*<\/tr>/) || rowContent.match(/<td>(Portero|Defensa central|Lateral izquierdo|Lateral derecho|Pivote|Mediocentro|Mediapunta|Extremo izquierdo|Extremo derecho|Delantero centro)<\/td>/i);
      
      // Nationality
      const natMatches = [...rowContent.matchAll(/<img[^>]*class="flaggenrahmen"[^>]*title="([^"]+)"/g)];
      const nationalities = natMatches.map(m => m[1]).join(' / ');
      
      // Market value
      const valMatch = rowContent.match(/<td class="rechts hauptlink">([^<]+)<\/td>/);
      const marketValue = valMatch ? valMatch[1].trim() : null;
      
      if (name) {
        extracted.push({ number, name, nationalities, marketValue, raw: rowContent.slice(0, 150) });
      }
    }
    
    console.log(`Extracted ${extracted.length} players from Transfermarkt:`);
    extracted.forEach((p, i) => {
      console.log(`${i + 1}. #${p.number || '-'} ${p.name} | ${p.nationalities} | ${p.marketValue}`);
    });
    
    fs.writeFileSync('scripts/chankas_parsed.json', JSON.stringify(extracted, null, 2));
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

fetchRoster();

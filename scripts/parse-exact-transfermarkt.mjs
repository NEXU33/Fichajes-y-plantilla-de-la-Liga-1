async function parseDetails() {
  const url = 'https://www.transfermarkt.pe/cd-los-chankas/kader/verein/54478';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  });
  const html = await res.text();
  
  const rows = [...html.matchAll(/<tr class="(?:odd|even)">([\s\S]*?)<\/tr>/g)];
  
  const squad = [];
  for (const r of rows) {
    const text = r[1];
    
    // Name
    const nameM = text.match(/<a href="\/[^\/]+\/profil\/spieler\/\d+"[^>]*>([^<]+)<\/a>/);
    if (!nameM) continue;
    const name = nameM[1].trim();
    
    // Jersey number
    const numM = text.match(/<div class="rn_nummer">(\d+)<\/div>/);
    const num = numM ? parseInt(numM[1]) : null;
    
    // Position (in the second row of the player inline-table)
    const posM = text.match(/<td>(Portero|Defensa central|Lateral izquierdo|Lateral derecho|Pivote|Mediocentro|Mediapunta|Extremo izquierdo|Extremo derecho|Delantero centro)<\/td>/i);
    const pos = posM ? posM[1].trim() : 'Futbolista';
    
    // Nationality
    const natM = text.match(/<img[^>]*class="flaggenrahmen"[^>]*title="([^"]+)"/);
    const nat = natM ? natM[1].trim() : 'Peruano';
    
    // Value in EUR
    const valM = text.match(/<td class="rechts hauptlink">([^<]+)<\/td>/);
    let eur = 150000;
    if (valM) {
      const vStr = valM[1].trim();
      if (vStr.includes('millón') || vStr.includes('millones') || vStr.includes('mil mill.')) {
        eur = Math.round(parseFloat(vStr.replace(/[^\d,]/g, '').replace(',', '.')) * 1000000);
      } else if (vStr.includes('mil') || vStr.includes('k')) {
        eur = Math.round(parseFloat(vStr.replace(/[^\d,]/g, '').replace(',', '.')) * 1000);
      }
    }
    
    squad.push({ num, name, pos, nat, eur });
  }
  
  console.log(JSON.stringify(squad, null, 2));
}

parseDetails();

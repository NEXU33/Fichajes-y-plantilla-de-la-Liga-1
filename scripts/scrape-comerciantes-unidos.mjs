import fs from 'fs';

function extractNationalities(chunk) {
  const flagImgs = [...chunk.matchAll(/<img[^>]*class="[^"]*flaggenrahmen[^"]*"[^>]*>/g)].map(m => m[0]);
  const countries = [];
  for (const img of flagImgs) {
    const tm = img.match(/title="([^"]+)"/);
    if (tm) countries.push(tm[1].trim());
  }
  const rawCountry = countries.join(' / ') || 'Perú';

  let demonym = 'Peruano';
  const cLower = rawCountry.toLowerCase();
  if (cLower.includes('uruguay') && (cLower.includes('perú') || cLower.includes('peru'))) {
    demonym = 'Uruguayo / Peruano';
  } else if (cLower.includes('argentina') && (cLower.includes('perú') || cLower.includes('peru'))) {
    demonym = 'Argentino / Peruano';
  } else if (cLower.includes('colombia') && (cLower.includes('perú') || cLower.includes('peru'))) {
    demonym = 'Colombiano / Peruano';
  } else if (cLower.includes('uruguay')) {
    demonym = 'Uruguayo';
  } else if (cLower.includes('argentina')) {
    demonym = 'Argentino';
  } else if (cLower.includes('colombia')) {
    demonym = 'Colombiano';
  } else if (cLower.includes('ecuador')) {
    demonym = 'Ecuatoriano';
  } else if (cLower.includes('venezuela')) {
    demonym = 'Venezolano';
  } else if (cLower.includes('brasil')) {
    demonym = 'Brasileño';
  } else if (cLower.includes('chile')) {
    demonym = 'Chileno';
  } else if (cLower.includes('paraguay')) {
    demonym = 'Paraguayo';
  } else if (cLower.includes('panamá') || cLower.includes('panama')) {
    demonym = 'Panameño';
  } else if (cLower.includes('méxico') || cLower.includes('mexico')) {
    demonym = 'Mexicano';
  } else if (cLower.includes('bolivia')) {
    demonym = 'Boliviano';
  }

  return { countries: rawCountry, demonym };
}

function parseClubTbody(html) {
  const tbodyM = html.match(/<table class="items">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/);
  if (!tbodyM) return [];
  const tbody = tbodyM[1];
  const chunks = tbody.split(/<tr class="(?:odd|even)">/);

  const squad = [];

  for (const chunk of chunks) {
    if (!chunk.trim()) continue;

    // Name and Player ID (supporting inner tags like Captain icon)
    const nameM = chunk.match(/<a href="\/[^\/]+\/profil\/spieler\/(\d+)"[^>]*>([\s\S]*?)<\/a>/);
    if (!nameM) continue;
    const tmId = nameM[1].trim();
    const name = nameM[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ').trim();

    // Jersey number
    const numM = chunk.match(/<div class=rn_nummer>(\d+)<\/div>/) || chunk.match(/<div class="rn_nummer">(\d+)<\/div>/);
    const num = numM ? parseInt(numM[1]) : null;

    // Image
    const imgM = chunk.match(/data-src="([^"]+)"/) || chunk.match(/src="([^"]+)"/);
    const photoUrl = imgM && !imgM[1].includes('base64') ? imgM[1] : null;

    // Position (second tr in inline-table)
    const posM = chunk.match(/<table class="inline-table">[\s\S]*?<tr>[\s\S]*?<\/tr>\s*<tr>\s*<td>\s*([^<]+)\s*<\/td>/);
    let pos = posM ? posM[1].trim() : 'Futbolista';

    // Age
    const tds = [...chunk.matchAll(/<td class="zentriert">([\s\S]*?)<\/td>/g)].map(m => m[1].trim());
    let age = null;
    if (tds.length >= 1) {
      const maybeAge = parseInt(tds[0]);
      if (!isNaN(maybeAge) && maybeAge > 15 && maybeAge < 50) {
        age = maybeAge;
      }
    }

    // Contract end date
    const contractM = chunk.match(/<td class="zentriert">(\d{2}\/\d{2}\/\d{4})<\/td>/) || chunk.match(/(\d{2}\/\d{2}\/\d{4})/);
    let contractEndDate = '2026-12-31';
    if (contractM) {
      const [d, m, y] = contractM[1].split('/');
      contractEndDate = `${y}-${m}-${d}`;
    }

    // Nationality
    const { countries, demonym } = extractNationalities(chunk);

    // Value in EUR
    const valM = chunk.match(/<td class="rechts hauptlink">[\s\S]*?<a[^>]*>([^<]+)<\/a>/) || chunk.match(/<td class="rechts hauptlink">([^<]+)<\/td>/);
    let eur = 150000;
    let valRaw = '-';
    if (valM) {
      valRaw = valM[1].trim();
      if (valRaw.includes('millón') || valRaw.includes('millones') || valRaw.includes('mil mill.')) {
        eur = Math.round(parseFloat(valRaw.replace(/[^\d,]/g, '').replace(',', '.')) * 1000000);
      } else if (valRaw.includes('mil') || valRaw.includes('k')) {
        eur = Math.round(parseFloat(valRaw.replace(/[^\d,]/g, '').replace(',', '.')) * 1000);
      }
    }

    squad.push({
      tmId,
      num,
      name,
      pos,
      natCountries: countries,
      natDemonym: demonym,
      age,
      contractEndDate,
      eur,
      valRaw,
      photoUrl
    });
  }

  return squad;
}

async function scrapeComerciantesUnidos() {
  console.log('Fetching Comerciantes Unidos from Transfermarkt (verein/47107)...');
  const res = await fetch('https://www.transfermarkt.pe/comerciantes-unidos/kader/verein/47107', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  });

  if (!res.ok) {
    console.error('Fetch failed:', res.status, res.statusText);
    return;
  }

  const html = await res.text();

  // Also extract total market value from header
  const headerValM = html.match(/data-header__market-value-wrapper[^>]*>([\s\S]*?)<\/div>/);
  if (headerValM) {
    console.log('Transfermarkt Header Market Value:', headerValM[1].replace(/<[^>]+>/g, '').trim());
  }

  const squad = parseClubTbody(html);

  console.log(`\n=== Comerciantes Unidos (${squad.length} futbolistas oficiales en Transfermarkt) ===`);
  squad.forEach((p, idx) => {
    console.log(`${idx + 1}. #${p.num ?? '-'} ${p.name} | ${p.pos} | ${p.natDemonym} (${p.natCountries}) | €${p.eur.toLocaleString()} (${p.valRaw}) | Contrato: ${p.contractEndDate}`);
  });

  const totalEur = squad.reduce((sum, p) => sum + p.eur, 0);
  console.log(`\nTotal EUR: €${totalEur.toLocaleString()} | Total USD (@1.0999): $${Math.round(totalEur * 1.0999).toLocaleString()}`);

  fs.writeFileSync('scripts/comerciantes_unidos_exact_transfermarkt.json', JSON.stringify(squad, null, 2));
  console.log('Saved to scripts/comerciantes_unidos_exact_transfermarkt.json');
}

scrapeComerciantesUnidos();

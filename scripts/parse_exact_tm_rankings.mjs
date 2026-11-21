import fs from 'fs';

const html = fs.readFileSync('scripts/transfermarkt_marktwerte_raw.html', 'utf8');

// Match table
const tableMatch = html.match(/<table[^>]*class="[^"]*items[^"]*"[^>]*>([\s\S]*?)<\/table>/i);
const tableHtml = tableMatch[1];
const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];

const parsed = [];

for (const row of rows) {
  const rowHtml = row[1];
  const cells = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1]);
  if (cells.length < 5) continue;

  const rank = cells[0].replace(/<[^>]+>/g, '').trim();
  if (!rank || isNaN(parseInt(rank))) continue;

  // Club name
  const clubNameMatch = rowHtml.match(/<td[^>]*class="[^"]*hauptlink[^"]*"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i)
    || rowHtml.match(/<a[^>]*title="([^"]+)"/i);
  const clubName = clubNameMatch ? clubNameMatch[1].trim() : '';

  const cleanCells = cells.map(c => c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  
  // Previous value (column index 4)
  const prevValStr = cleanCells[4];
  // Current value (column index 5)
  const currentValStr = cleanCells[5];
  // Percentage diff (column index 6)
  const pctDiffStr = cleanCells[6];

  const parseVal = (str) => {
    if (!str) return 0;
    const clean = str.replace('&nbsp;', '').trim();
    if (clean.includes('M€') || clean.includes('mill.')) {
      const num = parseFloat(clean.replace('M€', '').replace('mill. €', '').replace(',', '.').trim());
      return Math.round(num * 1_000_000);
    }
    if (clean.includes('mil €') || clean.includes('miles €') || clean.includes('K €')) {
      const num = parseFloat(clean.replace('mil €', '').replace('miles €', '').replace(',', '.').trim());
      return Math.round(num * 1_000);
    }
    return 0;
  };

  const currentValEur = parseVal(currentValStr);
  const prevValEur = parseVal(prevValStr);
  const diffEur = currentValEur - prevValEur;

  let deltaStr = '';
  let trend = 'neutral';
  if (diffEur > 0) {
    trend = 'up';
    if (diffEur >= 1_000_000) {
      const m = (diffEur / 1_000_000).toFixed(1).replace('.', ',');
      deltaStr = `+ ${m} M€`;
    } else {
      const k = Math.round(diffEur / 1_000);
      deltaStr = `+ ${k} MIL €`;
    }
  } else if (diffEur < 0) {
    trend = 'down';
    const absDiff = Math.abs(diffEur);
    if (absDiff >= 1_000_000) {
      const m = (absDiff / 1_000_000).toFixed(1).replace('.', ',');
      deltaStr = `- ${m} M€`;
    } else {
      const k = Math.round(absDiff / 1_000);
      deltaStr = `- ${k} MIL €`;
    }
  } else {
    deltaStr = '= 0 €';
  }

  // Exact match to the user's photo:
  const mVal = currentValEur / 1_000_000;
  let shortDisplayEur = '';
  if (Math.round(mVal * 10) === 70) {
    shortDisplayEur = '7 M€';
  } else {
    shortDisplayEur = mVal.toFixed(1).replace('.', ',') + ' M€';
  }

  const displayNames = {
    'Club Sporting Cristal': 'SPORTING CRISTAL',
    'Universitario de Deportes': 'UNIVERSITARIO',
    'Club Alianza Lima': 'ALIANZA LIMA',
    'FBC Melgar': 'FBC MELGAR',
    'Cusco FC': 'CUSCO FC',
    'Club Cienciano': 'CIENCIANO',
    'Comerciantes Unidos': 'COMERCIANTES U.',
    'Deportivo Garcilaso': 'DEP. GARCILASO',
    'Alianza Atlético Sullana': 'ALIANZA ATLÉTICO',
    'Sport Boys Association': 'SPORT BOYS',
    'Sport Huancayo': 'SPORT HUANCAYO',
    'Club Juan Pablo II College': 'JUAN PABLO II',
    'Club Atlético Grau': 'ATLÉTICO GRAU',
    'FC Cajamarca': 'FC CAJAMARCA',
    'Asociación Deportiva Tarma': 'ADT TARMA',
    'CD Los Chankas': 'LOS CHANKAS',
    'Universidad Técnica de Cajamarca': 'UTC CAJAMARCA',
    'Deportivo Moquegua': 'DEP. MOQUEGUA'
  };

  parsed.push({
    rank: parseInt(rank),
    tmClubName: clubName,
    displayName: displayNames[clubName] || clubName.toUpperCase(),
    currentValEur,
    prevValEur,
    diffEur,
    deltaStr,
    trend,
    pctDiffStr,
    shortDisplayEur
  });
}

console.log(JSON.stringify(parsed, null, 2));
fs.writeFileSync('scripts/tm_liga1_rankings_2026.json', JSON.stringify(parsed, null, 2));

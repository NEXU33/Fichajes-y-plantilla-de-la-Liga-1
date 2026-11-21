import fs from 'fs';

const html = fs.readFileSync('scripts/transfermarkt_marktwerte_raw.html', 'utf8');

// Match table
const tableMatch = html.match(/<table[^>]*class="[^"]*items[^"]*"[^>]*>([\s\S]*?)<\/table>/i);
if (!tableMatch) {
  console.log('No table found with class items');
  process.exit(1);
}

const tableHtml = tableMatch[1];
const rowMatches = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
console.log('Found rows:', rowMatches.length);

const results = [];

for (const row of rowMatches) {
  const rowContent = row[1];
  // extract td cells
  const cells = [...rowContent.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(c => c[1]);
  if (cells.length < 5) continue;

  // Club name is usually inside a link or hauptlink
  const clubMatch = rowContent.match(/<td[^>]*class="[^"]*hauptlink[^"]*"[^>]*>[\s\S]*?<a[^>]*title="([^"]+)"/i) 
    || rowContent.match(/<a[^>]*title="([^"]+)"[^>]*href="\/[^\/]+\/startseite\/verein\/\d+"/i);
  
  const clubName = clubMatch ? clubMatch[1] : '';

  // Extract all text clean
  const cleanCells = cells.map(c => c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

  // Search for market value in cell (e.g. "13,60 mill. €" or "7,00 mill. €" or similar)
  const lastCell = cleanCells[cleanCells.length - 1];
  const secondLastCell = cleanCells[cleanCells.length - 2];
  
  // also look for variation or green/red delta if present
  const deltaMatch = rowContent.match(/class="[^"]*(gruen|rot)[^"]*"[^>]*>([\s\S]*?)<\/td>/i);
  let delta = '';
  if (deltaMatch) {
    delta = (deltaMatch[1] === 'gruen' ? '+' : '-') + deltaMatch[2].replace(/<[^>]+>/g, ' ').trim();
  }

  results.push({
    clubName,
    cells: cleanCells,
    delta,
    rawLast: lastCell,
    rawSecondLast: secondLastCell
  });
}

console.log(JSON.stringify(results.slice(0, 20), null, 2));
fs.writeFileSync('scripts/parsed_marktwerte.json', JSON.stringify(results, null, 2));

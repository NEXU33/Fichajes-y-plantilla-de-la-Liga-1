import fs from 'fs';

function extractNationalities(chunk) {
  const flagImgs = [...chunk.matchAll(/<img[^>]*class="[^"]*flaggenrahmen[^"]*"[^>]*>/g)].map(m => m[0]);
  const countries = [];
  for (const img of flagImgs) {
    const tm = img.match(/title="([^"]+)"/);
    if (tm) countries.push(tm[1].trim());
  }
  const rawCountry = countries.join(' / ') || 'Perú';

  // Map to demonym
  let demonym = 'Peruano';
  const cLower = rawCountry.toLowerCase();
  if (cLower.includes('uruguay') && cLower.includes('per')) {
    demonym = 'Uruguayo / Peruano';
  } else if (cLower.includes('argentina') && cLower.includes('per')) {
    demonym = 'Argentino / Peruano';
  } else if (cLower.includes('colombia') && cLower.includes('per')) {
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
  }

  return { countries: rawCountry, demonym };
}

// Test with chunk
const testStr = `<td class="zentriert"><img src="https://img.a.transfermarkt.technology/flagge/verysmall/83.png?lm=1791356389" title="Colombia" alt="Colombia" class="flaggenrahmen" /></td>`;
console.log('Result for Colombia:', extractNationalities(testStr));

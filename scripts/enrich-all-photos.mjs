import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const envText = fs.readFileSync('.env', 'utf8');
const url = envText.match(/VITE_SUPABASE_URL=([^\r\n]+)/)[1].trim();
const key = envText.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/)[1].trim();
const supabase = createClient(url, key, { realtime: { transport: WebSocket } });

async function searchTM(query) {
  try {
    const res = await fetch(`https://www.transfermarkt.pe/schnellsuche/ergebnis/schnellsuche?query=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/<img[^>]+src=["'](https:\/\/img\.a\.transfermarkt\.technology\/portrait\/[^"']+)["'][^>]*title=["']([^"']+)["']/i);
    if (m && !m[1].includes('default')) {
      const cleanPhoto = m[1].replace('/small/', '/header/').replace('/medium/', '/header/');
      return { photo: cleanPhoto, name: m[2] };
    }
  } catch (e) {
    // ignore
  }
  return null;
}

async function main() {
  const players = JSON.parse(fs.readFileSync('scripts/active_players_2026.json', 'utf8'));
  const missing = players.filter(p => !p.photo_url || p.photo_url.length <= 5 || p.photo_url.includes('default'));
  console.log(`Searching TM for ${missing.length} players without photo...`);

  let foundCount = 0;
  const updates = [];

  const batchSize = 10;
  for (let i = 0; i < missing.length; i += batchSize) {
    const batch = missing.slice(i, i + batchSize);
    await Promise.all(batch.map(async (p) => {
      // Try search with full name
      let res = await searchTM(p.name);
      // If not found and name has 3 words, try first + last
      if (!res && p.name.includes(' ')) {
        const parts = p.name.split(' ');
        if (parts.length > 2) {
          res = await searchTM(`${parts[0]} ${parts[parts.length - 1]}`);
        }
      }

      if (res?.photo) {
        p.photo_url = res.photo;
        foundCount++;
        updates.push({ id: p.id, photo_url: res.photo, name: p.name });
      }
    }));

    if (i % 50 === 0 || i + batchSize >= missing.length) {
      console.log(`Progress: ${Math.min(i + batchSize, missing.length)}/${missing.length} — Found: ${foundCount}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n🎉 Found photos for ${foundCount} out of ${missing.length} players!`);

  // Save enriched active_players_2026.json
  fs.writeFileSync('scripts/active_players_2026.json', JSON.stringify(players, null, 2));
  console.log('Saved updated active_players_2026.json');

  // Push photo_url updates to Supabase
  if (updates.length > 0) {
    console.log(`Updating ${updates.length} players in Supabase...`);
    for (let i = 0; i < updates.length; i += 20) {
      const chunk = updates.slice(i, i + 20);
      await Promise.all(chunk.map(u => 
        supabase.from('players').update({ photo_url: u.photo_url }).eq('id', u.id)
      ));
    }
    console.log('✅ Supabase players updated with official photos!');
  }
}

main();

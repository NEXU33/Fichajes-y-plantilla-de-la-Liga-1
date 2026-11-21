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
      return cleanPhoto;
    }
  } catch (e) {}
  return null;
}

async function fixBroken() {
  const players = JSON.parse(fs.readFileSync('scripts/active_players_2026.json', 'utf8'));
  const skins = JSON.parse(fs.readFileSync('scripts/players_skin_analyzed.json', 'utf8'));

  // Players that didn't get analyzed (either 404 or missing)
  const unanalyzed = players.filter(p => !skins[p.id]);
  console.log(`Unanalyzed players count: ${unanalyzed.length}`);

  let fixedCount = 0;
  for (let i = 0; i < unanalyzed.length; i += 10) {
    const batch = unanalyzed.slice(i, i + 10);
    await Promise.all(batch.map(async (p) => {
      const cleanName = p.name.replace(/Flores|Gamboa|Barreto|Chinen/g, '').trim() || p.name;
      let newPhoto = await searchTM(p.name);
      if (!newPhoto) newPhoto = await searchTM(cleanName);
      if (newPhoto) {
        p.photo_url = newPhoto;
        fixedCount++;
        await supabase.from('players').update({ photo_url: newPhoto }).eq('id', p.id);
      }
    }));
    console.log(`Checked ${Math.min(i + 10, unanalyzed.length)}/${unanalyzed.length} — Fixed: ${fixedCount}`);
    await new Promise(r => setTimeout(r, 200));
  }

  fs.writeFileSync('scripts/active_players_2026.json', JSON.stringify(players, null, 2));
  console.log(`Total fixed photos: ${fixedCount}`);
}

fixBroken();

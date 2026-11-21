import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

async function testResolution() {
  const { data: dbPlayers } = await supabase.from('players').select('id, full_name, slug, primary_position, nationality');
  const besoccerData = JSON.parse(fs.readFileSync('scripts/besoccer_transfers_parsed.json', 'utf8'));

  const playerByNorm = new Map();
  for (const p of dbPlayers) {
    playerByNorm.set(normalize(p.full_name), p);
  }

  let resolved = 0;
  let unresolved = [];

  for (const club of besoccerData) {
    const list = [...club.altas, ...club.bajas];
    for (const item of list) {
      let matchedPlayer = null;

      // 1. Direct match on item.name
      const direct = playerByNorm.get(normalize(item.name));
      if (direct) {
        matchedPlayer = direct;
      }

      // 2. Match on URL slug
      if (!matchedPlayer && item.url) {
        const urlSlug = item.url.replace(/^.*\/jugador\//, '').replace(/-[0-9]+$/, '').replace(/-/g, ' ');
        matchedPlayer = playerByNorm.get(normalize(urlSlug));
      }

      // 3. Initial + Last name match (e.g. "A. Ramos" -> first letter 'a' + last name 'ramos')
      if (!matchedPlayer) {
        const parts = item.name.trim().split(/\s+/);
        if (parts.length >= 2 && parts[0].length <= 2) {
          const initial = parts[0][0].toLowerCase();
          const lastName = parts.slice(1).join(' ').toLowerCase();

          const candidates = dbPlayers.filter(p => {
            const pNorm = p.full_name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const pParts = pNorm.split(/\s+/);
            const pInitial = pParts[0][0];
            const pLastName = pParts.slice(1).join(' ');
            return pInitial === initial && (pLastName.includes(lastName) || pNorm.endsWith(lastName));
          });

          if (candidates.length === 1) {
            matchedPlayer = candidates[0];
          }
        }
      }

      if (matchedPlayer) {
        resolved++;
      } else {
        unresolved.push({ name: item.name, club: club.clubName, url: item.url });
      }
    }
  }

  console.log(`Total BeSoccer records: ${201 + 280} = 481`);
  console.log(`Resolved: ${resolved}, Unresolved: ${unresolved.length}`);
  console.log('Unresolved sample:', unresolved.slice(0, 15));
}

testResolution();

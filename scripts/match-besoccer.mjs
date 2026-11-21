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

async function main() {
  const { data: dbPlayers } = await supabase.from('players').select('id, full_name, slug, primary_position, nationality');
  const { data: dbTeams } = await supabase.from('teams').select('id, name, slug');
  console.log('Total players in DB:', dbPlayers.length);
  console.log('Total teams in DB:', dbTeams.length);

  const besoccerData = JSON.parse(fs.readFileSync('scripts/besoccer_transfers_parsed.json', 'utf8'));

  // Test player matching
  const playerMap = new Map();
  for (const p of dbPlayers) {
    playerMap.set(normalize(p.full_name), p);
  }

  let matched = 0;
  let unmatched = 0;
  const unmatchedList = [];

  for (const club of besoccerData) {
    const all = [...club.altas, ...club.bajas];
    for (const item of all) {
      const direct = playerMap.get(normalize(item.name));
      if (direct) {
        matched++;
        continue;
      }

      // Try matching by last name or url slug
      const urlSlug = item.url.replace(/^.*\/jugador\//, '').replace(/-[0-9]+$/, '').replace(/-/g, ' ');
      const urlMatch = playerMap.get(normalize(urlSlug));
      if (urlMatch) {
        matched++;
        continue;
      }

      // Check if any db player ends with last name or contains
      const lastName = item.name.split(' ').pop();
      const lastNameMatches = dbPlayers.filter(p => normalize(p.full_name).endsWith(normalize(lastName)));
      if (lastNameMatches.length === 1) {
        matched++;
      } else {
        unmatched++;
        unmatchedList.push({ name: item.name, club: club.clubName, url: item.url });
      }
    }
  }

  console.log(`Matched: ${matched}, Unmatched: ${unmatched}`);
  console.log('Sample unmatched (first 20):', unmatchedList.slice(0, 20));
}

main();

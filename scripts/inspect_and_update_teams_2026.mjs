import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const envText = fs.readFileSync('.env', 'utf8');
const url = envText.match(/VITE_SUPABASE_URL=([^\r\n]+)/)[1].trim();
const key = envText.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/)[1].trim();

const supabase = createClient(url, key, {
  realtime: { transport: WebSocket }
});

async function main() {
  const { data: teams, error: errT } = await supabase.from('teams').select('*');
  if (errT) {
    console.error('Error fetching teams:', errT);
    return;
  }
  console.log('Total teams in DB:', teams.length);
  teams.forEach(t => console.log(`${t.id} | ${t.name} | ${t.short_name}`));

  const { data: teamSeasons, error: errTS } = await supabase.from('team_seasons').select('*').eq('year', 2026);
  if (errTS) {
    console.error('Error fetching team_seasons:', errTS);
    return;
  }
  console.log('\nTotal team_seasons for 2026:', teamSeasons.length);
  teamSeasons.forEach(ts => {
    const team = teams.find(t => t.id === ts.team_id);
    console.log(`Rank ${ts.rank_value} | ${team?.name} | EUR: ${ts.total_value_eur} | USD: ${ts.total_value_usd}`);
  });
}

main();

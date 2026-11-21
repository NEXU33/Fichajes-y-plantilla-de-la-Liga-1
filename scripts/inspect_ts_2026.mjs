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
  const { data: teamSeasons, error } = await supabase
    .from('team_seasons')
    .select('*, teams(*)')
    .eq('season_year', 2026)
    .order('rank_value', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Total team_seasons 2026:', teamSeasons.length);
  teamSeasons.forEach(ts => {
    console.log(`Rank ${ts.rank_value} | ${ts.teams?.name} | EUR: ${ts.total_value_eur} | USD: ${ts.total_value_usd} | squad: ${ts.squad_size}`);
  });
}

main();

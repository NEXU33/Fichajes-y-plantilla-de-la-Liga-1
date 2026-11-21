import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const envText = fs.readFileSync('.env', 'utf8');
const url = envText.match(/VITE_SUPABASE_URL=([^\r\n]+)/)[1].trim();
const key = envText.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/)[1].trim();

const supabase = createClient(url, key, {
  realtime: { transport: WebSocket }
});

const rankings = JSON.parse(fs.readFileSync('scripts/tm_liga1_rankings_2026.json', 'utf8'));

const nameMap = {
  'Club Sporting Cristal': 'Sporting Cristal',
  'Universitario de Deportes': 'Universitario de Deportes',
  'Club Alianza Lima': 'Alianza Lima',
  'FBC Melgar': 'FBC Melgar',
  'Cusco FC': 'Cusco FC',
  'Club Cienciano': 'Cienciano',
  'Comerciantes Unidos': 'Comerciantes Unidos',
  'Deportivo Garcilaso': 'Deportivo Garcilaso',
  'Alianza Atlético Sullana': 'Alianza Atlético',
  'Sport Boys Association': 'Sport Boys',
  'Sport Huancayo': 'Sport Huancayo',
  'Club Juan Pablo II College': 'Juan Pablo II College',
  'Club Atlético Grau': 'Atlético Grau',
  'FC Cajamarca': 'FC Cajamarca',
  'Asociación Deportiva Tarma': 'ADT Tarma',
  'CD Los Chankas': 'Los Chankas CYC',
  'Universidad Técnica de Cajamarca': 'UTC Cajamarca',
  'Deportivo Moquegua': 'Deportivo Moquegua'
};

async function sync() {
  const { data: teams, error: errT } = await supabase.from('teams').select('*');
  if (errT) {
    console.error('Error fetching teams:', errT);
    return;
  }

  const { data: teamSeasons, error: errTS } = await supabase
    .from('team_seasons')
    .select('*')
    .eq('season_year', 2026);
  if (errTS) {
    console.error('Error fetching team_seasons:', errTS);
    return;
  }

  const rate = 1.0999;

  for (const item of rankings) {
    const targetDbName = nameMap[item.tmClubName];
    const team = teams.find(t => t.name.toLowerCase() === targetDbName.toLowerCase());
    if (!team) {
      console.warn(`Could not find team in DB for ${item.tmClubName} (${targetDbName})`);
      continue;
    }

    const existingTS = teamSeasons.find(ts => ts.team_id === team.id);
    const usdVal = Math.round(item.currentValEur * rate);

    if (existingTS) {
      const { error: updErr } = await supabase
        .from('team_seasons')
        .update({
          rank_value: item.rank,
          total_value_eur: item.currentValEur,
          total_value_usd: usdVal,
          last_updated: new Date().toISOString()
        })
        .eq('id', existingTS.id);

      if (updErr) console.error(`Error updating ${team.name}:`, updErr);
      else console.log(`Updated Rank ${item.rank} -> ${team.name}: €${item.currentValEur} / $${usdVal}`);
    } else {
      const { error: insErr } = await supabase
        .from('team_seasons')
        .insert({
          team_id: team.id,
          season_year: 2026,
          rank_value: item.rank,
          total_value_eur: item.currentValEur,
          total_value_usd: usdVal,
          squad_size: 26,
          last_updated: new Date().toISOString()
        });

      if (insErr) console.error(`Error inserting ${team.name}:`, insErr);
      else console.log(`Inserted Rank ${item.rank} -> ${team.name}: €${item.currentValEur}`);
    }
  }

  console.log('Finished updating team_seasons 2026.');
}

sync();

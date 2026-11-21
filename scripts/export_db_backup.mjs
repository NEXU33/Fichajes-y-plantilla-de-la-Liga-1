import fs from 'fs';
import WebSocket from 'ws';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('.env', 'utf8');
const url = envText.match(/VITE_SUPABASE_URL=([^\r\n]+)/)[1].trim();
const key = envText.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/)[1].trim();

const supabase = createClient(url, key, {
  realtime: { transport: WebSocket }
});

async function exportBackup() {
  console.log('Exporting database backup for independent Supabase deployment...');

  const { data: teams } = await supabase.from('teams').select('*');
  const { data: teamSeasons } = await supabase.from('team_seasons').select('*');
  const { data: exchangeRates } = await supabase.from('exchange_rates').select('*');
  const { data: players } = await supabase.from('players').select('*');
  const { data: playerSeasons } = await supabase.from('player_seasons').select('*');
  const { data: transfers } = await supabase.from('transfers').select('*');

  const summary = {
    teams: teams?.length || 0,
    teamSeasons: teamSeasons?.length || 0,
    exchangeRates: exchangeRates?.length || 0,
    players: players?.length || 0,
    playerSeasons: playerSeasons?.length || 0,
    transfers: transfers?.length || 0,
  };

  console.log('Export Summary:', summary);

  fs.writeFileSync('scripts/database_backup_2026.json', JSON.stringify({
    teams,
    teamSeasons,
    exchangeRates,
    players,
    playerSeasons,
    transfers
  }, null, 2));

  console.log('JSON backup saved to scripts/database_backup_2026.json');
}

exportBackup();

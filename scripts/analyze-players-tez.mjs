import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const envText = fs.readFileSync('.env', 'utf8');
const url = envText.match(/VITE_SUPABASE_URL=([^\r\n]+)/)[1].trim();
const key = envText.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/)[1].trim();
const supabase = createClient(url, key, { realtime: { transport: WebSocket } });

async function run() {
  const { data: ps } = await supabase
    .from('player_seasons')
    .select('player_id, season_year, team_id, teams(name)')
    .eq('season_year', 2026);
    
  const { data: tr } = await supabase
    .from('transfers')
    .select('player_id, season_year')
    .eq('season_year', 2026);
  
  const activeIds = new Set();
  const playerTeams = {};
  ps?.forEach(p => {
    activeIds.add(p.player_id);
    if (p.teams?.name) {
      playerTeams[p.player_id] = p.teams.name;
    }
  });
  tr?.forEach(t => activeIds.add(t.player_id));

  console.log('Total unique active player IDs in 2026:', activeIds.size);

  const { data: allPlayers, error } = await supabase
    .from('players')
    .select('id, full_name, slug, nationality, primary_position, photo_url, transfermarkt_id');
    
  if (error) console.error(error);

  const activePlayers = allPlayers?.filter(p => activeIds.has(p.id)) || [];
  console.log('Active players found in players table:', activePlayers.length);

  const withPhoto = activePlayers.filter(p => p.photo_url && p.photo_url.length > 5 && !p.photo_url.includes('default'));
  console.log('Active players with valid photo_url:', withPhoto.length);
  console.log('Active players without valid photo_url:', activePlayers.length - withPhoto.length);

  const samplePhotos = withPhoto.slice(0, 10).map(p => ({
    name: p.full_name,
    team: playerTeams[p.id] || 'N/A',
    nationality: p.nationality,
    photo: p.photo_url
  }));
  console.log('Sample photo URLs:\n', JSON.stringify(samplePhotos, null, 2));

  // Save all active players to a local JSON file for easy processing
  fs.writeFileSync('scripts/active_players_2026.json', JSON.stringify(activePlayers.map(p => ({
    id: p.id,
    name: p.full_name,
    slug: p.slug,
    team: playerTeams[p.id] || 'N/A',
    position: p.primary_position,
    nationality: p.nationality,
    photo_url: p.photo_url,
    transfermarkt_id: p.transfermarkt_id
  })), null, 2));

  console.log('Saved active_players_2026.json successfully.');
}

run();

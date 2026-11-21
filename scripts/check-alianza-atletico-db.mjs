import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function main() {
  const { data: team } = await supabase.from('teams').select('*').ilike('slug', '%alianza-atletico%').single();
  console.log('Team:', team);

  const { data: ps } = await supabase.from('player_seasons')
    .select('id, jersey_number, players(id, full_name, nationality, primary_position)')
    .eq('team_id', team.id)
    .eq('season_year', 2026);

  console.log(`Current player_seasons for Alianza Atlético: ${ps?.length || 0}`);
  ps?.forEach(p => console.log(` #${p.jersey_number} ${p.players?.full_name} | ${p.players?.primary_position} | ${p.players?.nationality}`));

  // Check Cedron in transfers
  const { data: cedron } = await supabase.from('players').select('id, full_name').ilike('full_name', '%Victor Cedr%').single();
  console.log('Cedron player record:', cedron);

  if (cedron) {
    const { data: trs } = await supabase.from('transfers').select('*').eq('player_id', cedron.id);
    console.log('Transfers for Cedron:', trs);
  }
}

main();

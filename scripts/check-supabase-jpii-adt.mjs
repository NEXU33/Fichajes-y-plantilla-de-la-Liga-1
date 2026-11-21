import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function main() {
  const { data: teams, error: tErr } = await supabase.from('teams').select('*').in('slug', ['juan-pablo-ii', 'adt-tarma', 'adt', 'juan-pablo-ii-college']);
  console.log('Teams found:', teams);

  for (const t of teams) {
    console.log(`\n================ Team: ${t.name} (${t.slug}, id: ${t.id}) ================`);
    const { data: ps, error: psErr } = await supabase.from('player_seasons')
      .select('id, jersey_number, player_id, players(id, full_name, nationality, primary_position)')
      .eq('team_id', t.id)
      .eq('season_year', 2026);
    
    console.log(`Current player_seasons (2026): ${ps?.length || 0}`);
    ps?.forEach(p => console.log(` - #${p.jersey_number} ${p.players?.full_name} | ${p.players?.primary_position} | ${p.players?.nationality}`));

    const { data: trs } = await supabase.from('transfers')
      .select('id, transfer_type, departure_reason, other_club_name, players(full_name)')
      .eq('team_id', t.id)
      .eq('season_year', 2026);
    console.log(`Transfers (2026): ${trs?.length || 0}`);
    trs?.forEach(tr => console.log(` - [${tr.transfer_type}] ${tr.players?.full_name}: ${tr.departure_reason || '-'} -> ${tr.other_club_name || '-'}`));
  }
}

main();

import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function dedupeAdt() {
  const { data: team } = await supabase.from('teams').select('id, name').eq('slug', 'adt-tarma').single();

  const { data: ps } = await supabase.from('player_seasons')
    .select('id, jersey_number, player_id, players(id, full_name)')
    .eq('team_id', team.id)
    .eq('season_year', 2026);

  console.log('Current ADT rows:', ps.length);

  for (const item of ps) {
    const name = item.players?.full_name || '';
    // Check if this is "Marco Aldair Rodríguez" or has jersey 17
    if (name.includes('Marco Aldair') || item.jersey_number === 17) {
      console.log(`Deleting duplicate Marco Aldair Rodríguez (#17, id: ${item.id})`);
      await supabase.from('player_seasons').delete().eq('id', item.id);
    }
    // Check duplicate Alejandro Ramos with jersey 28 (Jhair Soto is #28)
    if (name === 'Alejandro Ramos' && item.jersey_number === 28) {
      console.log(`Deleting duplicate Alejandro Ramos (#28, id: ${item.id})`);
      await supabase.from('player_seasons').delete().eq('id', item.id);
    }
    // Check duplicate Joaquin Pereyra with jersey 5
    if (name.includes('Pereyra') && item.jersey_number === 5) {
      console.log(`Deleting duplicate Joaquin Pereyra (#5, id: ${item.id})`);
      await supabase.from('player_seasons').delete().eq('id', item.id);
    }
  }

  // Check remaining count
  const { data: remaining } = await supabase.from('player_seasons')
    .select('id, jersey_number, players(full_name)')
    .eq('team_id', team.id)
    .eq('season_year', 2026);

  console.log(`Remaining ADT players in DB: ${remaining.length}`);
  remaining.sort((a,b) => (a.jersey_number||99) - (b.jersey_number||99))
    .forEach((p, idx) => console.log(`${idx + 1}. #${p.jersey_number} ${p.players?.full_name}`));

  // Update team_seasons squad_size
  await supabase.from('team_seasons').update({ squad_size: remaining.length }).eq('team_id', team.id).eq('season_year', 2026);
}

dedupeAdt();

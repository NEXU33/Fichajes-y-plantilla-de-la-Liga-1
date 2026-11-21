import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function cleanExact() {
  console.log('--- Cleaning Juan Pablo II College ---');
  const { data: teamJpii } = await supabase.from('teams').select('id, name').eq('slug', 'juan-pablo-ii').single();
  const { data: psJpii } = await supabase.from('player_seasons')
    .select('id, jersey_number, players(full_name)')
    .eq('team_id', teamJpii.id)
    .eq('season_year', 2026);

  for (const item of psJpii) {
    if (item.players?.full_name?.includes('Christian Flores') && item.jersey_number === 17) {
      console.log(`Deleting duplicate Christian Flores (#17, id: ${item.id}) from JPII`);
      await supabase.from('player_seasons').delete().eq('id', item.id);
    }
  }

  const { data: jpiiFinal } = await supabase.from('player_seasons')
    .select('id, jersey_number, players(full_name)')
    .eq('team_id', teamJpii.id)
    .eq('season_year', 2026);
  console.log(`JPII Final Count: ${jpiiFinal.length}`);
  await supabase.from('team_seasons').update({ squad_size: jpiiFinal.length }).eq('team_id', teamJpii.id).eq('season_year', 2026);

  console.log('\n--- Cleaning ADT Tarma ---');
  const { data: teamAdt } = await supabase.from('teams').select('id, name').eq('slug', 'adt-tarma').single();
  const { data: psAdt } = await supabase.from('player_seasons')
    .select('id, jersey_number, players(full_name)')
    .eq('team_id', teamAdt.id)
    .eq('season_year', 2026);

  for (const item of psAdt) {
    const name = item.players?.full_name || '';
    if (name.includes('Pereyra') && item.jersey_number === 5) {
      console.log(`Deleting duplicate Joaquin Pereyra (#5, id: ${item.id})`);
      await supabase.from('player_seasons').delete().eq('id', item.id);
    }
    if (name.includes('Solis') && item.jersey_number === 12) {
      console.log(`Deleting duplicate Carlos Solis (#12, id: ${item.id})`);
      await supabase.from('player_seasons').delete().eq('id', item.id);
    }
    if (name.includes('Nuñez') && item.jersey_number === 15) {
      console.log(`Deleting duplicate Orlando Nuñez (#15, id: ${item.id})`);
      await supabase.from('player_seasons').delete().eq('id', item.id);
    }
    if (name.includes('Marco Aldair') || item.jersey_number === 17) {
      console.log(`Deleting duplicate Marco Aldair Rodríguez (#17, id: ${item.id})`);
      await supabase.from('player_seasons').delete().eq('id', item.id);
    }
    if (name === 'Alejandro Ramos' && item.jersey_number === 28) {
      console.log(`Deleting duplicate Alejandro Ramos (#28, id: ${item.id})`);
      await supabase.from('player_seasons').delete().eq('id', item.id);
    }
  }

  const { data: adtFinal } = await supabase.from('player_seasons')
    .select('id, jersey_number, players(full_name)')
    .eq('team_id', teamAdt.id)
    .eq('season_year', 2026);
  console.log(`ADT Final Count: ${adtFinal.length}`);
  await supabase.from('team_seasons').update({ squad_size: adtFinal.length }).eq('team_id', teamAdt.id).eq('season_year', 2026);

  console.log('\n✅ JPII has', jpiiFinal.length, 'players and ADT has', adtFinal.length, 'players in Supabase!');
}

cleanExact();

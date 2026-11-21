import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function fixContractDates() {
  const { data: teams } = await supabase
    .from('teams')
    .select('id, name')
    .in('slug', ['juan-pablo-ii', 'adt-tarma']);

  for (const t of teams) {
    const { data: ps } = await supabase
      .from('player_seasons')
      .select('id, contract_end_date, players(full_name)')
      .eq('team_id', t.id)
      .eq('season_year', 2026);

    for (const item of ps) {
      if (!item.contract_end_date || item.contract_end_date < '2026-11-19') {
        console.log(`Fixing contract date for ${item.players?.full_name}: was ${item.contract_end_date} -> 2026-12-31`);
        await supabase
          .from('player_seasons')
          .update({ contract_end_date: '2026-12-31' })
          .eq('id', item.id);
      }
    }
  }

  console.log('Contract dates updated successfully!');
}

fixContractDates();

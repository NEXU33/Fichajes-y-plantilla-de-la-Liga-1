import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function checkCusco() {
  const { data: team } = await supabase.from('teams').select('*').ilike('slug', '%cusco%').single();
  console.log('Team:', team);

  const { data: ps } = await supabase.from('player_seasons')
    .select('id, jersey_number, season_year, market_value_usd, contract_end_date, players(id, full_name, nationality, primary_position)')
    .eq('team_id', team.id)
    .eq('season_year', 2026);

  console.log(`Current players in DB for Cusco FC (2026): ${ps?.length || 0}`);
  ps?.forEach((p, idx) => {
    console.log(`${idx + 1}. #${p.jersey_number ?? '-'} ${p.players?.full_name} | ${p.players?.primary_position} | ${p.players?.nationality} | $${p.market_value_usd?.toLocaleString()} | Fin: ${p.contract_end_date}`);
  });
}

checkCusco();

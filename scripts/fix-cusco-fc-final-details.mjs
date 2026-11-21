import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function fixFinalDetails() {
  const teamId = 'e04bde16-1153-4a78-8854-fad24f786b98';

  // 1. Delete false transfers for Custodio and Tévez
  const spuriousTransferIds = [
    '16182ff5-29d8-457c-b684-46b9e7f794f4',
    'd10a4dfa-8a6d-4a31-b56f-8f1d2c12c4d9'
  ];

  for (const tid of spuriousTransferIds) {
    const { error: delErr } = await supabase.from('transfers').delete().eq('id', tid);
    if (!delErr) console.log(`Deleted spurious transfer ${tid}`);
  }

  // 2. Update team_seasons with correct column names
  const { error: tsErr } = await supabase.from('team_seasons').upsert({
    team_id: teamId,
    season_year: 2026,
    squad_size: 27,
    total_value_eur: 8150000,
    total_value_usd: 8964185,
    last_updated: new Date().toISOString()
  }, { onConflict: 'team_id,season_year' });

  if (tsErr) {
    console.error('Error updating team_seasons:', tsErr);
  } else {
    console.log('✅ Updated team_seasons for Cusco FC (27 players, €8.15M / $8,964,185 USD)');
  }

  // Verify transfers for Cusco FC
  const { data: finalTr } = await supabase.from('transfers').select('id, transfer_type, departure_reason, other_club_name, players(full_name)').eq('team_id', teamId).eq('season_year', 2026);
  console.log('Current transfers for Cusco FC in 2026:');
  console.log(finalTr);
}

fixFinalDetails();

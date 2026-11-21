import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function main() {
  const { data: teams, error: tErr } = await supabase.from('teams').select('id, name, slug').order('name');
  if (tErr) {
    console.error('Error fetching teams:', tErr);
    return;
  }

  const { data: transfers, error: trErr } = await supabase
    .from('transfers')
    .select('*, players(id, full_name, primary_position, nationality)')
    .eq('season_year', 2026)
    .eq('transfer_type', 'IN')
    .order('announced_at', { ascending: false });

  if (trErr) {
    console.error('Error fetching transfers:', trErr);
    return;
  }

  console.log(`Total 'IN' transfers for 2026: ${transfers.length}`);
  if (transfers.length > 0) {
    console.log('Sample transfer keys:', Object.keys(transfers[0]));
  }

  const transfersByTeam = {};
  for (const t of transfers) {
    if (!transfersByTeam[t.team_id]) {
      transfersByTeam[t.team_id] = [];
    }
    transfersByTeam[t.team_id].push(t);
  }

  for (const team of teams) {
    const list = transfersByTeam[team.id] || [];
    console.log(`\n================ ${team.name} (${team.slug}) - ${list.length} FICHAJES ================`);
    for (const item of list) {
      console.log(`  * ID: ${item.id} | ${item.players?.full_name} (${item.players?.primary_position}, ${item.players?.nationality}) | Procedencia: ${item.other_club_name} | Tipo: ${item.transfer_fee_description || item.fee || '-'} | Contrato: ${item.contract_start_date} a ${item.contract_end_date}`);
    }
  }
}

main();

import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabase = createClient(
  'https://ugujgzrfysucybbncxrs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY',
  { auth: { persistSession: false }, realtime: { transport: WebSocket } }
);

async function main() {
  const { data: u } = await supabase.from('teams').select('id, name').eq('slug', 'universitario').single();

  // Update Sebastián Britos OUT record
  await supabase.from('transfers').update({
    other_club_name: 'CA Peñarol (Uruguay) / Libre',
    departure_reason: 'Término de contrato (no renovó para 2026 y salió a fines de 2025)'
  }).eq('id', '749a7d1b-aaf9-40e9-8853-0182142765b5');

  const { data: ins } = await supabase
    .from('transfers')
    .select('id, other_club_name, players(full_name, primary_position, nationality)')
    .eq('team_id', u.id)
    .eq('transfer_type', 'IN')
    .eq('season_year', 2026);

  console.log(`Universitario Fichajes 2026 (${ins.length}):`);
  for (const i of ins) {
    console.log(`  + ${i.players?.full_name} (${i.players?.primary_position}) | Procedencia: ${i.other_club_name}`);
  }

  const { data: outs } = await supabase
    .from('transfers')
    .select('id, other_club_name, departure_reason, players(full_name)')
    .eq('team_id', u.id)
    .eq('transfer_type', 'OUT')
    .eq('season_year', 2026);

  console.log(`\nUniversitario Salidas 2026 (${outs.length}):`);
  for (const o of outs) {
    console.log(`  - ${o.players?.full_name}: ${o.departure_reason} -> ${o.other_club_name}`);
  }
}

main();

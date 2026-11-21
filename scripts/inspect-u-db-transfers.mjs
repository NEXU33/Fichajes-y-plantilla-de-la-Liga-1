import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabase = createClient(
  'https://ugujgzrfysucybbncxrs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY',
  { auth: { persistSession: false }, realtime: { transport: WebSocket } }
);

async function main() {
  const { data: u } = await supabase.from('teams').select('id, name').eq('slug', 'universitario').single();
  const { data: trs } = await supabase
    .from('transfers')
    .select('id, transfer_type, departure_reason, other_club_name, season_year, announced_at, players(id, full_name, primary_position)')
    .eq('team_id', u.id);

  console.log(`Universitario transfers in DB (${trs.length}):`);
  for (const t of trs) {
    console.log(` - [${t.transfer_type}] (year ${t.season_year}) ${t.players?.full_name}: reason: ${t.departure_reason || '-'} | other: ${t.other_club_name} | announced: ${t.announced_at}`);
  }
}

main();

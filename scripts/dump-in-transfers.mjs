import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabase = createClient(
  'https://ugujgzrfysucybbncxrs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY',
  { auth: { persistSession: false }, realtime: { transport: WebSocket } }
);

async function main() {
  const { data: trs } = await supabase
    .from('transfers')
    .select('id, team_id, season_year, transfer_type, other_club_name, source_type, source_url, announced_at, contract_start_date, contract_end_date, teams(name, slug), players(id, full_name, nationality, primary_position)')
    .eq('transfer_type', 'IN');

  for (const t of trs || []) {
    console.log(JSON.stringify({
      id: t.id,
      team: t.teams?.name,
      slug: t.teams?.slug,
      player: t.players?.full_name,
      pos: t.players?.primary_position,
      nat: t.players?.nationality,
      from: t.other_club_name,
      year: t.season_year,
      source: t.source_type
    }));
  }
}

main();

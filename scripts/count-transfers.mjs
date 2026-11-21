import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabase = createClient(
  'https://ugujgzrfysucybbncxrs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY',
  { auth: { persistSession: false }, realtime: { transport: WebSocket } }
);

async function main() {
  const { count: inCount } = await supabase.from('transfers').select('*', { count: 'exact', head: true }).eq('transfer_type', 'IN').eq('season_year', 2026);
  const { count: outCount } = await supabase.from('transfers').select('*', { count: 'exact', head: true }).eq('transfer_type', 'OUT').eq('season_year', 2026);
  console.log(`Current DB transfers: IN = ${inCount}, OUT = ${outCount}`);
}

main();

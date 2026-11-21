import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function findCedron() {
  const { data: p } = await supabase.from('players').select('*').ilike('full_name', '%edr%');
  console.log('Players matching edr:', p);

  const { data: tr } = await supabase.from('transfers').select('*, players(full_name)').ilike('departure_reason', '%Cedr%');
  console.log('Transfers mentioning Cedron in reason:', tr);

  const { data: allTr } = await supabase.from('transfers').select('id, player_id, departure_reason, other_club_name, players(full_name)');
  console.log('All transfers count:', allTr?.length);
  const cedronTr = allTr?.filter(t => t.players?.full_name?.toLowerCase().includes('cedr'));
  console.log('Transfers for Cedron:', cedronTr);
}

findCedron();

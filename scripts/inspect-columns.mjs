import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function inspectColumns() {
  const { data: p } = await supabase.from('players').select('*').limit(1);
  console.log('Players table columns:', p ? Object.keys(p[0]) : 'none');

  const { data: ps } = await supabase.from('player_seasons').select('*').limit(1);
  console.log('Player_seasons table columns:', ps ? Object.keys(ps[0]) : 'none');

  const { data: tr } = await supabase.from('transfers').select('*').limit(1);
  console.log('Transfers table columns:', tr ? Object.keys(tr[0]) : 'none');
}

inspectColumns();

import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabase = createClient(
  'https://ugujgzrfysucybbncxrs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY',
  { auth: { persistSession: false }, realtime: { transport: WebSocket } }
);

async function main() {
  const { data: p } = await supabase.from('players').select('*').limit(1);
  console.log('Player keys:', Object.keys(p[0] || {}));
  const { data: tr } = await supabase.from('transfers').select('*').limit(1);
  console.log('Transfer keys:', Object.keys(tr[0] || {}));
}

main();

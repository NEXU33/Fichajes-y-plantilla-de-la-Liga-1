import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const envText = fs.readFileSync('.env', 'utf8');
const url = envText.match(/VITE_SUPABASE_URL=([^\r\n]+)/)[1].trim();
const key = envText.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/)[1].trim();

const supabase = createClient(url, key, {
  realtime: { transport: WebSocket }
});

async function main() {
  const { data, error } = await supabase.from('team_seasons').select('*').limit(1);
  if (error) console.error(error);
  else console.log('Sample team_season columns:', Object.keys(data[0] || {}));
}

main();

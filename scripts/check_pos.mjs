import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const envText = fs.readFileSync('.env', 'utf8');
const url = envText.match(/VITE_SUPABASE_URL=([^\r\n]+)/)[1].trim();
const key = envText.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/)[1].trim();
const supabase = createClient(url, key, { realtime: { transport: WebSocket } });

async function main() {
  const { data: falcon } = await supabase.from('players').select('id, full_name, primary_position').ilike('full_name', '%Falcón%');
  console.log('Falcon:', falcon);

  const { data: romero } = await supabase.from('players').select('id, full_name, primary_position').ilike('full_name', '%Diego Romero%');
  console.log('Romero:', romero);
}

main();

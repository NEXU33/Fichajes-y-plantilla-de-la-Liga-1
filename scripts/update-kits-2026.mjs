import fs from 'fs';
import WebSocket from 'ws';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('.env', 'utf8');
const url = envText.match(/VITE_SUPABASE_URL=([^\r\n]+)/)[1].trim();
const key = envText.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/)[1].trim();

const supabase = createClient(url, key, {
  realtime: { transport: WebSocket }
});

// Exact verified 2026 Local kit and shorts colors from Football Kit Archive
const kits2026 = [
  {
    name: 'Universitario de Deportes',
    primary_kit_color: '#F3EBD8', // Blanco roto / Crema marfil tradicional 2026 Local
    shorts_kit_color: '#F3EBD8',  // Crema
  },
  {
    name: 'Alianza Lima',
    primary_kit_color: '#001B44', // Azul Marina Blanquiazul 2026 Local
    shorts_kit_color: '#FFFFFF',  // Blanco tradicional
  },
  {
    name: 'Sporting Cristal',
    primary_kit_color: '#62A8E5', // Azul Celeste clásico 2026 Local
    shorts_kit_color: '#FFFFFF',  // Blanco
  },
  {
    name: 'FBC Melgar',
    primary_kit_color: '#D2232A', // Rojo carmesí rojinegro 2026 Local
    shorts_kit_color: '#111111',  // Negro carbón
  },
  {
    name: 'Cienciano',
    primary_kit_color: '#C8102E', // Rojo imperial 2026 Local
    shorts_kit_color: '#FFFFFF',  // Blanco
  },
  {
    name: 'Cusco FC',
    primary_kit_color: '#C5A059', // Dorado lítica / Oro inca 2026 Local
    shorts_kit_color: '#1A1A1A',  // Negro
  },
  {
    name: 'ADT Tarma',
    primary_kit_color: '#5BC2E7', // Celeste cielo tarmeño 2026 Local
    shorts_kit_color: '#FFFFFF',  // Blanco
  },
  {
    name: 'Atlético Grau',
    primary_kit_color: '#FFFFFF', // Blanco puro heroico 2026 Local
    shorts_kit_color: '#FFFFFF',  // Blanco
  },
  {
    name: 'Deportivo Garcilaso',
    primary_kit_color: '#75AADB', // Celeste claro Rico Garci 2026 Local
    shorts_kit_color: '#FFFFFF',  // Blanco
  },
  {
    name: 'Comerciantes Unidos',
    primary_kit_color: '#582C83', // Morado cutervino 2026 Local
    shorts_kit_color: '#582C83',  // Morado
  },
  {
    name: 'Alianza Atlético',
    primary_kit_color: '#144FB5', // Azul Rey Vendaval 2026 Local (banda blanca)
    shorts_kit_color: '#144FB5',  // Azul
  },
  {
    name: 'Sport Boys',
    primary_kit_color: '#F77398', // Rosa porteño tradicional 2026 Local
    shorts_kit_color: '#1A1A1A',  // Negro porteño
  },
  {
    name: 'Sport Huancayo',
    primary_kit_color: '#D11218', // Rojo escarlata Matador 2026 Local
    shorts_kit_color: '#D11218',  // Rojo
  },
  {
    name: 'Juan Pablo II College',
    primary_kit_color: '#FAC400', // Amarillo canario 2026 Local
    shorts_kit_color: '#4E2E1E',  // Marrón institucional
  },
  {
    name: 'FC Cajamarca',
    primary_kit_color: '#0B4EA2', // Azul real 2026 Local (rayas amarillas)
    shorts_kit_color: '#0B4EA2',  // Azul
  },
  {
    name: 'Los Chankas CYC',
    primary_kit_color: '#5B1E31', // Granate / Claret andino 2026 Local
    shorts_kit_color: '#5B1E31',  // Granate
  },
  {
    name: 'UTC Cajamarca',
    primary_kit_color: '#EEDFC8', // Crema marfil Gavilán 2026 Local
    shorts_kit_color: '#EEDFC8',  // Crema
  },
  {
    name: 'CD Moquegua',
    primary_kit_color: '#C86428', // Cobre metalizado 2026 Local (homenaje cuprífero)
    shorts_kit_color: '#0D1B2A',  // Marina
  }
];

async function updateKits() {
  console.log('Fetching teams from Supabase...');
  const { data: dbTeams, error: fetchErr } = await supabase.from('teams').select('*');
  if (fetchErr) {
    console.error('Error fetching teams:', fetchErr);
    process.exit(1);
  }

  for (const kit of kits2026) {
    const match = dbTeams.find(t => 
      t.name.toLowerCase() === kit.name.toLowerCase() ||
      t.name.toLowerCase().includes(kit.name.toLowerCase()) ||
      kit.name.toLowerCase().includes(t.name.toLowerCase())
    );

    if (!match) {
      console.warn(`[WARN] Could not find DB record for ${kit.name}`);
      continue;
    }

    const { error: updErr } = await supabase
      .from('teams')
      .update({
        primary_kit_color: kit.primary_kit_color,
        shorts_kit_color: kit.shorts_kit_color
      })
      .eq('id', match.id);

    if (updErr) {
      console.error(`  [ERROR] Failed to update ${match.name}:`, updErr);
    } else {
      console.log(`  [OK] ${match.name.padEnd(28)} -> Jersey: ${kit.primary_kit_color} | Shorts: ${kit.shorts_kit_color}`);
    }
  }

  process.exit(0);
}

updateKits();

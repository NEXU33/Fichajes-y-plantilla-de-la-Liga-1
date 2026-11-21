import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

// Supabase Configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

/**
 * 1. Obtener Tipo de Cambio EUR -> USD en tiempo real
 */
async function fetchExchangeRate() {
  console.log('🔄 Consultando tasa de cambio EUR -> USD en tiempo real...');
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/EUR');
    if (res.ok) {
      const data = await res.json();
      const rate = data.rates?.USD;
      if (rate) {
        console.log(`✅ Tipo de cambio obtenido: 1 EUR = ${rate.toFixed(4)} USD`);
        
        // Guardar en Supabase
        await supabase.from('exchange_rates').insert({
          from_currency: 'EUR',
          to_currency: 'USD',
          rate: Number(rate.toFixed(4)),
        });

        return rate;
      }
    }
  } catch (err) {
    console.warn('⚠️ Error en primer endpoint de divisas, intentando alternativa...', err.message);
  }

  // Fallback API
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?from=EUR&to=USD');
    const data = await res.json();
    const rate = data.rates?.USD || 1.055;
    console.log(`✅ Tipo de cambio (fallback): 1 EUR = ${rate.toFixed(4)} USD`);
    return rate;
  } catch (err) {
    console.warn('⚠️ Fallback también falló, usando tasa estimada 1.055', err.message);
    return 1.055;
  }
}

/**
 * 2. Parsear valores de texto de Transfermarkt (ej: "15,50 mill. €" o "450 mil €")
 */
function parseTransfermarktValue(str) {
  if (!str) return 0;
  const clean = str.replace(/\s+/g, ' ').trim().toLowerCase();
  
  if (clean.includes('mill')) {
    const num = parseFloat(clean.replace('mill. €', '').replace('mill. eur', '').replace(',', '.').trim());
    return Math.round(num * 1_000_000);
  }
  if (clean.includes('mil') || clean.includes('k')) {
    const num = parseFloat(clean.replace('mil €', '').replace('k €', '').replace(',', '.').trim());
    return Math.round(num * 1_000);
  }
  return 0;
}

/**
 * 3. Consultar datos de Transfermarkt para los clubes de la Liga 1
 */
async function syncTransfermarktTeams(seasonYear, exchangeRate) {
  console.log(`\n⚽ Sincronizando valores de mercado de la Liga 1 para la temporada ${seasonYear}...`);

  const url = `https://www.transfermarkt.es/liga-1-apertura/startseite/wettbewerb/TS1A/saison_id/${seasonYear}`;
  
  let html = '';
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (response.ok) {
      html = await response.text();
      console.log('✅ Conexión con Transfermarkt exitosa.');
    } else {
      console.warn(`⚠️ Transfermarkt devolvió status ${response.status}. Recalculando con base de datos y nuevo tipo de cambio.`);
    }
  } catch (err) {
    console.warn('⚠️ No se pudo conectar a Transfermarkt en esta iteración:', err.message);
  }

  // Traer equipos existentes en la base de datos
  const { data: teams, error } = await supabase.from('teams').select('id, name, slug');
  if (error || !teams) {
    console.error('❌ Error al obtener equipos de la base de datos:', error);
    return;
  }

  console.log(`📋 ${teams.length} equipos activos en la base de datos de la Liga 1.`);

  // Actualizar valores de cada equipo recalculando con la tasa EUR/USD actual
  const updates = [];
  
  for (const team of teams) {
    let eurValue = 0;
    let squadSize = 26;

    if (html.includes(team.name) || html.includes(team.slug)) {
      const regex = new RegExp(`${team.name}[\\s\\S]*?([0-9]+,[0-9]+\\s*(?:mill\\.|mil)\\s*€)`, 'i');
      const match = html.match(regex);
      if (match && match[1]) {
        eurValue = parseTransfermarktValue(match[1]);
      }
    }

    // Obtener valor actual si Transfermarkt no devolvió valor nuevo
    if (eurValue === 0) {
      const { data: current } = await supabase
        .from('team_seasons')
        .select('total_value_eur, squad_size')
        .eq('team_id', team.id)
        .eq('season_year', seasonYear)
        .maybeSingle();

      eurValue = current?.total_value_eur ? Number(current.total_value_eur) : 6000000;
      squadSize = current?.squad_size || 26;
    }

    const usdValue = Math.round(eurValue * exchangeRate);

    updates.push({
      team_id: team.id,
      name: team.name,
      season_year: seasonYear,
      total_value_eur: eurValue,
      total_value_usd: usdValue,
      squad_size: squadSize,
    });
  }

  // Ordenar de mayor a menor valor para determinar el ranking
  updates.sort((a, b) => b.total_value_usd - a.total_value_usd);

  for (let i = 0; i < updates.length; i++) {
    const item = updates[i];
    const rank = i + 1;

    const { error: upsertErr } = await supabase.from('team_seasons').upsert({
      team_id: item.team_id,
      season_year: item.season_year,
      total_value_eur: item.total_value_eur,
      total_value_usd: item.total_value_usd,
      squad_size: item.squad_size,
      rank_value: rank,
      last_updated: new Date().toISOString(),
    }, { onConflict: 'team_id,season_year' });

    if (upsertErr) {
      console.error(`Error al actualizar ${item.name}:`, upsertErr.message);
    } else {
      if (rank <= 8) {
        console.log(`  ⭐ [TOP ${rank}] ${item.name.padEnd(26)} $${(item.total_value_usd / 1_000_000).toFixed(2)}M USD (€${(item.total_value_eur / 1_000_000).toFixed(2)}M)`);
      }
    }
  }

  console.log(`\n✅ Se recalcularon y actualizaron los ${updates.length} equipos para la temporada ${seasonYear}.`);
}

/**
 * 4. Función Principal
 */
async function main() {
  console.log('====================================================');
  console.log(`🕒 EJECUTANDO TAREA DE SINCRONIZACIÓN LIGA 1 (12H)`);
  console.log(`Fecha local: ${new Date().toLocaleString('es-PE')}`);
  console.log('====================================================\n');

  // Obtener temporada activa
  const { data: season } = await supabase
    .from('seasons')
    .select('year')
    .eq('is_current', true)
    .single();

  const currentYear = season?.year || 2026;

  // 1. Tipo de cambio EUR -> USD en tiempo real
  const rate = await fetchExchangeRate();

  // 2. Valores de mercado y ranking de equipos
  await syncTransfermarktTeams(currentYear, rate);

  console.log('\n====================================================');
  console.log('🎉 Sincronización finalizada con éxito.');
  console.log('====================================================');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error fatal en el proceso:', err);
  process.exit(1);
});

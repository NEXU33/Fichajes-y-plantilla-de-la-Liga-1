import { useEffect, useState } from 'react';
import { supabase, type Team, type TeamSeason, type TransferMovement } from './lib/supabase';
import { TopTeamsList } from './components/TopTeamsList';
import { TransfersTab } from './components/TransfersTab';
import { DeparturesTab } from './components/DeparturesTab';
import { RosterTab } from './components/RosterTab';
import { PlayerModal } from './components/PlayerModal';
import { Shield, TrendingUp, Users, Sparkles, LogOut, RefreshCw, DollarSign, Calendar } from 'lucide-react';

export function App() {
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [activeTab, setActiveTab] = useState<'TEAMS' | 'ROSTER' | 'TRANSFERS' | 'DEPARTURES'>('TEAMS');

  // App Data State
  const [teamSeasons, setTeamSeasons] = useState<TeamSeason[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [transfers, setTransfers] = useState<TransferMovement[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(1.0999);
  const [loading, setLoading] = useState<boolean>(true);

  // Dynamic Date formatting: "18 de noviembre de 2026", updates automatically every day
  const [currentDateFormatted, setCurrentDateFormatted] = useState<string>('');

  // Selected player for modal
  const [selectedPlayerModal, setSelectedPlayerModal] = useState<{
    playerId: string;
    team: Team;
    contractStart?: string;
    contractEnd?: string;
  } | null>(null);

  // Selected team for roster tab
  const [selectedTeamForRoster, setSelectedTeamForRoster] = useState<Team | null>(null);

  const getTodayFormatted = () => {
    const now = new Date();
    return new Intl.DateTimeFormat('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);
  };

  const loadData = async () => {
    setLoading(true);
    setCurrentDateFormatted(getTodayFormatted());

    try {
      // 1. Get current season year
      const { data: seasonData } = await supabase
        .from('seasons')
        .select('year')
        .eq('is_current', true)
        .single();

      const year = seasonData?.year || 2026;
      setCurrentYear(year);

      // 2. Get EUR -> USD exchange rate
      const { data: rateData } = await supabase
        .from('exchange_rates')
        .select('rate, updated_at')
        .eq('from_currency', 'EUR')
        .eq('to_currency', 'USD')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (rateData?.rate) {
        setExchangeRate(Number(rateData.rate));
      }

      // 3. Get all team_seasons for the current year
      const { data: tsData } = await supabase
        .from('team_seasons')
        .select('*, teams(*)')
        .eq('season_year', year)
        .order('rank_value', { ascending: true });

      if (tsData) {
        setTeamSeasons(tsData as TeamSeason[]);
        const extractedTeams = tsData.map((item: any) => item.teams).filter(Boolean);
        setTeams(extractedTeams);
        if (extractedTeams.length > 0 && !selectedTeamForRoster) {
          setSelectedTeamForRoster(extractedTeams[0]);
        }
      }

      // 4. Get transfers for current year (IN & OUT)
      const { data: trData } = await supabase
        .from('transfers')
        .select('*, players(*), teams(*)')
        .eq('season_year', year)
        .order('announced_at', { ascending: false });

      if (trData) {
        setTransfers(trData as TransferMovement[]);
      }
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectTeamForRoster = (team: Team) => {
    setSelectedTeamForRoster(team);
    setActiveTab('ROSTER');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & App Title: Liga 1 DEL FUTBOL PERUANO */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-amber-600 flex items-center justify-center shadow-lg shadow-red-950/50">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white tracking-wider uppercase">
                  Liga 1 DEL FUTBOL PERUANO
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-black bg-red-600/20 text-red-400 border border-red-500/30">
                  {currentYear}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Valores de Mercado, Fichajes Oficiales y Avatares 3D
              </p>
            </div>
          </div>

          {/* Dynamic Date & Currency Indicator & Sync Status */}
          <div className="flex items-center flex-wrap gap-3">
            {/* Dynamic Date formatted in Spanish */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-red-400" />
              <span>
                Actualizado al{' '}
                <strong className="text-white font-semibold">
                  {currentDateFormatted || '18 de noviembre de 2026'}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>
                EUR/USD:{' '}
                <strong className="text-emerald-400 font-mono">
                  {exchangeRate.toFixed(4)}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sync cada 12h</span>
            </div>

            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-red-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Tab 1: Top Equipos */}
          <button
            onClick={() => setActiveTab('TEAMS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition cursor-pointer ${
              activeTab === 'TEAMS'
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Equipos Más Caros
          </button>

          {/* Tab 2: Plantillas y Fichas */}
          <button
            onClick={() => setActiveTab('ROSTER')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition cursor-pointer ${
              activeTab === 'ROSTER'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/60'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Plantillas & Jugadores
          </button>

          {/* Tab 3: Dynamic Fichajes [Año Actual] */}
          <button
            onClick={() => setActiveTab('TRANSFERS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition cursor-pointer ${
              activeTab === 'TRANSFERS'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            Fichajes {currentYear}
          </button>

          {/* Tab 4: Salidas de Jugadores */}
          <button
            onClick={() => setActiveTab('DEPARTURES')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition cursor-pointer ${
              activeTab === 'DEPARTURES'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/60'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <LogOut className="w-4 h-4 text-orange-300" />
            Salidas de Jugadores
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full p-4 lg:p-8 flex-1">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="font-medium text-sm">Cargando base de datos oficial de la Liga 1...</p>
          </div>
        ) : (
          <>
            {activeTab === 'TEAMS' && (
              <TopTeamsList
                teamsData={teamSeasons}
                currentYear={currentYear}
                onSelectTeamForRoster={handleSelectTeamForRoster}
              />
            )}

            {activeTab === 'ROSTER' && (
              <RosterTab
                teams={teams}
                selectedTeam={selectedTeamForRoster}
                onSelectTeam={setSelectedTeamForRoster}
                currentYear={currentYear}
                onSelectPlayer={(playerId, team) =>
                  setSelectedPlayerModal({ playerId, team })
                }
              />
            )}

            {activeTab === 'TRANSFERS' && (
              <TransfersTab
                transfers={transfers}
                allTeams={teams}
                currentYear={currentYear}
                onSelectPlayer={(playerId, team, start, end) =>
                  setSelectedPlayerModal({
                    playerId,
                    team,
                    contractStart: start,
                    contractEnd: end,
                  })
                }
              />
            )}

            {activeTab === 'DEPARTURES' && (
              <DeparturesTab
                transfers={transfers}
                allTeams={teams}
                currentYear={currentYear}
                onSelectPlayer={(playerId, team, start, end) =>
                  setSelectedPlayerModal({
                    playerId,
                    team,
                    contractStart: start,
                    contractEnd: end,
                  })
                }
              />
            )}
          </>
        )}
      </main>

      {/* Player Detail Modal with 3D Avatar */}
      {selectedPlayerModal && (
        <PlayerModal
          playerId={selectedPlayerModal.playerId}
          team={selectedPlayerModal.team}
          seasonYear={currentYear}
          contractStart={selectedPlayerModal.contractStart}
          contractEnd={selectedPlayerModal.contractEnd}
          onClose={() => setSelectedPlayerModal(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 px-4 py-6 text-center text-xs text-slate-500">
        <p>
          Liga 1 DEL FUTBOL PERUANO • Estadísticas completas, valores de mercado y visualización 3D interactiva.
        </p>
        <p className="mt-1 text-slate-600">
          Nóminas oficiales y movimientos de la temporada actualizados periódicamente.
        </p>
      </footer>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import type { Team, PlayerSeason } from '../lib/supabase';
import { Users, Search, RefreshCw, ShieldCheck } from 'lucide-react';
import { CountryFlag } from './CountryFlag';
import { TeamColorChip3D } from './TeamColorChip3D';
import { getStrictActiveSquad, getFormattedToday, type SquadFilterStats } from '../lib/dailySquadSync';

interface RosterTabProps {
  teams: Team[];
  selectedTeam: Team | null;
  onSelectTeam: (team: Team) => void;
  currentYear: number;
  onSelectPlayer: (playerId: string, team: Team) => void;
}

export const RosterTab: React.FC<RosterTabProps> = ({
  teams,
  selectedTeam,
  onSelectTeam,
  currentYear,
  onSelectPlayer,
}) => {
  const [activeTeam, setActiveTeam] = useState<Team | null>(selectedTeam || (teams.length > 0 ? teams[0] : null));
  const [players, setPlayers] = useState<PlayerSeason[]>([]);
  const [filterStats, setFilterStats] = useState<SquadFilterStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshCooldown, setRefreshCooldown] = useState<number>(0);

  useEffect(() => {
    if (refreshCooldown <= 0) return;
    const timer = setInterval(() => {
      setRefreshCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [refreshCooldown]);

  const handleManualRefresh = () => {
    if (loading || refreshCooldown > 0) return;
    fetchSquad();
    setRefreshCooldown(10);
  };

  useEffect(() => {
    if (selectedTeam) {
      setActiveTeam(selectedTeam);
    } else if (teams.length > 0 && !activeTeam) {
      setActiveTeam(teams[0]);
    }
  }, [selectedTeam, teams]);

  const fetchSquad = async () => {
    if (!activeTeam) return;
    setLoading(true);
    try {
      // Filtro estricto en código: solo año y día vigente, depuración de salidas y caducados
      const { players: verifiedPlayers, stats } = await getStrictActiveSquad(activeTeam.id, currentYear);
      setPlayers(verifiedPlayers);
      setFilterStats(stats);
    } catch (err) {
      console.error('Error fetching strict squad:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSquad();
  }, [activeTeam, currentYear]);

  const filteredPlayers = players.filter((ps) => {
    const name = ps.players?.full_name?.toLowerCase() || '';
    const pos = ps.players?.primary_position?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return name.includes(query) || pos.includes(query);
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-900/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-2">
            <Users className="w-3.5 h-3.5" />
            Plantillas Oficiales • Temporada {currentYear}
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Plantillas y Jugadores de la Liga 1
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Explora la nómina completa de cada club. Haz clic en cualquier jugador para abrir su ficha técnica detallada y visualizar su avatar 3D.
          </p>
        </div>

        {/* Club Switcher Pills */}
        <div className="w-full md:w-auto">
          <select
            value={activeTeam?.id || ''}
            onChange={(e) => {
              const chosen = teams.find((t) => t.id === e.target.value);
              if (chosen) {
                setActiveTeam(chosen);
                onSelectTeam(chosen);
              }
            }}
            className="w-full md:w-64 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Daily Status & Strict Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2.5 text-xs text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-white">Nómina Oficial:</span>
            <span className="text-emerald-400 font-bold">{getFormattedToday()}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-medium">
              Filtro estricto: año vigente y contratos activos al día de hoy
            </span>
          </div>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={loading || refreshCooldown > 0}
          className="self-end sm:self-auto flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-xs border border-blue-500/30 transition cursor-pointer disabled:opacity-40 disabled:hover:bg-blue-600/20 disabled:cursor-not-allowed"
          title={refreshCooldown > 0 ? `Espera ${refreshCooldown}s para volver a consultar` : "Actualizar nómina"}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{refreshCooldown > 0 ? `Actualizado (${refreshCooldown}s)` : 'Refrescar nómina'}</span>
        </button>
      </div>

      {/* Selected Team Profile Bar */}
      {activeTeam && (
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-800 shadow-md gap-4"
          style={{ backgroundColor: `${activeTeam.primary_kit_color}1a` }}
        >
          <div className="flex items-center gap-4">
            {activeTeam.logo_url && (
              <img
                src={activeTeam.logo_url}
                alt=""
                className="w-14 h-14 object-contain drop-shadow"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-white">
                  {activeTeam.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {players.length} futbolistas
                </span>
                {filterStats && filterStats.purgedDepartures > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30" title="Bajas transferidas depuradas del plantel activo">
                    <ShieldCheck className="w-3 h-3" />
                    {filterStats.purgedDepartures} baja(s) depurada(s)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span>Nómina oficial de la Liga 1 • Temporada {currentYear}</span>
                {activeTeam.x_handle && (
                  <span className="text-sky-400 font-mono">{activeTeam.x_handle}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* 3D Color Chip */}
            <div className="bg-slate-950/70 p-2 rounded-2xl border border-slate-800 shadow">
              <TeamColorChip3D
                primaryColor={activeTeam.primary_kit_color || '#C8102E'}
                secondaryColor={activeTeam.shorts_kit_color}
                teamName={activeTeam.name}
                size="md"
                showLabel={true}
              />
            </div>

            {/* Search in squad */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar jugador o posición..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
              />
            </div>
          </div>
        </div>
      )}

      {/* Players List Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Cargando plantilla...
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
          No se encontraron jugadores registrados en esta plantilla para {currentYear}.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPlayers.map((ps) => {
            const player = ps.players;
            if (!player || !activeTeam) return null;

            return (
              <div
                key={ps.id}
                onClick={() => onSelectPlayer(player.id, activeTeam)}
                className="group relative flex flex-col justify-between p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 transition cursor-pointer shadow-md hover:-translate-y-0.5"
              >
                <div>
                  {/* Jersey number & position badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {player.primary_position}
                    </span>
                    {ps.jersey_number && (
                      <span className="text-xs font-mono font-bold text-slate-400">
                        #{ps.jersey_number}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition leading-snug">
                    {player.full_name}
                  </h4>
                  <div className="mt-1.5">
                    <CountryFlag nationality={player.nationality} size="sm" />
                  </div>
                </div>

                {/* Market Value & matches */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">
                      Valor
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      ${Number(ps.market_value_usd).toLocaleString('en-US')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">
                      Partidos
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      {ps.matches_played} PJ
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-right text-[11px] font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition">
                  Ver ficha 3D &rarr;
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

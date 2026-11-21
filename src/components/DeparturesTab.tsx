import React, { useState, useMemo } from 'react';
import type { TransferMovement, Team } from '../lib/supabase';
import { CountryFlag } from './CountryFlag';
import { TeamColorChip3D } from './TeamColorChip3D';
import { LogOut, Shield, AlertCircle, ArrowRight, Calendar, Search } from 'lucide-react';

interface DeparturesTabProps {
  transfers: TransferMovement[];
  allTeams: Team[];
  currentYear: number;
  onSelectPlayer?: (
    playerId: string,
    team: Team,
    contractStart?: string,
    contractEnd?: string
  ) => void;
}

export const DeparturesTab: React.FC<DeparturesTabProps> = ({
  transfers,
  allTeams,
  currentYear,
  onSelectPlayer,
}) => {
  const [filterTeam, setFilterTeam] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Strictly departures (transfer_type === 'OUT')
  const departures = useMemo(() => {
    return transfers.filter((t) => t.transfer_type === 'OUT');
  }, [transfers]);

  // Valid teams map
  const validTeamsMap = useMemo(() => {
    const map = new Map<string, Team>();
    allTeams.forEach((t) => map.set(t.id, t));
    return map;
  }, [allTeams]);

  // Deduplicate and filter departures
  const filteredDepartures = useMemo(() => {
    const seenPlayerNames = new Set<string>();

    return departures.filter((item) => {
      // Must belong to an active Liga 1 team
      if (!validTeamsMap.has(item.team_id)) return false;

      // Filter by club if selected
      if (filterTeam !== 'ALL' && item.team_id !== filterTeam) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const pName = (item.players?.full_name || '').toLowerCase();
        const tName = (item.teams?.name || '').toLowerCase();
        const destName = (item.other_club_name || '').toLowerCase();
        const pos = (item.players?.primary_position || '').toLowerCase();

        if (
          !pName.includes(query) &&
          !tName.includes(query) &&
          !destName.includes(query) &&
          !pos.includes(query)
        ) {
          return false;
        }
      }

      // Deduplicate by normalized player name within the same departure club
      const normKey = `${item.team_id}_${(item.players?.full_name || item.player_id)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()}`;

      if (seenPlayerNames.has(normKey)) return false;
      seenPlayerNames.add(normKey);

      return true;
    });
  }, [departures, validTeamsMap, filterTeam, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner - Matching Fichajes 2026 layout with red/rose theme */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-900/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-2">
            <LogOut className="w-3.5 h-3.5" />
            Salidas y Desvinculaciones Oficiales ({currentYear})
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Salidas de Jugadores de la Liga 1
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Registro oficial de bajas, términos de contrato y traspasos confirmados de los 18 clubes de la Liga 1.
          </p>
        </div>

        {/* Search & Club filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar jugador o destino..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Club filter dropdown */}
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="w-full sm:w-60 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
          >
            <option value="ALL">Todos los clubes ({departures.length} bajas)</option>
            {allTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          {(filterTeam !== 'ALL' || searchQuery.trim()) && (
            <button
              onClick={() => {
                setFilterTeam('ALL');
                setSearchQuery('');
              }}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition whitespace-nowrap cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Grid of Players with exact design and finish of Fichajes 2026 */}
      {filteredDepartures.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400">
          <p className="text-base font-semibold mb-1">
            {searchQuery
              ? `No se encontraron salidas con "${searchQuery}"`
              : `No hay salidas registradas en la temporada ${currentYear}.`}
          </p>
          <p className="text-xs text-slate-500">
            Los registros oficiales se sincronizan con las listas de desvinculaciones de la competición.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartures.map((item) => {
            const player = item.players;
            const team = item.teams;

            return (
              <div
                key={item.id}
                onClick={() =>
                  player &&
                  team &&
                  onSelectPlayer?.(
                    player.id,
                    team,
                    item.contract_start_date,
                    item.contract_end_date
                  )
                }
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 transition duration-300 shadow-lg cursor-pointer transform hover:-translate-y-1"
              >
                {/* Header with Club badge, 3D Color Chip & Departure label */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {team?.logo_url ? (
                      <img
                        src={team.logo_url}
                        alt=""
                        className="w-8 h-8 object-contain drop-shadow"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Shield className="w-6 h-6 text-slate-500" />
                    )}
                    <span className="text-xs font-bold text-slate-300">
                      {team?.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {team && (
                      <TeamColorChip3D
                        primaryColor={team.primary_kit_color || '#C8102E'}
                        secondaryColor={team.shorts_kit_color}
                        teamName={team.name}
                        size="xs"
                      />
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      SALIDA {currentYear}
                    </span>
                  </div>
                </div>

                {/* Player details */}
                <div className="my-4">
                  <h3 className="text-xl font-black text-white group-hover:text-rose-400 transition">
                    {player?.full_name || 'Jugador'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                    <CountryFlag nationality={player?.nationality} size="sm" />
                    <span>•</span>
                    <span className="text-indigo-400 font-semibold">{player?.primary_position}</span>
                  </div>

                  {/* Transfer destination */}
                  <div className="mt-3 flex items-center gap-2 text-xs p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <span className="text-slate-500">Nuevo destino:</span>
                    <span className="font-semibold text-slate-200 truncate">
                      {item.other_club_name || 'Agente Libre / Retiro'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-rose-400 ml-auto flex-shrink-0" />
                  </div>

                  {/* Departure reason tag */}
                  <div className="mt-2 text-xs text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{item.departure_reason || 'Término de contrato'}</span>
                  </div>
                </div>

                {/* Contract dates preview */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      Período:{' '}
                      <strong className="text-slate-300">
                        {item.contract_start_date ? new Date(item.contract_start_date).getFullYear() : '2024'} -{' '}
                        {item.contract_end_date ? new Date(item.contract_end_date).getFullYear() : '2025'}
                      </strong>
                    </span>
                  </div>

                  {/* Status indicator */}
                  <div className="flex items-center gap-1 font-mono text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold">
                      Baja
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-right text-[11px] font-semibold text-rose-400 opacity-0 group-hover:opacity-100 transition">
                  Ver ficha técnica y 3D &rarr;
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import type { TransferMovement, Team } from '../lib/supabase';
import { CountryFlag } from './CountryFlag';
import { TeamColorChip3D } from './TeamColorChip3D';
import { Sparkles, Calendar, ArrowRight, Shield } from 'lucide-react';

interface TransfersTabProps {
  transfers: TransferMovement[];
  allTeams: Team[];
  currentYear: number;
  onSelectPlayer: (playerId: string, team: Team, contractStart?: string, contractEnd?: string) => void;
}

export const TransfersTab: React.FC<TransfersTabProps> = ({
  transfers,
  allTeams,
  currentYear,
  onSelectPlayer,
}) => {
  const [filterTeam, setFilterTeam] = useState<string>('ALL');

  const validTeamIds = useMemo(() => new Set(allTeams.map((t) => t.id)), [allTeams]);
  const inTransfers = useMemo(() => transfers.filter((t) => t.transfer_type === 'IN' && validTeamIds.has(t.team_id)), [transfers, validTeamIds]);

  const filtered = useMemo(() => {
    return filterTeam === 'ALL'
      ? inTransfers
      : inTransfers.filter((t) => t.team_id === filterTeam);
  }, [filterTeam, inTransfers]);

  const selectedTeamObj = useMemo(() => allTeams.find((t) => t.id === filterTeam), [allTeams, filterTeam]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-900/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Nuevas Incorporaciones Oficiales
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Fichajes Liga 1 ({currentYear})
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Monitoreo en tiempo real de altas, incorporaciones y traspasos confirmados de la competición.
          </p>
        </div>

        {/* Team filter dropdown: lists ALL 18 clubs of the Liga 1 */}
        <div className="flex items-center gap-3">
          <label htmlFor="team-select" className="text-xs text-slate-400 font-semibold hidden sm:inline">
            Filtrar club:
          </label>
          <select
            id="team-select"
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL">Todos los clubes de la Liga 1 ({inTransfers.length} fichajes)</option>
            {allTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Signings */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 flex flex-col items-center justify-center gap-3">
          {selectedTeamObj?.logo_url && (
            <img src={selectedTeamObj.logo_url} alt={selectedTeamObj.name} className="w-12 h-12 object-contain drop-shadow mb-1" />
          )}
          <p className="text-base font-semibold text-slate-300">
            {selectedTeamObj
              ? `No se registran nuevos fichajes para ${selectedTeamObj.name} en la temporada ${currentYear}.`
              : `No hay fichajes registrados en la temporada ${currentYear}.`}
          </p>
          <p className="text-xs text-slate-500">
            Los anuncios se sincronizan cada 12 horas desde redes oficiales y registros de la competición.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const player = item.players;
            const team = item.teams;

            return (
              <div
                key={item.id}
                onClick={() =>
                  player && team && onSelectPlayer(player.id, team, item.contract_start_date, item.contract_end_date)
                }
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 transition duration-300 shadow-lg cursor-pointer transform hover:-translate-y-1"
              >
                {/* Header with Club badge, 3D Color Chip & Transfer label */}
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
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      FICHAJE {currentYear}
                    </span>
                  </div>
                </div>

                {/* Player details */}
                <div className="my-4">
                  <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition">
                    {player?.full_name || 'Jugador'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                    <CountryFlag nationality={player?.nationality} size="sm" />
                    <span>•</span>
                    <span className="text-indigo-400 font-semibold">{player?.primary_position}</span>
                  </div>

                  {/* Transfer origin */}
                  <div className="mt-3 flex items-center gap-2 text-xs p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <span className="text-slate-500">Club de procedencia:</span>
                    <span className="font-semibold text-slate-200 truncate">
                      {item.other_club_name || 'Agente Libre'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 ml-auto flex-shrink-0" />
                  </div>
                </div>

                {/* Contract dates preview */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      Vínculo:{' '}
                      <strong className="text-slate-300">
                        {item.contract_start_date ? new Date(item.contract_start_date).getFullYear() : '2026'} -{' '}
                        {item.contract_end_date ? new Date(item.contract_end_date).getFullYear() : '2026'}
                      </strong>
                    </span>
                  </div>

                  {/* Status indicator */}
                  <div className="flex items-center gap-1 font-mono text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                      Confirmado
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-right text-[11px] font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition">
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

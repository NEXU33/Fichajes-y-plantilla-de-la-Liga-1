import React, { useEffect, useState } from 'react';
import { supabase, type Player, type Team, type PreviousClub } from '../lib/supabase';
import { PlayerAvatar3D } from './PlayerAvatar3D';
import { CountryFlag } from './CountryFlag';
import { TeamColorChip3D } from './TeamColorChip3D';
import { getPlayerAppearance } from '../utils/playerAppearance';
import { X, Calendar, Award, Shield, DollarSign, History, Clock } from 'lucide-react';

interface PlayerModalProps {
  playerId: string;
  team: Team;
  seasonYear: number;
  contractStart?: string;
  contractEnd?: string;
  onClose: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  playerId,
  team,
  seasonYear,
  contractStart,
  contractEnd,
  onClose,
}) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<{ market_value_usd: number; market_value_eur: number; matches_played: number; jersey_number?: number } | null>(null);
  const [previousClubs, setPreviousClubs] = useState<PreviousClub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Player bio
        const { data: pData } = await supabase
          .from('players')
          .select('*')
          .eq('id', playerId)
          .single();

        if (pData) setPlayer(pData);

        // 2. Fetch Season stats & market value
        const { data: sData } = await supabase
          .from('player_seasons')
          .select('market_value_usd, market_value_eur, matches_played, jersey_number, contract_start_date, contract_end_date')
          .eq('player_id', playerId)
          .eq('season_year', seasonYear)
          .maybeSingle();

        if (sData) setStats(sData);

        // 3. Fetch Last 3 previous clubs
        const { data: cData } = await supabase
          .from('player_previous_clubs')
          .select('*')
          .eq('player_id', playerId)
          .order('order_index', { ascending: true })
          .limit(3);

        if (cData) setPreviousClubs(cData);
      } catch (err) {
        console.error('Error fetching player details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [playerId, seasonYear]);

  // Calculate age from birth date
  const calculateAge = (birthDateString?: string) => {
    if (!birthDateString) return 'N/D';
    const birth = new Date(birthDateString);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} años`;
  };

  const formatCurrency = (val?: number, currency = 'USD') => {
    if (!val) return '$0';
    if (currency === 'EUR') {
      return `€${val.toLocaleString('es-PE', { maximumFractionDigits: 0 })}`;
    }
    return `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
        {/* Header club banner */}
        <div 
          className="relative px-6 py-4 flex items-center justify-between border-b border-white/10"
          style={{ backgroundColor: `${team.primary_kit_color}25` }}
        >
          <div className="flex items-center gap-3">
            {team.logo_url && (
              <img
                src={team.logo_url}
                alt=""
                className="w-10 h-10 object-contain drop-shadow"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            <div>
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {team.name} • Temporada {seasonYear}
              </span>
              <h2 className="text-xl font-bold text-white leading-tight">
                Ficha Técnica Oficial
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TeamColorChip3D
              primaryColor={team.primary_kit_color || '#C8102E'}
              secondaryColor={team.shorts_kit_color}
              teamName={team.name}
              size="sm"
            />
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p>Cargando ficha del jugador...</p>
          </div>
        ) : player ? (
          <div className="grid grid-cols-1 md:grid-cols-12 p-6 gap-6 max-h-[85vh] overflow-y-auto">
            {/* Left Column: 3D Avatar & Kit Preview */}
            <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {(() => {
                const app = getPlayerAppearance(
                  player.full_name,
                  player.primary_position,
                  team.name,
                  player.nationality,
                  player.id,
                  player.slug
                );

                return (
                  <>
                    <div className="relative w-full flex justify-center">
                      <PlayerAvatar3D
                        jerseyColor={team.primary_kit_color || '#C8102E'}
                        shortsColor={team.shorts_kit_color || '#FFFFFF'}
                        playerName={player.full_name}
                        position={player.primary_position}
                        teamName={team.name}
                        nationality={player.nationality}
                        squadNumber={stats?.jersey_number || 10}
                        appearance={app}
                        height={380}
                        width={290}
                        interactive={true}
                      />
                    </div>

                    {/* Kit & Visual Traits Legend */}
                    <div className="mt-3 flex flex-wrap justify-center items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{
                            backgroundColor: app.isGoalkeeper
                              ? app.gkJerseyColor
                              : team.primary_kit_color,
                          }}
                        />
                        <span className="text-white font-medium">
                          {app.isGoalkeeper ? 'Uniforme Arquero' : 'Camiseta'}
                        </span>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{
                            backgroundColor: app.isGoalkeeper
                              ? app.gkShortsColor
                              : team.shorts_kit_color,
                          }}
                        />
                        <span className="text-white font-medium">Short</span>
                      </span>

                      {app.isGoalkeeper ? (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px] font-bold">
                          <span
                            className="w-2.5 h-2.5 rounded-sm"
                            style={{ backgroundColor: app.gkGlovesColor }}
                          />
                          Guantes
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-bold">
                          ⚽ Balón Oficial
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400">
                        Tez: <strong className="text-slate-200">
                          {app.skinCategory === 'white' ? 'Blanca' : app.skinCategory === 'moreno' ? 'Morena' : 'Mestiza'}
                        </strong>
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-2 text-center">
                      * Modelo 3D interactivo. Haz clic y arrastra para rotar.
                    </p>
                  </>
                );
              })()}
            </div>

            {/* Right Column: Bio Data, Market Value & Previous Clubs */}
            <div className="md:col-span-7 flex flex-col gap-4">
              {/* Player Name & Nationality */}
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {player.full_name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
                    <CountryFlag nationality={player.nationality} size="md" />
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    {calculateAge(player.birth_date)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Shield className="w-3 h-3" />
                    {player.primary_position}
                  </span>
                  {player.secondary_position && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800/60 text-slate-400 border border-slate-800">
                      Sec: {player.secondary_position}
                    </span>
                  )}
                </div>
              </div>

              {/* Market Value Cards */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Valor de Mercado Actual
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="text-xl font-bold text-emerald-400">
                      {formatCurrency(stats?.market_value_usd, 'USD')}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    ({formatCurrency(stats?.market_value_eur, 'EUR')})
                  </span>
                </div>

                <div className="border-l border-slate-800 pl-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Partidos Año {seasonYear}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-xl font-bold text-amber-300">
                      {stats?.matches_played ?? 0}
                    </span>
                    <span className="text-xs text-slate-400">jugados</span>
                  </div>
                  <span className="text-[11px] text-slate-500">en temporada oficial</span>
                </div>
              </div>

              {/* Contract Information (if available) */}
              {(contractStart || contractEnd) && (
                <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40">
                  <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    Vínculo Contractual con {team.name}
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Inicio de vínculo:</span>
                      <span className="font-semibold text-slate-200">
                        {contractStart ? new Date(contractStart).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No registrado'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Expiración de contrato:</span>
                      <span className="font-semibold text-slate-200">
                        {contractEnd ? new Date(contractEnd).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No registrado'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Last 3 Clubs */}
              <div className="mt-1">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  Últimos 3 Clubes Anteriores
                </span>

                {previousClubs.length > 0 ? (
                  <div className="space-y-2">
                    {previousClubs.map((club, idx) => (
                      <div
                        key={club.id || idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-200">
                            {club.club_name}
                          </span>
                        </div>
                        <span className="text-slate-400 font-mono bg-slate-800/50 px-2 py-0.5 rounded">
                          {club.years}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-900/40 rounded-lg">
                    Sin registro de clubes previos disponible.
                  </p>
                )}
              </div>

              {/* Status and updates */}
              <div className="mt-auto pt-2 text-[11px] text-slate-500 flex justify-between items-center border-t border-slate-800">
                <span>Ficha Técnica Oficial • Temporada 2026</span>
                <span>Actualización periódica</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">
            No se encontró la información del jugador.
          </div>
        )}
      </div>
    </div>
  );
};

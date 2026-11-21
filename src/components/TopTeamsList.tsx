import React, { useState } from 'react';
import type { TeamSeason, Team } from '../lib/supabase';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { TeamKitSquare3D } from './TeamKitSquare3D';
import { LIGA1_EXACT_RANKINGS_2026 } from '../data/liga1Rankings';

interface TopTeamsListProps {
  teamsData: TeamSeason[];
  currentYear: number;
  onSelectTeamForRoster: (team: Team) => void;
}

export const TopTeamsList: React.FC<TopTeamsListProps> = ({
  teamsData,
  currentYear,
  onSelectTeamForRoster,
}) => {
  const [showAllTeams, setShowAllTeams] = useState(false);
  const [currencyMode, setCurrencyMode] = useState<'EUR' | 'USD' | 'DUAL'>('EUR');
  const [hoveredClubRank, setHoveredClubRank] = useState<number | null>(null);

  // Merge exact Apertura rankings with DB teamsData
  const mergedList = LIGA1_EXACT_RANKINGS_2026.map((ranking) => {
    // Find matching team in DB
    const dbMatch = teamsData.find((ts) => {
      const tName = ts.teams?.name?.toLowerCase() || '';
      return (
        tName === ranking.dbTeamName.toLowerCase() ||
        tName.includes(ranking.displayName.toLowerCase()) ||
        ranking.tmClubName.toLowerCase().includes(tName)
      );
    });

    const team = dbMatch?.teams;

    return {
      ranking,
      teamSeason: dbMatch,
      team,
      rank: ranking.rank,
      displayName: ranking.displayName,
      deltaStr: ranking.deltaStr,
      trend: ranking.trend,
      shortDisplayEur: ranking.shortDisplayEur,
      shortDisplayUSD: ranking.shortDisplayUSD,
      totalEur: ranking.currentValEur,
      totalUsd: dbMatch?.total_value_usd || Math.round(ranking.currentValEur * 1.0999),
      squadSize: dbMatch?.squad_size || 26,
      primaryColor: team?.primary_kit_color || (ranking.rank === 1 ? '#00A3E0' : '#800020'),
      shortsColor: team?.shorts_kit_color || '#FFFFFF',
    };
  });

  // Top 10 by default (as in user's image), or all 18 clubs
  const displayedItems = showAllTeams ? mergedList : mergedList.slice(0, 10);

  return (
    <div className="flex flex-col gap-6 select-none font-sans max-w-4xl mx-auto w-full">
      {/* Top Banner & Controls */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#17002e] via-[#090a36] to-[#010c2a] border border-blue-500/20 p-5 md:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Liga 1 Geometric Emblem */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-600 via-purple-600 to-blue-600 p-[2px] shadow-lg shadow-purple-950/60 flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full rounded-2xl bg-[#090b2c] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-xs font-black">▲</span>
                <span className="text-rose-400 text-xs font-black">▼</span>
                <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                  Valores de Mercado Oficiales • Liga 1 Apertura {currentYear}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-none mt-1">
                Equipos Más Valiosos de la Liga 1
              </h1>
            </div>
          </div>

          {/* Action Bar (Currency & Views) */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Currency Selector */}
            <div className="flex items-center bg-black/40 border border-blue-500/30 rounded-xl p-1 text-xs font-bold">
              <button
                onClick={() => setCurrencyMode('EUR')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  currencyMode === 'EUR'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                € EUR
              </button>
              <button
                onClick={() => setCurrencyMode('USD')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  currencyMode === 'USD'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                $ USD
              </button>
              <button
                onClick={() => setCurrencyMode('DUAL')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  currencyMode === 'DUAL'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dual
              </button>
            </div>

            {/* Toggle 10 vs 18 */}
            <button
              onClick={() => setShowAllTeams(!showAllTeams)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-950/60 transition cursor-pointer"
            >
              {showAllTeams ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Ver Top 10 (Diseño Oficial)
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Ver Todos los 18 Clubes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Broadcast Graphic Card Container (Matching Reference Image) */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-blue-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] w-full"
        style={{
          background:
            'linear-gradient(135deg, #1b003a 0%, #11053b 25%, #05144d 60%, #000d2b 100%)',
        }}
      >
        {/* Atmospheric Glow Highlights */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Header Titles (Exactly matching photo) */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1.5">
              {/* Liga 1 Badge Hexagon */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-fuchsia-600 to-purple-600 text-[11px] font-black tracking-widest text-white uppercase shadow">
                LIGA 1
              </div>
              <div className="flex items-center gap-1">
                <span className="text-emerald-400 text-sm font-black">▲</span>
                <span className="text-rose-400 text-sm font-black">▼</span>
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-none font-sans drop-shadow-md">
              CLUBES MÁS VALIOSOS
            </h2>
            <h3 className="text-lg md:text-2xl font-black text-sky-400 tracking-wider uppercase leading-snug font-sans mt-0.5">
              DE LA LIGA 1
            </h3>
          </div>

          {/* Column Label above values */}
          <div className="flex items-center justify-between px-4 pb-1 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            <span>POSICIÓN & CLUB</span>
            <span className="text-right">VALOR DE MERCADO</span>
          </div>

          {/* Club List Rows */}
          <div className="flex flex-col gap-2.5">
            {displayedItems.map((item) => {
              const isRankOne = item.rank === 1;
              const isHovered = hoveredClubRank === item.rank;

              return (
                <div
                  key={item.rank}
                  onMouseEnter={() => setHoveredClubRank(item.rank)}
                  onMouseLeave={() => setHoveredClubRank(null)}
                  onClick={() => {
                    if (item.team) onSelectTeamForRoster(item.team);
                  }}
                  className={`group relative flex items-center justify-between px-3 md:px-5 py-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                    isRankOne
                      ? 'bg-gradient-to-r from-[#0062ff] via-[#0052e0] to-[#0041bf] border-2 border-[#00d0ff] shadow-[0_4px_25px_rgba(0,132,255,0.45)] transform hover:scale-[1.01]'
                      : isHovered
                      ? 'bg-[#003899]/85 border border-sky-400 shadow-[0_4px_20px_rgba(0,100,255,0.25)] transform hover:scale-[1.008]'
                      : 'bg-[#002777]/60 hover:bg-[#003388]/80 border border-blue-500/25 hover:border-sky-400/50 backdrop-blur-md'
                  }`}
                >
                  {/* Left Section: Rank + TeamKitSquare3D + Team Name & Delta */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Rank Badge Box */}
                    <div
                      className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center font-black text-sm md:text-base flex-shrink-0 shadow-md ${
                        isRankOne
                          ? 'bg-[#0088ff] text-white border border-white/40'
                          : 'bg-black/40 text-white border border-white/10'
                      }`}
                    >
                      {item.rank}
                    </div>

                    {/* Square Kit Box ("la ficha cuadrada que creaste") */}
                    <TeamKitSquare3D
                      primaryColor={item.primaryColor}
                      shortsColor={item.shortsColor}
                      teamName={item.team?.name || item.displayName}
                      size="sm"
                      className="flex-shrink-0"
                    />

                    {/* Name & Variation Delta */}
                    <div className="min-w-0 flex flex-col justify-center">
                      <span className="text-sm md:text-base font-black tracking-wide text-white uppercase truncate group-hover:text-amber-200 transition">
                        {item.displayName}
                      </span>

                      <div className="flex items-center gap-2 text-[11px] font-bold">
                        {/* Delta text */}
                        <span
                          className={
                            item.trend === 'up'
                              ? 'text-emerald-300'
                              : item.trend === 'down'
                              ? 'text-rose-300'
                              : 'text-slate-300'
                          }
                        >
                          {item.deltaStr}
                        </span>

                        {/* Squad count */}
                        <span className="text-white/40 text-[10px] hidden sm:inline">
                          • {item.squadSize} jug.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Trend Arrow + Market Value Pill */}
                  <div className="flex items-center gap-3 md:gap-4 flex-shrink-0 pl-2">
                    {/* Trend Triangle Arrow */}
                    <div className="w-5 flex items-center justify-center flex-shrink-0">
                      {item.trend === 'up' && (
                        <span className="text-[#00E676] text-base md:text-lg font-black filter drop-shadow-[0_0_6px_rgba(0,230,118,0.7)] animate-pulse">
                          ▲
                        </span>
                      )}
                      {item.trend === 'down' && (
                        <span className="text-[#FF3366] text-base md:text-lg font-black filter drop-shadow-[0_0_6px_rgba(255,51,102,0.7)]">
                          ▼
                        </span>
                      )}
                      {item.trend === 'neutral' && (
                        <span className="text-slate-400 text-sm font-black">
                          ➖
                        </span>
                      )}
                    </div>

                    {/* Market Value Pill */}
                    <div className="text-right min-w-[75px] md:min-w-[95px]">
                      {currencyMode === 'EUR' && (
                        <span className="text-base md:text-xl font-black text-white tracking-tight drop-shadow-sm block">
                          {item.shortDisplayEur}
                        </span>
                      )}
                      {currencyMode === 'USD' && (
                        <span className="text-base md:text-xl font-black text-emerald-300 tracking-tight drop-shadow-sm block">
                          {item.shortDisplayUSD}
                        </span>
                      )}
                      {currencyMode === 'DUAL' && (
                        <div className="flex flex-col items-end leading-tight">
                          <span className="text-sm md:text-base font-black text-white">
                            {item.shortDisplayEur}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-300">
                            {item.shortDisplayUSD}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Clean Branding */}
        <div className="mt-8 pt-5 border-t border-blue-500/20 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-300 font-bold tracking-wider">
              LIGA 1 DEL FÚTBOL PERUANO • APERTURA {currentYear}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
            <span>Valores de mercado actualizados</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold">En Vivo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Team {
  id: string;
  name: string;
  slug: string;
  short_name: string;
  logo_url: string;
  primary_kit_color: string;
  shorts_kit_color: string;
  transfermarkt_url?: string;
  x_handle?: string;
  facebook_url?: string;
}

export interface TeamSeason {
  id: string;
  team_id: string;
  season_year: number;
  total_value_eur: number;
  total_value_usd: number;
  rank_value: number;
  squad_size: number;
  last_updated: string;
  teams?: Team;
}

export interface Player {
  id: string;
  full_name: string;
  slug: string;
  nationality: string;
  birth_date: string;
  primary_position: string;
  secondary_position?: string;
  photo_url?: string;
  transfermarkt_id?: string;
}

export interface PreviousClub {
  id: string;
  player_id: string;
  club_name: string;
  years: string;
  order_index: number;
}

export interface PlayerSeason {
  id: string;
  player_id: string;
  team_id: string;
  season_year: number;
  market_value_eur: number;
  market_value_usd: number;
  matches_played: number;
  jersey_number?: number;
  contract_start_date?: string;
  contract_end_date?: string;
  players?: Player;
  teams?: Team;
}

export interface TransferMovement {
  id: string;
  player_id: string;
  team_id: string;
  season_year: number;
  transfer_type: 'IN' | 'OUT';
  contract_start_date?: string;
  contract_end_date?: string;
  departure_reason?: string;
  other_club_name?: string;
  source_type: string;
  source_url?: string;
  announced_at: string;
  players?: Player;
  teams?: Team;
}

import type { Player } from '../types';
import squads from './squads.json';

const SQUADS: Record<string, Record<string, { names: string[], positions: string[][], ratings: number[] }>> = squads;

const flattenSquads = (): Player[] => {
  return Object.entries(SQUADS).flatMap(([decade, clubs]) => 
    Object.entries(clubs).flatMap(([club, squadData]) => 
      squadData.names.map((name, i) => ({
        id: `${decade}-${club}-${i}`,
        name: name,
        club: club,
        decade: decade as any,
        positions: squadData.positions[i] as any,
        rating: squadData.ratings[i]
      }))
    )
  );
};

export const PLAYERS: Player[] = flattenSquads();
export const CLUBS = Array.from(new Set(PLAYERS.map(p => p.club)));
export const DECADES: string[] = ['1990s', '2000s', '2010s', '2020s'];

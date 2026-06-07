import type { Player, MatchResult } from './types';

export class SimulationEngine {
  static calculateWinProbability(playerRating: number, opponentRating: number): number {
    // Basic ELO-like probability
    const diff = playerRating - opponentRating;
    return 1 / (1 + Math.pow(10, -diff / 20));
  }

  static simulateMatch(playerSquad: Player[], opponentName: string, opponentRating: number, stage: string): MatchResult {
    const playerAvgRating = playerSquad.reduce((acc, p) => acc + p.rating, 0) / playerSquad.length;
    
    // Remove home advantage - normalize probabilities
    const winProb = this.calculateWinProbability(playerAvgRating, opponentRating);
    
    // Simulate match
    const random = Math.random();
    let homeScore, awayScore, isPlayerWin;

    // Standard match logic (no home bias)
    const totalGoals = Math.floor(Math.random() * 4);
    if (random < winProb) {
        homeScore = Math.floor(Math.random() * (totalGoals + 1));
        awayScore = totalGoals - homeScore;
        isPlayerWin = homeScore > awayScore;
    } else {
        awayScore = Math.floor(Math.random() * (totalGoals + 1));
        homeScore = totalGoals - awayScore;
        isPlayerWin = homeScore > awayScore;
    }

    // Handle Draws in Knockouts
    if (homeScore === awayScore && stage !== 'League') {
        // Simple mock for Extra Time/Penalties result
        const drawResult = Math.random() > 0.5;
        if (drawResult) {
            homeScore += 1;
            isPlayerWin = true;
        } else {
            awayScore += 1;
            isPlayerWin = false;
        }
    }

    return {
      homeTeam: 'Your Team',
      awayTeam: opponentName,
      homeScore,
      awayScore,
      isPlayerWin,
      stage
    };
  }

  static getLeagueOpponent(matchIndex: number): { name: string; rating: number } {
    const opponents = [
      { name: 'Red Star Belgrade', rating: 78 },
      { name: 'Shakhtar Donetsk', rating: 80 },
      { name: 'Benfica', rating: 83 },
      { name: 'Borussia Dortmund', rating: 86 },
      { name: 'AC Milan', rating: 87 },
      { name: 'Arsenal', rating: 88 },
      { name: 'Liverpool', rating: 90 },
      { name: 'Real Madrid', rating: 92 },
    ];
    return opponents[matchIndex] || { name: 'Generic FC', rating: 85 };
  }
}

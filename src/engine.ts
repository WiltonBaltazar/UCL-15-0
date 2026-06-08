import type { Player, MatchResult, LeagueTableEntry } from './types';

export class SimulationEngine {
  static calculateStandings(results: MatchResult[]): LeagueTableEntry[] {
    const table: Record<string, LeagueTableEntry> = {};

    results.forEach((match) => {
      [match.homeTeam, match.awayTeam].forEach((team) => {
        if (!table[team]) {
          table[team] = {
            teamName: team,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
          };
        }
      });

      const home = table[match.homeTeam];
      const away = table[match.awayTeam];

      home.played++;
      away.played++;
      home.goalsFor += match.homeScore;
      home.goalsAgainst += match.awayScore;
      away.goalsFor += match.awayScore;
      away.goalsAgainst += match.homeScore;
      home.goalDifference = home.goalsFor - home.goalsAgainst;
      away.goalDifference = away.goalsFor - away.goalsAgainst;

      if (match.homeScore > match.awayScore) {
        home.won++;
        home.points += 3;
        away.lost++;
      } else if (match.homeScore < match.awayScore) {
        away.won++;
        away.points += 3;
        home.lost++;
      } else {
        home.drawn++;
        home.points += 1;
        away.drawn++;
        away.points += 1;
      }
    });

    return Object.values(table).sort(
      (a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor
    );
  }

  static simulateTwoLeggedTie(
    playerSquad: Player[],
    opponentName: string,
    opponentRating: number,
    playerHostSecondLeg: boolean,
    stage: string
  ): { results: MatchResult[]; isPlayerWin: boolean } {
    const leg1 = this.simulateMatch(
      playerSquad,
      opponentName,
      opponentRating,
      stage
    );
    const leg2 = this.simulateMatch(
      playerSquad,
      opponentName,
      opponentRating,
      stage
    );

    // Ensure correct hosting based on ranking
    const tieResults = playerHostSecondLeg
      ? [leg1, leg2] // Player hosted second
      : [leg2, leg1]; // Player hosted first

    const aggregatePlayerScore = tieResults.reduce((acc, match) => acc + (match.isPlayerWin ? match.homeScore : match.awayScore), 0);
    const aggregateOpponentScore = tieResults.reduce((acc, match) => acc + (match.isPlayerWin ? match.awayScore : match.homeScore), 0);

    let isPlayerWin = aggregatePlayerScore > aggregateOpponentScore;
    let penaltyOutcome: MatchResult['penaltyOutcome'] | undefined;

    // Handle Agg Draws: No away goals, go to ET/Penalties
    if (aggregatePlayerScore === aggregateOpponentScore) {
      const playerWinsPenalties = Math.random() > 0.5;
      isPlayerWin = playerWinsPenalties;
      
      // Simulate penalty scores
      const winnerPens = Math.floor(Math.random() * 3) + 3; // 3-5 pens
      const loserPens = winnerPens - (Math.floor(Math.random() * 2) + 1); // 1-2 difference
      
      penaltyOutcome = {
        playerWin: playerWinsPenalties,
        homePenalties: playerHostSecondLeg ? (playerWinsPenalties ? winnerPens : loserPens) : (playerWinsPenalties ? loserPens : winnerPens),
        awayPenalties: playerHostSecondLeg ? (playerWinsPenalties ? loserPens : winnerPens) : (playerWinsPenalties ? winnerPens : loserPens),
      };
    }

    // Add penalty outcome to the final match result object if it occurred
    if (penaltyOutcome) {
      tieResults[1].penaltyOutcome = penaltyOutcome;
    }

    return {
      results: tieResults,
      isPlayerWin,
    };
  }

  static getLeaguePhaseOutcome(standings: LeagueTableEntry[]): {
    topEight: LeagueTableEntry[];
    playOffs: LeagueTableEntry[];
    eliminated: LeagueTableEntry[];
  } {
    return {
      topEight: standings.slice(0, 8),
      playOffs: standings.slice(8, 24),
      eliminated: standings.slice(24),
    };
  }

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

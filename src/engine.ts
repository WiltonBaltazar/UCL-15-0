import type { Player, MatchResult, LeagueTableEntry } from './types';
import { PLAYERS, CLUBS } from './data/players';
import { FORMATIONS } from './data/formations';

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

  static simulateMatch(playerSquad: Player[], opponentName: string, opponentRating: number, stage: string, isPlayerHome: boolean): MatchResult {
    const playerAvgRating = (playerSquad.reduce((acc, p) => acc + (p?.rating || 0), 0) / 11) + (this.calculateChemistry(playerSquad) / 10);
    
    // Remove home advantage - normalize probabilities
    const winProb = this.calculateWinProbability(playerAvgRating, opponentRating);
    
    // Vary opponent formation
    const opponentFormation = FORMATIONS[Math.floor(Math.random() * FORMATIONS.length)].name;
    
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
      homeTeam: isPlayerHome ? 'Your Team' : opponentName,
      awayTeam: isPlayerHome ? opponentName : 'Your Team',
      homeScore,
      awayScore,
      isPlayerWin,
      stage,
      opponentFormation
    };
  }

  static simulateTwoLeggedTie(
    playerSquad: Player[],
    opponentName: string,
    opponentRating: number,
    playerHostSecondLeg: boolean,
    stage: string
  ): { results: MatchResult[]; isPlayerWin: boolean } {
    // First leg: player away if playerHostSecondLeg is true
    const leg1 = this.simulateMatch(playerSquad, opponentName, opponentRating, stage, !playerHostSecondLeg);
    // Second leg: player home
    const leg2 = this.simulateMatch(playerSquad, opponentName, opponentRating, stage, playerHostSecondLeg);

    const tieResults = [leg1, leg2];

    const aggregatePlayerScore = tieResults.reduce((acc, match) => {
        const playerIsHome = match.homeTeam === 'Your Team';
        return acc + (playerIsHome ? match.homeScore : match.awayScore);
    }, 0);
    
    const aggregateOpponentScore = tieResults.reduce((acc, match) => {
        const playerIsHome = match.homeTeam === 'Your Team';
        return acc + (playerIsHome ? match.awayScore : match.homeScore);
    }, 0);

    let isPlayerWin = aggregatePlayerScore > aggregateOpponentScore;
    let penaltyOutcome: MatchResult['penaltyOutcome'] | undefined;

    if (aggregatePlayerScore === aggregateOpponentScore) {
      const playerWinsPenalties = Math.random() > 0.5;
      isPlayerWin = playerWinsPenalties;
      
      const winnerPens = Math.floor(Math.random() * 3) + 3;
      const loserPens = winnerPens - (Math.floor(Math.random() * 2) + 1);
      
      penaltyOutcome = {
        playerWin: playerWinsPenalties,
        homePenalties: playerHostSecondLeg ? (playerWinsPenalties ? winnerPens : loserPens) : (playerWinsPenalties ? loserPens : winnerPens),
        awayPenalties: playerHostSecondLeg ? (playerWinsPenalties ? loserPens : winnerPens) : (playerWinsPenalties ? winnerPens : loserPens),
      };
    }

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
    const diff = playerRating - opponentRating;
    return 1 / (1 + Math.pow(10, -diff / 20));
  }

  static calculateChemistry(squad: Player[]): number {
    let chemistry = 0;
    for (let i = 0; i < squad.length; i++) {
      for (let j = i + 1; j < squad.length; j++) {
        if (squad[i] && squad[j]) {
          if (squad[i].club === squad[j].club) chemistry += 2;
          if (squad[i].decade === squad[j].decade) chemistry += 1;
        }
      }
    }
    return Math.min(chemistry, 50); // Cap bonus
  }

  static getLeagueOpponent(_matchIndex: number): { name: string; rating: number } {
    const club = CLUBS[Math.floor(Math.random() * CLUBS.length)];
    const clubPlayers = PLAYERS.filter(p => p.club === club);
    const avgRating = clubPlayers.reduce((acc, p) => acc + p.rating, 0) / clubPlayers.length;
    
    return { name: club, rating: Math.round(avgRating) };
  }
}

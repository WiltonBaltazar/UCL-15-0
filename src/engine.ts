import type { Player, MatchResult, LeagueTableEntry } from './types';
import { PLAYERS, CLUBS } from './data/players';
import { FORMATIONS } from './data/formations';
import modernOpponents from './data/modern_opponents.json';

const MODERN_OPPONENTS: { name: string; rating: number }[] = modernOpponents;

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
    let homeScore: number, awayScore: number, isPlayerWin: boolean;

    // More realistic goal distribution
    const goalRange = Math.random() < 0.1 ? 6 : Math.random() < 0.3 ? 4 : 3;
    const totalGoals = Math.floor(Math.random() * goalRange);
    
    if (random < winProb) {
        // Player wins the roll
        const pScore = Math.floor(Math.random() * 3) + 1;
        const oScore = Math.max(0, pScore - (Math.floor(Math.random() * 2)));
        
        if (isPlayerHome) {
            homeScore = pScore;
            awayScore = oScore;
        } else {
            homeScore = oScore;
            awayScore = pScore;
        }
    } else {
        // Opponent wins the roll
        const oScore = Math.floor(Math.random() * 3) + 1;
        const pScore = Math.max(0, oScore - (Math.floor(Math.random() * 2)));
        
        if (isPlayerHome) {
            homeScore = pScore;
            awayScore = oScore;
        } else {
            homeScore = oScore;
            awayScore = pScore;
        }
    }

    // Determine if it was actually a win (since scores can be equal)
    const playerActualScore = isPlayerHome ? homeScore : awayScore;
    const opponentActualScore = isPlayerHome ? awayScore : homeScore;
    isPlayerWin = playerActualScore > opponentActualScore;

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

    const homeScorers = isPlayerHome 
        ? this.pickScorers(playerSquad, homeScore)
        : this.pickOpponentScorers(opponentName, homeScore);
    
    const awayScorers = isPlayerHome
        ? this.pickOpponentScorers(opponentName, awayScore)
        : this.pickScorers(playerSquad, awayScore);

    return {
      homeTeam: isPlayerHome ? 'Your Team' : opponentName,
      awayTeam: isPlayerHome ? opponentName : 'Your Team',
      homeScore,
      awayScore,
      homeScorers,
      awayScorers,
      isPlayerWin,
      stage,
      opponentFormation
    };
  }

  static pickScorers(squad: Player[], goalCount: number): string[] {
    const scorers: string[] = [];
    const attackers = squad.filter(p => p && p.positions.some(pos => ['ST', 'CF', 'LW', 'RW', 'CAM', 'LM', 'RM'].includes(pos)));
    const others = squad.filter(p => p && !attackers.includes(p));

    for (let i = 0; i < goalCount; i++) {
        const rand = Math.random();
        if (rand < 0.8 && attackers.length > 0) {
            scorers.push(attackers[Math.floor(Math.random() * attackers.length)].name);
        } else if (others.length > 0) {
            const nonGK = others.filter(p => !p.positions.includes('GK'));
            if (nonGK.length > 0 && Math.random() < 0.98) {
                scorers.push(nonGK[Math.floor(Math.random() * nonGK.length)].name);
            } else {
                scorers.push(others[Math.floor(Math.random() * others.length)].name);
            }
        } else if (attackers.length > 0) {
             scorers.push(attackers[Math.floor(Math.random() * attackers.length)].name);
        }
    }
    return scorers;
  }

  static pickOpponentScorers(clubName: string, goalCount: number): string[] {
      const clubPlayers = PLAYERS.filter(p => p.club === clubName);
      if (clubPlayers.length === 0) return Array(goalCount).fill('Opponent Player');
      return this.pickScorers(clubPlayers, goalCount);
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
    // Softer curve (25 instead of 30) and a significant player bias (+5.0 rating boost)
    const biasedDiff = diff + 5.0;
    return 1 / (1 + Math.pow(10, -biasedDiff / 25));
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

  static getUniqueOpponents(count: number): { name: string; rating: number }[] {
    const historicOpponents = CLUBS.map(club => {
        const clubPlayers = PLAYERS.filter(p => p.club === club);
        const avgRating = clubPlayers.reduce((acc, p) => acc + (p?.rating || 0), 0) / clubPlayers.length;
        return { name: club, rating: Math.round(avgRating) };
    });

    const allPotential = [...historicOpponents, ...MODERN_OPPONENTS];
    const unique = Array.from(new Map(allPotential.map(o => [o.name, o])).values());
    
    // Pot System for Balance
    const pot1 = unique.filter(o => o.rating >= 89);
    const pot2 = unique.filter(o => o.rating >= 85 && o.rating < 89);
    const pot3 = unique.filter(o => o.rating >= 81 && o.rating < 85);
    const pot4 = unique.filter(o => o.rating < 81);

    const shuffle = (array: any[]) => [...array].sort(() => 0.5 - Math.random());

    if (count === 8) {
        // Return 2 from each pot
        return [
            ...shuffle(pot1).slice(0, 2),
            ...shuffle(pot2).slice(0, 2),
            ...shuffle(pot3).slice(0, 2),
            ...shuffle(pot4).slice(0, 2)
        ].sort(() => 0.5 - Math.random());
    }
    
    return unique.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  static getLeagueOpponent(_matchIndex: number): { name: string; rating: number } {
    const opponents = this.getUniqueOpponents(1);
    return opponents[0];
  }
}

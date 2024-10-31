// TODO: return fields that are of time numbers as numbers from the API and then change the types here also

export interface ClubInfo {
  id: string;
  name: string;
  regionId: number;
  teamId: number;
  bestDivision: string;
  gamesPlayed: string;
  leagueAppearances: string;
  gamesPlayedPlayoff: string;
  goals: string;
  goalsAgainst: string;
  promotions: string;
  relegations: string;
  wins: string;
  losses: string;
  ties: string;
  winStreak: string;
  skillRating: string;
}

export interface ApiResponse {
  clubs: ClubInfo[];
}

export interface ClubStats {
  totalGames: number,
  winPercentage: number,
  tiePercentage: number,
  lossPercentage: number,
  totalGoals: number,
  goalsScoredPercentage: number,
  goalsConcededPercentage: number,
  goalDifference: number,
  goalsScoredPerMatch: string,
  goalsConcededPerMatch: string,
}
  

  
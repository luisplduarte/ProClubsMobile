// TODO: return fields that are of type numbers as numbers from the API and then change the types here also

export interface SimplifiedClubInfo {
  clubId: string,
  name: string,
  regionId: number,
  teamId: number,
  platform: string
}

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
  isFavorite: boolean;
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
  

  
import { useMemo } from 'react';
import { ClubInfo as ClubInfoType, ClubStats } from '../types/ClubInfoTypes';

export const useClubStats = (clubData: ClubInfoType | undefined) => {
  const stats = useMemo(() => {
    if (!clubData) return null;

    const wins = parseInt(clubData.wins);
    const ties = parseInt(clubData.ties);
    const losses = parseInt(clubData.losses);
    const goals = parseInt(clubData.goals);
    const goalsAgainst = parseInt(clubData.goalsAgainst);

    const totalGames = wins + ties + losses;
    const totalGoals = goals + goalsAgainst;

   return {
      totalGames,
      winPercentage: (wins / totalGames) * 100,
      tiePercentage: (ties / totalGames) * 100,
      lossPercentage: (losses / totalGames) * 100,
      totalGoals,
      goalsScoredPercentage: (goals / totalGoals) * 100,
      goalsConcededPercentage: (goalsAgainst / totalGoals) * 100,
      goalDifference: goals - goalsAgainst,
      goalsScoredPerMatch: (goals / totalGames).toFixed(2),
      goalsConcededPerMatch: (goalsAgainst / totalGames).toFixed(2),
    } as ClubStats;
  }, [clubData]);

  return stats;
};

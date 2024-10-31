export interface Player {
    name: string,
    gamesPlayed: string,
    winRate: string,
    goals: string,
    assists: string,
    cleanSheetsDef: string,
    cleanSheetsGK: string,
    shotSuccessRate: string,
    passesMade: string,
    passSuccessRate: string,
    ratingAve: string,
    tacklesMade: string,
    tackleSuccessRate: string,
    proName: string,
    proPos: string,
    proStyle: string,
    proHeight: string,
    proNationality: string,
    proOverall: string,
    proOverallStr: string,
    manOfTheMatch: string,
    redCards: string,
    prevGoals: string,
    prevGoals1: string,
    prevGoals2: string,
    prevGoals3: string,
    prevGoals4: string,
    prevGoals5: string,
    prevGoals6: string,
    prevGoals7: string,
    prevGoals8: string,
    prevGoals9: string,
    prevGoals10: string,
    favoritePosition: string,
}

interface PositionCount {
    midfielder: number,
    goalkeeper: number,
    forward: number,
    defender: number
}

export interface ClubPlayersInfo {
    members: Player[],
    positionCount: PositionCount
}
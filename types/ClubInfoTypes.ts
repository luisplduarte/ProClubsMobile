export interface ClubInfo {
    clubId: string;
    name: string;
    regionId: string;
  }
  
  export interface ApiResponse {
    clubs: ClubInfo[];
  }
  
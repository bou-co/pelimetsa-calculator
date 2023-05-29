export interface EmissionsData {
  travel: number;
  personnel: number;
  players: GamingPlatform[];
  other: number;
}

export enum PlatformType {
  PC = 'pc',
  Console = 'console',
  Mobile = 'mobile',
}

export enum GameType {
  SinglePlayer = 'singlePlayer',
  MultiPlayer = 'multiPlayer',
}

export interface GamingPlatform {
  platformType: PlatformType;
  gameType: GameType;
  dailyActiveUsers?: number;
  purchasedGamesAmount?: number;
  averagePlayTime: number; // in hours for PC and console games
  sessionLength: number; // in minutes for mobile games
}

export interface EmissionResults {
  totalCarbonEmissionsPerYear: number;
  emissionPercentages: {
    personnel: number;
    travel: number;
    players: number;
    other: number;
  };
  donationSumInEuros: number;
  protectedForestAreaInHectares: number;
}

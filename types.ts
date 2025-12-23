
export enum Difficulty {
  EASY = '4x4',
  MEDIUM = '4x5',
  HARD = '6x6'
}

export interface CardItem {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface BestRecords {
  [Difficulty.EASY]: number | null;
  [Difficulty.MEDIUM]: number | null;
  [Difficulty.HARD]: number | null;
}

export interface LeaderboardEntry {
  name: string;
  time: number;
  steps: number;
  difficulty: string;
  timestamp?: number;
}

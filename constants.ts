
import { Difficulty } from './types';

export const SUSHI_ICONS = [
  '🍣', '🍤', '🍙', '🍱', '🥟', '🍵', '🥢', '🥣', 
  '🍘', '🍥', '🍢', '🍡', '🍛', '🍜', '🍲', '🥘', 
  '🍳', '🥩', '🍙', '🐡', '🦞', '🍱', '🥘', '🍤'
];

export const GRID_CONFIG = {
  [Difficulty.EASY]: { rows: 4, cols: 4, total: 16 },
  [Difficulty.MEDIUM]: { rows: 5, cols: 4, total: 20 },
  [Difficulty.HARD]: { rows: 6, cols: 6, total: 36 },
};

export const FLIP_DELAY = 1000; // ms

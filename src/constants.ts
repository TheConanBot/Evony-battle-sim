import { TroopAttributes } from './types';

export enum TroopType {
  Infantry = 'Infantry',
  Archers = 'Archers',
  Cavalry = 'Cavalry',
  Siege = 'Siege',
}

export const BATTLEFIELD_WIDTH = 1500;
export const GRID_SIZE = 50;

export const BASE_STATS: Record<TroopType, TroopAttributes> = {
  [TroopType.Infantry]: { attack: 10, defense: 15, hp: 100, speed: 350, range: 50 },
  [TroopType.Archers]: { attack: 15, defense: 8, hp: 80, speed: 100, range: 500 },
  [TroopType.Cavalry]: { attack: 20, defense: 10, hp: 90, speed: 300, range: 50 },
  [TroopType.Siege]: { attack: 30, defense: 5, hp: 70, speed: 75, range: 300 }, // T1 Siege range
};

export const BASE_BUFFS = {
  attack: 1000,
  defense: 1000,
  hp: 1000,
};

export const SIEGE_RANGES: Record<number, number> = {
  1: 300, 2: 350, 3: 400, 4: 450, 5: 500, 6: 550, 7: 600, 8: 650, 9: 700, 10: 750,
  11: 800, 12: 850, 13: 900, 14: 950, 15: 1000, 16: 1050,
};

export const TARGET_PRIORITY: Record<TroopType, TroopType[]> = {
  [TroopType.Infantry]: [TroopType.Archers, TroopType.Infantry, TroopType.Siege, TroopType.Cavalry],
  [TroopType.Archers]: [TroopType.Cavalry, TroopType.Archers, TroopType.Siege, TroopType.Infantry],
  [TroopType.Cavalry]: [TroopType.Infantry, TroopType.Cavalry, TroopType.Siege, TroopType.Archers],
  [TroopType.Siege]: [TroopType.Siege, TroopType.Archers, TroopType.Cavalry, TroopType.Infantry],
};

export const TROOP_BUFFS: Record<TroopType, Record<string, number[]>> = {
  [TroopType.Infantry]: {
    attack: [100, 140, 190, 260, 350, 470, 630, 850, 1150, 1550, 1940, 2425, 2910, 3570, 4230, 4920],
    defense: [300, 410, 550, 740, 1000, 1350, 1820, 2460, 3320, 4480, 5600, 7000, 8400, 10330, 11760, 13670],
    hp: [600, 810, 1090, 1470, 1980, 2670, 3600, 4860, 6560, 8860, 11080, 13850, 16620, 20440, 24260, 28240],
  },
  [TroopType.Archers]: {
    attack: [130, 180, 240, 320, 430, 580, 780, 1050, 1420, 1920, 2400, 3000, 3450, 4070, 4690, 5460],
    defense: [100, 140, 190, 260, 350, 470, 630, 850, 1150, 1550, 1940, 2425, 2780, 3280, 3780, 4390],
    hp: [250, 340, 460, 620, 840, 1130, 1530, 2070, 2790, 3770, 4720, 5900, 6780, 8000, 9220, 10730],
  },
  [TroopType.Cavalry]: {
    attack: [220, 300, 410, 550, 740, 1000, 1350, 1820, 2460, 3320, 4150, 5187, 5800, 6670, 7540, 8780],
    defense: [150, 200, 270, 360, 490, 660, 890, 1200, 1620, 2190, 2740, 3425, 3830, 4400, 4970, 5780],
    hp: [400, 540, 730, 990, 1340, 1810, 2440, 3290, 4440, 5990, 7490, 9362, 10480, 12050, 13620, 15850],
  },
  [TroopType.Siege]: {
    attack: [100, 140, 190, 260, 350, 470, 630, 850, 1150, 1550, 1940, 2425, 2780, 3280, 3780, 4400],
    defense: [50, 70, 90, 120, 160, 220, 300, 410, 550, 740, 930, 1162, 1330, 1560, 1790, 2080],
    hp: [100, 140, 190, 260, 350, 470, 630, 850, 1150, 1550, 1940, 2425, 2780, 3280, 3780, 4400],
  },
};
import { TroopType } from './constants';

export interface TroopAttributes {
  attack: number;
  defense: number;
  hp: number;
  speed: number;
  range: number;
}

export interface Troop {
  type: TroopType;
  tier: number;
  quantity: number;
  attributes: TroopAttributes;
  position: number;
}

export interface Army {
  troops: Troop[];
  buffs: {
    attack: number;
    defense: number;
    hp: number;
  };
}

export interface BattleState {
  army1: Army;
  army2: Army;
  round: number;
  battleLog: string[];
  battlefieldWidth: number;
}
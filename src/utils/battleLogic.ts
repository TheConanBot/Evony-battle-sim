import { Troop, Army, BattleState } from '../types';
import { BASE_STATS, BATTLEFIELD_WIDTH, TroopType, TARGET_PRIORITY, SIEGE_RANGES, GRID_SIZE, TROOP_BUFFS } from '../constants';

const moveTroops = (troops: Troop[], enemyTroops: Troop[], isDefender: boolean): Troop[] => {
  return troops.map(troop => {
    const closestEnemy = findClosestEnemy(troop, enemyTroops);
    if (closestEnemy) {
      const distance = Math.abs(troop.position - closestEnemy.position);
      if (distance > troop.attributes.range) {
        const moveDistance = Math.min(troop.attributes.speed, distance - troop.attributes.range);
        const newPosition = isDefender
          ? Math.min(troop.position + moveDistance, BATTLEFIELD_WIDTH)
          : Math.max(troop.position - moveDistance, 0);
        return { ...troop, position: newPosition };
      }
    }
    return troop;
  });
};

const findClosestEnemy = (troop: Troop, enemyTroops: Troop[]): Troop | null => {
  return enemyTroops.reduce((closest, enemy) => {
    const distance = Math.abs(troop.position - enemy.position);
    if (!closest || distance < Math.abs(troop.position - closest.position)) {
      return enemy;
    }
    return closest;
  }, null as Troop | null);
};

export const initializeBattle = (army1: Army, army2: Army): BattleState => {
  return {
    army1: {
      ...army1,
      troops: army1.troops.map(troop => ({ ...troop, position: 0 }))
    },
    army2: {
      ...army2,
      troops: army2.troops.map(troop => ({ ...troop, position: BATTLEFIELD_WIDTH }))
    },
    round: 0,
    battleLog: [],
    battlefieldWidth: BATTLEFIELD_WIDTH
  };
};

export const isBattleOver = (state: BattleState): boolean => {
  return state.army1.troops.length === 0 || state.army2.troops.length === 0;
};

export const simulateRound = (state: BattleState): BattleState => {
  const newState = { ...state, round: state.round + 1 };
  const log: string[] = [];

  // Move troops
  newState.army1.troops = moveTroops(newState.army1.troops, newState.army2.troops, true);
  newState.army2.troops = moveTroops(newState.army2.troops, newState.army1.troops, false);

  // Simulate combat
  const [updatedArmy1, updatedArmy2, army1Log] = simulateCombat(newState.army1.troops, newState.army2.troops, true);
  const [updatedArmy2Final, updatedArmy1Final, army2Log] = simulateCombat(updatedArmy2, updatedArmy1, false);

  newState.army1.troops = updatedArmy1Final.filter(troop => troop.quantity > 0);
  newState.army2.troops = updatedArmy2Final.filter(troop => troop.quantity > 0);

  newState.battleLog = [...state.battleLog, ...army1Log, ...army2Log];
  return newState;
};

const simulateCombat = (attackingTroops: Troop[], defendingTroops: Troop[], isDefender: boolean): [Troop[], Troop[], string[]] => {
  const updatedAttackingTroops = [...attackingTroops];
  const updatedDefendingTroops = [...defendingTroops];
  const battleLog: string[] = [];

  updatedAttackingTroops.forEach(attacker => {
    const target = findTarget(attacker, updatedDefendingTroops);
    if (target) {
      const damage = calculateDamage(attacker, target);
      const killed = Math.min(target.quantity, Math.floor(damage / target.attributes.hp));
      target.quantity -= killed;
      battleLog.push(`${attacker.type} T${attacker.tier} killed ${killed} ${target.type} T${target.tier}`);
    }
  });

  return [updatedAttackingTroops, updatedDefendingTroops, battleLog];
};

const findTarget = (attacker: Troop, defenders: Troop[]): Troop | null => {
  const inRangeDefenders = defenders.filter(
    defender => Math.abs(attacker.position - defender.position) <= attacker.attributes.range
  );

  if (inRangeDefenders.length === 0) return null;

  const priorityOrder = TARGET_PRIORITY[attacker.type];
  for (const targetType of priorityOrder) {
    const target = inRangeDefenders.find(defender => defender.type === targetType);
    if (target) return target;
  }

  return inRangeDefenders[0];
};

const calculateDamage = (attacker: Troop, defender: Troop): number => {
  const attackPower = attacker.attributes.attack * attacker.quantity;
  const defensePower = defender.attributes.defense;
  return Math.max(1, Math.floor(attackPower / defensePower));
};

export { moveTroops, findClosestEnemy, simulateCombat, findTarget, calculateDamage };
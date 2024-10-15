import React from 'react';
import { BattleState, Troop } from '../types';
import { TroopType, BATTLEFIELD_WIDTH, GRID_SIZE } from '../constants';
import { Sword, Target, Bike, Castle } from 'lucide-react';

interface BattlefieldProps {
  battleState: BattleState;
}

const TroopIcons: Record<TroopType, React.ReactNode> = {
  [TroopType.Infantry]: <Sword size={16} />,
  [TroopType.Archers]: <Target size={16} />,
  [TroopType.Cavalry]: <Bike size={16} />,
  [TroopType.Siege]: <Castle size={16} />,
};

const Battlefield: React.FC<BattlefieldProps> = ({ battleState }) => {
  const { army1: defender, army2: attacker } = battleState;

  const renderTroopGroup = (troops: Troop[], isDefender: boolean) => {
    const groupedTroops = troops.reduce((acc, troop) => {
      if (!acc[troop.type]) {
        acc[troop.type] = { ...troop, totalQuantity: troop.quantity };
      } else {
        acc[troop.type].totalQuantity += troop.quantity;
        acc[troop.type].position = Math.round((acc[troop.type].position + troop.position) / 2);
      }
      return acc;
    }, {} as Record<TroopType, Troop & { totalQuantity: number }>);

    return Object.values(groupedTroops).map((troop, index) => {
      const position = troop.position;
      const color = isDefender ? 'bg-blue-500' : 'bg-red-500';
      const label = `${troop.type} (${troop.totalQuantity})`;

      return (
        <div
          key={`${troop.type}-${isDefender ? 'defender' : 'attacker'}`}
          className={`absolute ${color} text-white px-2 py-1 rounded text-sm flex items-center`}
          style={{
            left: `${(position / BATTLEFIELD_WIDTH) * 100}%`,
            top: `${25 * index}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {TroopIcons[troop.type]}
          <span className="ml-1">{label}</span>
          <div
            className={`absolute h-1 ${isDefender ? 'bg-blue-300' : 'bg-red-300'}`}
            style={{
              width: `${(troop.attributes.range / BATTLEFIELD_WIDTH) * 100}%`,
              left: isDefender ? '100%' : 'auto',
              right: isDefender ? 'auto' : '100%',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          ></div>
        </div>
      );
    });
  };

  const renderGrid = () => {
    const gridLines = [];
    for (let i = GRID_SIZE; i < BATTLEFIELD_WIDTH; i += GRID_SIZE) {
      gridLines.push(
        <div
          key={`grid-${i}`}
          className="absolute h-full w-px bg-gray-300"
          style={{ left: `${(i / BATTLEFIELD_WIDTH) * 100}%` }}
        />
      );
    }
    return gridLines;
  };

  const renderMeasurements = () => {
    const measurements = [];
    for (let i = 0; i <= BATTLEFIELD_WIDTH; i += GRID_SIZE * 2) {
      measurements.push(
        <div
          key={`measure-${i}`}
          className="absolute text-xs text-gray-600"
          style={{
            left: `${(i / BATTLEFIELD_WIDTH) * 100}%`,
            bottom: '0',
            transform: 'translateX(-50%)',
          }}
        >
          {i}
        </div>
      );
    }
    return measurements;
  };

  return (
    <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
      {renderGrid()}
      {renderMeasurements()}
      <div className="absolute top-0 left-0 p-2 font-bold">Defender</div>
      <div className="absolute top-0 right-0 p-2 font-bold">Attacker</div>
      {renderTroopGroup(defender.troops, true)}
      {renderTroopGroup(attacker.troops, false)}
    </div>
  );
};

export default Battlefield;
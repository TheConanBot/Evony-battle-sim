import React from 'react';
import { TroopType, TARGET_PRIORITY, BASE_STATS, SIEGE_RANGES } from '../constants';

const BattleDataTable: React.FC = () => {
  const troopTypes = Object.values(TroopType);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Targeting Priorities</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Troop Type</th>
              <th className="border border-gray-300 px-4 py-2">Priority 1</th>
              <th className="border border-gray-300 px-4 py-2">Priority 2</th>
              <th className="border border-gray-300 px-4 py-2">Priority 3</th>
              <th className="border border-gray-300 px-4 py-2">Priority 4</th>
            </tr>
          </thead>
          <tbody>
            {troopTypes.map((type) => (
              <tr key={type}>
                <td className="border border-gray-300 px-4 py-2 font-bold">{type}</td>
                {TARGET_PRIORITY[type].map((priority, index) => (
                  <td key={index} className="border border-gray-300 px-4 py-2">
                    {priority}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Troop Stats</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Troop Type</th>
              <th className="border border-gray-300 px-4 py-2">Speed</th>
              <th className="border border-gray-300 px-4 py-2">Range</th>
            </tr>
          </thead>
          <tbody>
            {troopTypes.map((type) => (
              <tr key={type}>
                <td className="border border-gray-300 px-4 py-2 font-bold">{type}</td>
                <td className="border border-gray-300 px-4 py-2">{BASE_STATS[type].speed}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {type === TroopType.Siege ? 'Variable (see below)' : BASE_STATS[type].range}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Siege Range by Tier</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Tier</th>
              <th className="border border-gray-300 px-4 py-2">Range</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(SIEGE_RANGES).map(([tier, range]) => (
              <tr key={tier}>
                <td className="border border-gray-300 px-4 py-2 font-bold">T{tier}</td>
                <td className="border border-gray-300 px-4 py-2">{range}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BattleDataTable;
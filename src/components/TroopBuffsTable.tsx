import React from 'react';
import { TROOP_BUFFS, TroopType } from '../constants';

const TroopBuffsTable: React.FC = () => {
  const troopTypes = Object.keys(TROOP_BUFFS) as TroopType[];
  const attributes = ['attack', 'defense', 'hp'];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Tier</th>
            {troopTypes.map((type) => (
              <React.Fragment key={type}>
                {attributes.map((attr) => (
                  <th key={`${type}-${attr}`} className="border border-gray-300 px-4 py-2">
                    {type} {attr}
                  </th>
                ))}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(16)].map((_, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2 font-bold">T{index + 1}</td>
              {troopTypes.map((type) => (
                <React.Fragment key={type}>
                  {attributes.map((attr) => (
                    <td key={`${type}-${attr}`} className="border border-gray-300 px-4 py-2 text-right">
                      {TROOP_BUFFS[type][attr][index].toLocaleString()}
                    </td>
                  ))}
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TroopBuffsTable;
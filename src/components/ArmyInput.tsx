import React, { useState, useEffect } from 'react';
import { Army, Troop } from '../types';
import { BASE_STATS, TroopType, BASE_BUFFS, TROOP_BUFFS } from '../constants';

interface ArmyInputProps {
  onSubmit: (army: Army) => void;
  label: string;
}

interface TroopEntry {
  type: TroopType;
  tier: number;
  quantity: number;
}

const ArmyInput: React.FC<ArmyInputProps> = ({ onSubmit, label }) => {
  const [troopEntries, setTroopEntries] = useState<TroopEntry[]>([]);
  const [buffs, setBuffs] = useState(BASE_BUFFS);
  const [fillAllQuantity, setFillAllQuantity] = useState<number>(1000);
  const [fillTypeQuantities, setFillTypeQuantities] = useState<Record<TroopType, number>>({
    [TroopType.Infantry]: 1000,
    [TroopType.Archers]: 1000,
    [TroopType.Cavalry]: 1000,
    [TroopType.Siege]: 1000,
  });

  useEffect(() => {
    const initialTroopEntries: TroopEntry[] = [];
    Object.values(TroopType).forEach(type => {
      for (let tier = 1; tier <= 16; tier++) {
        initialTroopEntries.push({ type, tier, quantity: 1000 });
      }
    });
    setTroopEntries(initialTroopEntries);
  }, []);

  const handleTroopInputChange = (index: number, value: number) => {
    const updatedEntries = [...troopEntries];
    updatedEntries[index].quantity = value;
    setTroopEntries(updatedEntries);
  };

  const handleBuffInputChange = (buffType: keyof typeof buffs, value: number) => {
    setBuffs(prev => ({ ...prev, [buffType]: value }));
  };

  const handleFillAll = () => {
    const updatedEntries = troopEntries.map(entry => ({ ...entry, quantity: fillAllQuantity }));
    setTroopEntries(updatedEntries);
  };

  const handleFillType = (type: TroopType) => {
    const updatedEntries = troopEntries.map(entry =>
      entry.type === type ? { ...entry, quantity: fillTypeQuantities[type] } : entry
    );
    setTroopEntries(updatedEntries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const army: Army = {
      troops: troopEntries.map(entry => ({
        type: entry.type,
        tier: entry.tier,
        quantity: entry.quantity,
        attributes: {
          ...BASE_STATS[entry.type],
          attack: TROOP_BUFFS[entry.type].attack[entry.tier - 1],
          defense: TROOP_BUFFS[entry.type].defense[entry.tier - 1],
          hp: TROOP_BUFFS[entry.type].hp[entry.tier - 1],
        },
        position: 0,
      })),
      buffs,
    };
    onSubmit(army);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">{label}</h2>
      <div className="mb-4 flex items-center space-x-2">
        <input
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          min="0"
          value={fillAllQuantity}
          onChange={(e) => setFillAllQuantity(parseInt(e.target.value) || 0)}
          placeholder="Fill all quantities"
        />
        <button
          type="button"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleFillAll}
        >
          Fill All
        </button>
      </div>
      {Object.values(TroopType).map(type => (
        <div key={type} className="mb-4 flex items-center space-x-2">
          <input
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            min="0"
            value={fillTypeQuantities[type]}
            onChange={(e) => setFillTypeQuantities(prev => ({ ...prev, [type]: parseInt(e.target.value) || 0 }))}
            placeholder={`Fill ${type} quantities`}
          />
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleFillType(type)}
          >
            Fill {type}
          </button>
        </div>
      ))}
      <div className="grid grid-cols-4 gap-4">
        {troopEntries.map((entry, index) => (
          <div key={`${entry.type}-${entry.tier}`} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`${entry.type}-${entry.tier}-input`}>
              {`${entry.type} T${entry.tier}`}:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={`${entry.type}-${entry.tier}-input`}
              type="number"
              min="0"
              value={entry.quantity}
              onChange={(e) => handleTroopInputChange(index, parseInt(e.target.value) || 0)}
            />
          </div>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Buffs</h3>
        {Object.entries(buffs).map(([buffType, value]) => (
          <div key={buffType} className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`${buffType}-buff`}>
              {buffType.charAt(0).toUpperCase() + buffType.slice(1)}:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={`${buffType}-buff`}
              type="number"
              min="0"
              value={value}
              onChange={(e) => handleBuffInputChange(buffType as keyof typeof buffs, parseInt(e.target.value) || 0)}
            />
          </div>
        ))}
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Submit Army
      </button>
    </form>
  );
};

export default ArmyInput;
import React, { useState } from 'react';
import { Army, BattleState } from '../types';
import { initializeBattle, simulateRound, isBattleOver } from '../utils/battleLogic';
import ArmyInput from './ArmyInput';
import Battlefield from './Battlefield';
import TroopBuffsTable from './TroopBuffsTable';
import BattleDataTable from './BattleDataTable';
import { TroopType } from '../constants';
import { Sword, Target, Bike, Castle } from 'lucide-react';

const TroopIcons: Record<TroopType, React.ReactNode> = {
  [TroopType.Infantry]: <Sword size={16} />,
  [TroopType.Archers]: <Target size={16} />,
  [TroopType.Cavalry]: <Bike size={16} />,
  [TroopType.Siege]: <Castle size={16} />,
};

const BattleSimulator: React.FC = () => {
  const [battleStates, setBattleStates] = useState<BattleState[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [defenderArmy, setDefenderArmy] = useState<Army | null>(null);
  const [attackerArmy, setAttackerArmy] = useState<Army | null>(null);
  const [activeTab, setActiveTab] = useState<'simulator' | 'buffs' | 'data'>('simulator');

  const handleStartBattle = () => {
    if (defenderArmy && attackerArmy) {
      const initialState = initializeBattle(defenderArmy, attackerArmy);
      setBattleStates([initialState]);
      setCurrentRound(0);
    }
  };

  const handleNextRound = () => {
    if (battleStates.length > 0 && !isBattleOver(battleStates[battleStates.length - 1])) {
      const nextState = simulateRound(battleStates[battleStates.length - 1]);
      setBattleStates([...battleStates, nextState]);
      setCurrentRound(battleStates.length);
    }
  };

  const handlePreviousRound = () => {
    if (currentRound > 0) {
      setCurrentRound(currentRound - 1);
    }
  };

  const handleRoundTabClick = (round: number) => {
    setCurrentRound(round);
  };

  const renderBattleOutcome = () => {
    const currentState = battleStates[currentRound];
    if (isBattleOver(currentState)) {
      const defenderWon = currentState.army2.troops.length === 0;
      return (
        <div className="text-center font-bold text-2xl mt-4">
          {defenderWon ? "Defender Won!" : "Attacker Won!"}
        </div>
      );
    }
    return null;
  };

  const renderBattleLog = (log: string) => {
    const troopTypes = Object.values(TroopType);
    let renderedLog = log;

    troopTypes.forEach((type) => {
      const icon = TroopIcons[type];
      renderedLog = renderedLog.replace(
        new RegExp(`\\b${type}\\b`, 'g'),
        `${React.createElement('span', { className: 'inline-block align-middle mr-1' }, icon)}${type}`
      );
    });

    return <span dangerouslySetInnerHTML={{ __html: renderedLog }} />;
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Battle Simulator</h1>
      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 ${
            activeTab === 'simulator' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('simulator')}
        >
          Battle Simulator
        </button>
        <button
          className={`px-4 py-2 mr-2 ${
            activeTab === 'buffs' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('buffs')}
        >
          Troop Buffs
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'data' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('data')}
        >
          Battle Data
        </button>
      </div>
      {activeTab === 'simulator' ? (
        battleStates.length === 0 ? (
          <div>
            <div className="flex space-x-4">
              <ArmyInput onSubmit={setDefenderArmy} label="Defender" />
              <ArmyInput onSubmit={setAttackerArmy} label="Attacker" />
            </div>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleStartBattle}
              disabled={!defenderArmy || !attackerArmy}
            >
              Start Battle
            </button>
          </div>
        ) : (
          <div>
            <div className="flex mb-2 overflow-x-auto">
              {battleStates.map((_, index) => (
                <button
                  key={index}
                  className={`px-2 py-1 mr-1 text-sm ${
                    currentRound === index ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => handleRoundTabClick(index)}
                >
                  Round {index}
                </button>
              ))}
            </div>
            <div className="text-center font-bold text-xl mb-2">Round: {currentRound}</div>
            <Battlefield battleState={battleStates[currentRound]} />
            {renderBattleOutcome()}
            <div className="flex justify-center mt-4 space-x-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handlePreviousRound}
                disabled={currentRound === 0}
              >
                Previous Round
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleNextRound}
                disabled={isBattleOver(battleStates[battleStates.length - 1])}
              >
                Next Round
              </button>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold">Battle Log:</h2>
              <ul className="list-disc list-inside">
                {battleStates[currentRound].battleLog.map((log, index) => (
                  <li key={index}>{renderBattleLog(log)}</li>
                ))}
              </ul>
            </div>
          </div>
        )
      ) : activeTab === 'buffs' ? (
        <TroopBuffsTable />
      ) : (
        <BattleDataTable />
      )}
    </div>
  );
};

export default BattleSimulator;
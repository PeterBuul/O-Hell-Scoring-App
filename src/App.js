import React, { useState, useMemo } from 'react';

// --- Helper Components ---

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// New component for the Joker card icon
const JokerIcon = ({ className }) => (
    <svg className={`w-12 h-16 ${className}`} viewBox="0 0 80 112" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="76" height="108" rx="8" fill="white" stroke="black" strokeWidth="4"/>
        <path d="M24 32C24 24 32 20 40 20C48 20 56 24 56 32V40C56 48 48 56 40 56C32 56 24 48 24 40V32Z" fill="#FFD700"/>
        <circle cx="34" cy="32" r="3" fill="black"/>
        <circle cx="46" cy="32" r="3" fill="black"/>
        <path d="M32 46C34 50 46 50 48 46" stroke="black" strokeWidth="3" strokeLinecap="round"/>
        <path d="M10 12L14 12M10 16L14 16" stroke="red" strokeWidth="3" strokeLinecap="round" />
        <path d="M70 100L66 100M70 96L66 96" stroke="red" strokeWidth="3" strokeLinecap="round" />
        <text x="12" y="100" fontFamily="Arial, sans-serif" fontSize="16" fill="red" transform="rotate(180 12 100)">J</text>
        <text x="68" y="12" fontFamily="Arial, sans-serif" fontSize="16" fill="red">J</text>
    </svg>
);


// --- Main Application Component ---

const App = () => {
  // --- State Management ---

  const [players, setPlayers] = useState(Array(6).fill(''));
  const [scores, setScores] = useState(Array(6).fill(null).map(() => []));
  const [bids, setBids] = useState(Array(6).fill(0));
  const [currentRound, setCurrentRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [startingCards, setStartingCards] = useState(12);

  // --- Game Logic ---

  const roundsSequence = useMemo(() => {
    const start = Number(startingCards);
    if (isNaN(start) || start < 8 || start > 15) return [];
    const down = Array.from({ length: start }, (_, i) => start - i);
    const up = Array.from({ length: start }, (_, i) => i + 1);
    return [...down, ...up];
  }, [startingCards]);

  const totalRounds = roundsSequence.length;
  const cardsInRound = roundsSequence[currentRound - 1];
  const isSetupLocked = currentRound > 1;

  // --- Event Handlers ---

  const handlePlayerNameChange = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const handleBidChange = (index, bid) => {
    const newBids = [...bids];
    newBids[index] = Math.max(0, parseInt(bid, 10) || 0);
    setBids(newBids);
  };

  const recordRoundResult = (playerIndex, madeBid) => {
    if (isGameOver) return;
    const newScores = scores.map(s => [...s]);
    const currentBid = bids[playerIndex];
    let roundScore = 0;
    if (madeBid) {
      roundScore = 10 + currentBid;
    }
    if (newScores[playerIndex].length < currentRound) {
        newScores[playerIndex][currentRound - 1] = roundScore;
        setScores(newScores);
    }
  };

  const handleNextRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      setBids(Array(6).fill(0));
    } else {
      setIsGameOver(true);
    }
  };

  const handleNewGame = () => {
    setPlayers(Array(6).fill(''));
    setScores(Array(6).fill(null).map(() => []));
    setBids(Array(6).fill(0));
    setCurrentRound(1);
    setIsGameOver(false);
    setStartingCards(12);
  };

  const calculateTotalScore = (playerIndex) => {
    return scores[playerIndex].reduce((total, score) => total + (score || 0), 0);
  };

  // --- Render Method ---

  return (
    <div className="bg-green-800 text-white min-h-screen font-sans p-4 sm:p-6 lg:p-8" style={{backgroundColor: '#166534'}}>
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 flex justify-center items-center gap-4">
          <JokerIcon className="-rotate-12" />
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-yellow-300 tracking-wider" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>O'Hell Scorer</h1>
            <p className="text-gray-200 mt-2">Track bids and scores with ease.</p>
          </div>
          <JokerIcon className="rotate-12" />
        </header>

        {/* Player & Game Setup */}
        <div className="bg-green-900 bg-opacity-75 p-6 rounded-2xl shadow-lg mb-8 border-2 border-yellow-400">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-200 border-b-2 border-yellow-400 border-opacity-50 pb-2">Game Setup</h2>
          
          <div className="mb-6">
            <label htmlFor="starting-cards" className="block text-lg font-medium text-gray-100 mb-2">
              Starting Number of Cards:
            </label>
            <select
              id="starting-cards"
              value={startingCards}
              onChange={(e) => setStartingCards(parseInt(e.target.value, 10))}
              disabled={isSetupLocked}
              className="w-full max-w-xs bg-green-800 border border-yellow-400 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {Array.from({ length: 8 }, (_, i) => i + 8).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            {isSetupLocked && <p className="text-sm text-gray-300 mt-2">Game settings are locked after the first round begins.</p>}
          </div>

          <h3 className="text-xl font-semibold mb-4 text-yellow-200">Players</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {players.map((name, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor={`player-${index}`}>
                  Player {index + 1}
                </label>
                <input
                  id={`player-${index}`}
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  disabled={isSetupLocked}
                  className="w-full bg-green-800 border border-yellow-400 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            ))}
          </div>
        </div>

        {!isGameOver ? (
          <div className="bg-green-900 bg-opacity-75 p-6 rounded-2xl shadow-lg mb-8 border-2 border-yellow-400">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-yellow-200">
                Round {currentRound} <span className="text-gray-200 text-lg">({cardsInRound} Cards)</span>
              </h2>
              <button
                onClick={handleNextRound}
                className="bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                {currentRound === totalRounds ? 'Finish Game' : 'Next Round'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player, index) => (
                player && (
                  <div key={index} className="bg-green-800 bg-opacity-75 p-4 rounded-xl border border-yellow-400 border-opacity-50">
                    <h3 className="text-xl font-bold text-white truncate">{player}</h3>
                    <div className="flex items-center gap-4 mt-3">
                      <label htmlFor={`bid-${index}`} className="font-medium text-gray-100">Bid:</label>
                      <input
                        id={`bid-${index}`}
                        type="number"
                        min="0"
                        max={cardsInRound}
                        value={bids[index]}
                        onChange={(e) => handleBidChange(index, e.target.value)}
                        className="w-20 bg-green-900 border border-yellow-400 rounded-lg px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      />
                    </div>
                    <div className="mt-4">
                      <p className="font-medium text-gray-100 mb-2">Did they make it?</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => recordRoundResult(index, true)}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={scores[index][currentRound - 1] !== undefined}
                        >
                          <CheckIcon /> Yes
                        </button>
                        <button
                          onClick={() => recordRoundResult(index, false)}
                          className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={scores[index][currentRound - 1] !== undefined}
                        >
                          <XIcon /> No
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-green-900 bg-opacity-75 p-8 rounded-2xl shadow-lg text-center border-2 border-yellow-400">
            <h2 className="text-4xl font-bold text-yellow-300 mb-4">Game Over!</h2>
            <p className="text-gray-100 mb-6">Here are the final scores.</p>
            <button
              onClick={handleNewGame}
              className="bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 text-lg"
            >
              Start New Game
            </button>
          </div>
        )}

        <div className="bg-green-900 bg-opacity-75 p-6 rounded-2xl shadow-lg overflow-x-auto border-2 border-yellow-400">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-200 border-b-2 border-yellow-400 border-opacity-50 pb-2">Scoreboard</h2>
          <table className="w-full min-w-max text-left">
            <thead>
              <tr className="border-b border-yellow-400 border-opacity-50">
                <th className="p-3 font-semibold text-gray-100 sticky left-0 bg-green-900">Player</th>
                {roundsSequence.map((cards, index) => (
                  <th key={index} className={`p-3 text-center font-semibold text-gray-200 ${index + 1 === currentRound && !isGameOver ? 'bg-yellow-500 bg-opacity-25 rounded-t-lg' : ''}`}>
                    R{index + 1} <span className="text-xs">({cards})</span>
                  </th>
                ))}
                <th className="p-3 text-right font-semibold text-yellow-300 text-lg sticky right-0 bg-green-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, pIndex) => (
                player && (
                  <tr key={pIndex} className="border-b border-yellow-400 border-opacity-30 last:border-b-0">
                    <td className="p-3 font-bold text-lg truncate sticky left-0 bg-green-900" style={{maxWidth: '150px'}}>{player}</td>
                    {roundsSequence.map((_, rIndex) => (
                      <td key={rIndex} className={`p-3 text-center ${rIndex + 1 === currentRound && !isGameOver ? 'bg-yellow-500 bg-opacity-10' : ''}`}>
                        {scores[pIndex][rIndex] !== undefined ? scores[pIndex][rIndex] : '-'}
                      </td>
                    ))}
                    <td className="p-3 text-right font-bold text-yellow-300 text-xl sticky right-0 bg-green-900">
                      {calculateTotalScore(pIndex)}
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;

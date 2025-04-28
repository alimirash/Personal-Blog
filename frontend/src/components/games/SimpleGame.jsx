import React, { useState, useContext, useEffect } from 'react';
import { WalletContext } from '../../context/WalletContext';
import axios from 'axios';

const SimpleGame = () => {
  const { isConnected, recordGameScore } = useContext(WalletContext);
  const [gameId, setGameId] = useState(null);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [highScores, setHighScores] = useState([]);
  
  // Fetch game ID on component mount
  useEffect(() => {
    const fetchGameId = async () => {
      try {
        // Get the 'Click Game' entry or create it if it doesn't exist
        const response = await axios.get('/api/games?name=Click Game');
        if (response.data.length > 0) {
          setGameId(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching game:', error);
      }
    };
    
    fetchGameId();
  }, []);
  
  // Timer logic
  useEffect(() => {
    let timerId;
    if (gameActive && timeLeft > 0) {
      timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
    
    return () => clearTimeout(timerId);
  }, [gameActive, timeLeft]);
  
  // Fetch leaderboard
  useEffect(() => {
    if (gameId) {
      fetchLeaderboard();
    }
  }, [gameId]);
  
  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`/api/game-history/leaderboard/?game_id=${gameId}`);
      setHighScores(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };
  
  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(10);
  };
  
  const endGame = async () => {
    setGameActive(false);
    
    if (isConnected && gameId) {
      // Record the score
      await recordGameScore(gameId, score);
      // Update leaderboard
      fetchLeaderboard();
    }
  };
  
  const incrementScore = () => {
    if (gameActive) {
      setScore(score + 1);
    }
  };
  
  if (!gameId) {
    return <div>Loading game...</div>;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Click Game</h2>
      
      <div className="text-center mb-6">
        <div className="font-bold text-4xl text-purple-600 dark:text-purple-400 mb-2">{score}</div>
        {gameActive ? (
          <div className="text-gray-700 dark:text-gray-300">Time left: {timeLeft}s</div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">Click to start</div>
        )}
      </div>
      
      {gameActive ? (
        <button
          onClick={incrementScore}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 px-4 rounded-lg transition-transform transform hover:scale-105"
        >
          Click Me!
        </button>
      ) : (
        <button
          onClick={startGame}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg"
        >
          {score > 0 ? 'Play Again' : 'Start Game'}
        </button>
      )}
      
      {!isConnected && score > 0 && (
        <div className="mt-4 text-amber-600 dark:text-amber-400 text-center text-sm">
          Connect your wallet to save your score!
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Leaderboard</h3>
        
        {highScores.length > 0 ? (
          <div className="space-y-2">
            {highScores.map((entry, index) => (
              <div 
                key={entry.id} 
                className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded"
              >
                <div className="flex items-center">
                  <span className="font-bold w-6 text-gray-500 dark:text-gray-400">{index + 1}.</span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {entry.wallet_nickname || entry.wallet_address.substring(0, 6) + '...' + entry.wallet_address.substring(38)}
                  </span>
                </div>
                <span className="font-bold text-purple-600 dark:text-purple-400">{entry.score}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">No scores yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default SimpleGame;

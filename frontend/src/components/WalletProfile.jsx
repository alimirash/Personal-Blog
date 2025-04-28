import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../context/WalletContext';

const WalletProfile = () => {
  const { account, walletData, updateWalletNickname, getWalletDetails } = useContext(WalletContext);
  const [nickname, setNickname] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (account && !walletData) {
      getWalletDetails(account);
    }
    
    if (walletData?.nickname) {
      setNickname(walletData.nickname);
    }
  }, [account, walletData, getWalletDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      await updateWalletNickname(account, nickname);
      setIsEditing(false);
    }
  };

  if (!walletData) {
    return <div className="text-center p-4">Loading wallet data...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Wallet Profile</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Connections: {walletData.connection_count}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <div className="font-medium text-gray-700 dark:text-gray-300">Address:</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm break-all">
            {account}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="font-medium text-gray-700 dark:text-gray-300">Nickname:</div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border rounded px-2 py-1 text-sm mr-2"
                placeholder="Enter nickname"
              />
              <button 
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-1 px-2 rounded"
              >
                Save
              </button>
            </form>
          ) : (
            <div className="flex items-center">
              <span className="text-gray-600 dark:text-gray-400">
                {walletData.nickname || 'Not set'}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="ml-2 text-purple-600 hover:text-purple-700 text-sm"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="font-medium text-gray-700 dark:text-gray-300">First connection:</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {new Date(walletData.first_connection).toLocaleString()}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="font-medium text-gray-700 dark:text-gray-300">Last connection:</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {new Date(walletData.last_connection).toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Game Statistics</h3>
        
        {walletData.total_games_played === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No games played yet.</p>
        ) : (
          <div>
            <div className="mb-4">
              <div className="font-medium text-gray-700 dark:text-gray-300">Total games played:</div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {walletData.total_games_played}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Your high scores:</h4>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                {Object.entries(walletData.high_scores).map(([game, score]) => (
                  <div key={game} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-600 last:border-0">
                    <span className="text-gray-700 dark:text-gray-300">{game}</span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">{score} pts</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Recent games:</h4>
              <div className="space-y-2">
                {walletData.game_history.slice(0, 5).map(history => (
                  <div key={history.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{history.game_name}</span>
                      <span className="text-purple-600 dark:text-purple-400 font-bold">{history.score} pts</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(history.played_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletProfile;

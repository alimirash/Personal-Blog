import React, { useContext } from 'react';
import { WalletContext } from '../context/WalletContext';

const WalletConnect = () => {
  const { isConnected, connectWallet, disconnectWallet } = useContext(WalletContext);

  return (
    <div className="flex justify-end p-4">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={disconnectWallet}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Disconnect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;

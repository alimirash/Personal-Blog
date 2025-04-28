import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import BlogABI from '../contracts/BlogABI.json';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Record wallet connection to the backend
  const recordWalletConnection = async (address) => {
    try {
      const response = await axios.post('/api/wallets/connect/', { address });
      setWalletData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error recording wallet connection:', error);
      return null;
    }
  };

  // Get wallet details including game history
  const getWalletDetails = async (address) => {
    try {
      const response = await axios.get(`/api/wallets/${address}/`);
      setWalletData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet details:', error);
      return null;
    }
  };

  // Update wallet nickname
  const updateWalletNickname = async (address, nickname) => {
    try {
      const response = await axios.post(`/api/wallets/${address}/update_nickname/`, { nickname });
      setWalletData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating wallet nickname:', error);
      return null;
    }
  };

  // Record game history
  const recordGameScore = async (gameId, score, gameData = {}) => {
    if (!account) return null;
    
    try {
      const response = await axios.post('/api/game-history/record_game/', {
        wallet_address: account,
        game_id: gameId,
        score,
        data: gameData
      });
      
      // Refresh wallet data to include new game history
      getWalletDetails(account);
      
      return response.data;
    } catch (error) {
      console.error('Error recording game score:', error);
      return null;
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Replace with your deployed contract address
        const contractAddress = '0xYourContractAddressHere';
        const blogContract = new ethers.Contract(
          contractAddress,
          BlogABI,
          signer
        );
        
        const walletAddress = accounts[0];
        setAccount(walletAddress);
        setIsConnected(true);
        setContract(blogContract);
        
        // Record wallet connection to backend
        await recordWalletConnection(walletAddress);
        
        // Set up event listener for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            disconnectWallet();
          } else {
            const newAddress = accounts[0];
            setAccount(newAddress);
            recordWalletConnection(newAddress);
          }
        });
        
        setLoading(false);
        return true;
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setLoading(false);
        return false;
      }
    } else {
      alert('Please install MetaMask to connect your wallet!');
      return false;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setContract(null);
    setWalletData(null);
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected,
        contract,
        walletData,
        loading,
        connectWallet,
        disconnectWallet,
        updateWalletNickname,
        recordGameScore,
        getWalletDetails
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

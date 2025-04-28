require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config(); // Load from local .env file instead of parent directory

// Private key from environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Local development network
    hardhat: {
      chainId: 1337,
    },
    // Sepolia testnet
    sepolia: {
      url: process.env.SEPOLIA_URL || '',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    // Ethereum mainnet
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 120000000000,
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};

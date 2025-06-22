import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.20',

  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    bscTestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      chainId: 97,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },

  etherscan: {
    // Nếu bạn dùng BscScan API để verify contract
    apiKey: {
      bscTestnet: process.env.BSCSCAN_API_KEY || '',
    },
  },

  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};

export default config;

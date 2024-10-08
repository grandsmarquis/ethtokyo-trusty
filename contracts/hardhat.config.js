require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

let privateKey = process.env.PRIVATE_KEY;

const defaultNetwork = "scroll-dev";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 9999
      }
    }
  },
  defaultNetwork,
  networks: {
    "scroll-sepolia": {
      url: "https://sepolia-rpc.scroll.io/",
      accounts: [privateKey]
    },
    "scroll-dev": {
      url: "https://l1sload-rpc.scroll.io",
      accounts: [privateKey]
    },
    sepolia: {
      url: "https://rpc.sepolia.org",
      accounts: [privateKey]
    },
  }
};
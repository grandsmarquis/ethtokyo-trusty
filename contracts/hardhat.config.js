require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

let privateKey = process.env.PRIVATE_KEY;

const defaultNetwork = "sepolia";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  defaultNetwork,
  networks: {
    sepolia: {
      url: "https://rpc.sepolia.org",
      accounts: [privateKey]
    }
  }
};
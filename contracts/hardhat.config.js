require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

let privateKey = process.env.PRIVATE_KEY;

const defaultNetwork = "scroll-sepolia";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  defaultNetwork,
  networks: {
    "scroll-sepolia": {
      url: "https://sepolia-rpc.scroll.io/",
      accounts: [privateKey]
    }
  }
};
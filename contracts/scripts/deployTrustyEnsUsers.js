// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    console.log("⏳ Deploying TrustyEnsUsers contract");
    let ensUserDeployment = await hre.ethers.deployContract("TrustyEnsUsers", [
        "0x0635513f179D50A207757E05759CbD106d7dFcE8", // L1EnsResolver
        "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD", // PublicResolver
        "0x62f41adad055fba070cfb5e35669b2e7be7f3981f6babb6eb8dfa994bd426be3" // trusty.eth Root ENS node
    ]);
    await ensUserDeployment.waitForDeployment();
    console.log("✅ Deployed TrustyEnsUsers at:", ensUserDeployment.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
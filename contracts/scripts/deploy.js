// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

    const [main, otherAccount] = await hre.ethers.getSigners();
    console.log("⏳ Deploying Rank Function contract");
    let rankDeployment = await hre.ethers.deployContract("BasicRankFunction", []);
    await rankDeployment.waitForDeployment();
    console.log("✅ Deployed rank function at:", rankDeployment.target)

    console.log("⏳ Deploying Factory contract");
    let factoryDeployment = await hre.ethers.deployContract("Factory", []);
    await factoryDeployment.waitForDeployment();
    console.log("✅ Deployed factory at:", factoryDeployment.target)

    console.log("⏳ Creating space", "TestSpace");
    let pending = await factoryDeployment.createSpace(
        "0xBF7B8616e86332BEDdF987C25306e9aF9FF96674",
        // [
        //     "0xBF7B8616e86332BEDdF987C25306e9aF9FF96674",
        //     "0x84c03c2F60A472568eAd8E5CA58B641F5785ae30",
        //     "0xC7Ce6bfe1E69e58557a21Ad6E832d26cA8FB03AE",
        // ],
        (await rankDeployment.getAddress()),
        "TestSpace",
        "TSP"
    );
    await pending.wait();
    console.log("✅ Created space", "TestSpace");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
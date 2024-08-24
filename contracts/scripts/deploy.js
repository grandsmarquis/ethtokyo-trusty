// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

let factorydeployment

async function createFactory(name) {
    console.log("⏳ Creating factory", name);
    pending = await factorydeployment.createSpace(name);
    await pending.wait();
    console.log("✅ Created factory", name);
}

async function main() {

    const [main, otherAccount] = await hre.ethers.getSigners();

    console.log("⏳ Deploying Staking")
    factorydeployment = await hre.ethers.deployContract("Factory", []);
    await factorydeployment.waitForDeployment();
    console.log("✅ Deployed token at:", factorydeployment.target)

    await createFactory("Space 1");
    await createFactory("Space 2");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
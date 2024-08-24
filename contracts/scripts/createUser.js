// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    console.log("⏳ Registering user");
    let ensUserDeployment = await hre.ethers.getContractAt("EnsUser", "0x15a5e0Eb61B33b7af0285227D6753A0c318c7967");
    let tx = await ensUserDeployment.registerUser("mytestname");

    await tx.wait();
    console.log("✅ Registered user");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

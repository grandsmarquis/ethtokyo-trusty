const hre = require("hardhat");

async function main() {
    console.log("⏳ Registering user");
    let ensUserDeployment = await hre.ethers.getContractAt("TrustyEnsUsers", "0xE37881258A5c1dA765a3566F7D2A3EE7f91B8264");
    let tx = await ensUserDeployment.registerUser("pipip");

    await tx.wait();
    console.log("✅ Registered user");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

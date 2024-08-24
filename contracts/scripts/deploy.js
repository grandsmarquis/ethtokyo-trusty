// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    console.log("⏳ Deploying L1EnsResolver contract");
    let l1EnsResolverDeployment = await hre.ethers.deployContract("L1EnsResolver", [
        "0x15a5e0Eb61B33b7af0285227D6753A0c318c7967", // TrustyEnsUser
        "0x0635513f179D50A207757E05759CbD106d7dFcE8", // NameWrapper
    ]);
    await l1EnsResolverDeployment.waitForDeployment();
    console.log("✅ Deployed L1EnsResolver at:", l1EnsResolverDeployment.target);

    // console.log("node id:", await l1EnsResolverDeployment.getNodeId("0x6F824B3439F522D7A37DE290aAb800993EeaF32D"));
    // console.log("username:", await l1EnsResolverDeployment.getAddressUsername("0x6F824B3439F522D7A37DE290aAb800993EeaF32D"));
    // console.log("username:", await l1EnsResolverDeployment._retrieveSlotFromL1("0x15a5e0Eb61B33b7af0285227D6753A0c318c7967", "93187982417923737308899198249154879998230177608241762305889175894456250657999"));


    console.log("⏳ Deploying BasicRankFunction contract");
    let rankDeployment = await hre.ethers.deployContract("BasicRankFunction", []);
    await rankDeployment.waitForDeployment();
    let rankAddress = await rankDeployment.getAddress();
    console.log("✅ Deployed BasicRankFunction at:", rankDeployment.target)

    console.log("⏳ Deploying TrustyFactory contract");
    let factoryDeployment = await hre.ethers.deployContract("TrustyFactory", []);
    await factoryDeployment.waitForDeployment();
    console.log("✅ Deployed TrustyFactory at:", factoryDeployment.target)

    console.log("⏳ Creating space");
    let parameters = [
        "0x6F824B3439F522D7A37DE290aAb800993EeaF32D", // Owner
        [ // Master members
            "0x6F824B3439F522D7A37DE290aAb800993EeaF32D",
            "0x84c03c2F60A472568eAd8E5CA58B641F5785ae30",
            "0xC7Ce6bfe1E69e58557a21Ad6E832d26cA8FB03AE",
            "0xBAC78374F87D02d3b0d6FAf82d8794201D40b35B",
        ],
        rankAddress,
        "Trusty DAO"
    ]

    let spaceAddress = await factoryDeployment.createSpace.staticCall(
        ...parameters
    );

    let tx = await factoryDeployment.createSpace(
        ...parameters
    );
    await tx.wait();
    console.log("✅ Created space", parameters[3], "at:", spaceAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
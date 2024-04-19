// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}

async function main() {
  [buyer, seller, signer] = await ethers.getSigners();

  const Escrow = await ethers.getContractFactory('Escrow');
  const escrow = await Escrow.deploy(seller.address);
  await escrow.waitForDeployment();

  await escrow.connect(seller).listSkin(1, tokens(1), tokens(0.5));

  console.log(await escrow.connect(seller).listedSkins(1));

  console.log(`Escrow contract deployed at: ${await escrow.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

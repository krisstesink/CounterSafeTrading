const fs = require('fs');
const solc = require('solc');
const ethers = require('ethers');
const escrowABI = require('../../abis/Escrow.abi');
const hre = require("hardhat");

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}



// Define the file path to your Solidity source code
const filePath = 'contracts/Escrow.sol'; 

// Read the Solidity source code from the file
const sourceCode = fs.readFileSync(filePath, 'utf8');

// Compile the Solidity contract

const input = {
  language: 'Solidity',
  sources: {
    'Escrow.sol': {
      content: sourceCode,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));

console.log(compiledContract);

// Get the bytecode
const bytecode = compiledContract.contracts['Escrow.sol']['Escrow'].evm.bytecode.object;

// Initialize an Ethereum provider (replace 'YOUR_ETHEREUM_NODE_URL' with your node URL)
const provider = ethers.getDefaultProvider("http://localhost:8545/");



// Define a function to create a new Escrow contract
async function createEscrowContract(sellerWallet) {
  try {
    const factory = new ethers.ContractFactory(escrowABI, bytecode, sellerWallet); // Replace 'YOUR_BYTECODE' with the contract bytecode
    const escrowContract = await factory.deploy(sellerWallet.address);
    await escrowContract.deployed();
    return escrowContract;
  } catch (error) {
    console.error('Failed to create Escrow contract:', error);
    return null;
  }
}

// Define a controller function to list a skin in an existing Escrow contract
async function listSkin(escrowContract, skinId, askPrice, minBidPrice, senderWallet) {
  try {
    // Call the 'listSkin' function on the contract
    const transaction = await escrowContract.connect(senderWallet).listSkin(skinId, askPrice, minBidPrice);
    await transaction.wait();
    console.log('Skin listed:', transaction.hash);
  } catch (error) {
    console.error('Failed to list skin:', error);
  }
}

// Define a controller function to purchase a skin in an existing Escrow contract
async function purchaseSkin(escrowContract, skinId, value, senderWallet) {
  try {
    // Call the 'purchase' function on the contract
    const transaction = await escrowContract.connect(senderWallet).purchase(skinId, { value });
    await transaction.wait();
    console.log('Skin purchased:', transaction.hash);
  } catch (error) {
    console.error('Failed to purchase skin:', error);
  }
}

// Define a controller function to approve a sale in an existing Escrow contract
async function approveSale(escrowContract, skinId, senderWallet) {
  try {
    // Call the 'approveSale' function on the contract
    const transaction = await escrowContract.connect(senderWallet).approveSale(skinId);
    await transaction.wait();
    console.log('Sale approved:', transaction.hash);
  } catch (error) {
    console.error('Failed to approve sale:', error);
  }
}

// Define a controller function to finalize a sale in an existing Escrow contract
async function finalizeSale(escrowContract, skinId, senderWallet) {
  try {
    // Call the 'finalizeSale' function on the contract
    const transaction = await escrowContract.connect(senderWallet).finalizeSale(skinId);
    await transaction.wait();
    console.log('Sale finalized:', transaction.hash);
  } catch (error) {
    console.error('Failed to finalize sale:', error);
  }
}


// Export the controller functions
module.exports = {
  createEscrowContract,
  listSkin,
  purchaseSkin,
  approveSale,
  finalizeSale,
};




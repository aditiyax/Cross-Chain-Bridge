const { ethers } = require('ethers');
require('dotenv').config();

const ETH_INFURA_URL = process.env.ETH_URL;
const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;
const ETH_CONTRACT_ADDRESS = process.env.ETH_CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(ETH_INFURA_URL);
const wallet = new ethers.Wallet(ETH_PRIVATE_KEY, provider);
const contractABI = [
  "function mintFromSolana(address to, uint256 amount) public"
];
const contract = new ethers.Contract(ETH_CONTRACT_ADDRESS, contractABI, wallet);

async function mintTokensOnEthereum(toAddress, amount) {
  const tx = await contract.mintFromSolana(toAddress, amount);
  await tx.wait();
  console.log(`Minted ${amount} tokens to Ethereum address ${toAddress}`);
}

module.exports = mintTokensOnEthereum;

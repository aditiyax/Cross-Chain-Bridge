const { ethers } = require('ethers');
const fs = require('fs');
require('dotenv').config();

const ETHEREUM_PROVIDER_URL = process.env.ETH_URL;
const ETHEREUM_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;
const ERC20_CONTRACT_ADDRESS = process.env.ETH_CONTRACT_ADDRESS;


const abiPath = './eth_contract_abi.json'; 
let ERC20_ABI;

try {
  const rawAbi = fs.readFileSync(abiPath, 'utf8');
  ERC20_ABI = JSON.parse(rawAbi);

  if (!Array.isArray(ERC20_ABI)) {
    throw new Error('ABI is not an array');
  }
} catch (error) {
  console.error('Error reading or parsing ABI file:', );
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(ETHEREUM_PROVIDER_URL);
const wallet = new ethers.Wallet(ETHEREUM_PRIVATE_KEY, provider);
const erc20Contract = new ethers.Contract(ERC20_CONTRACT_ADDRESS, ERC20_ABI, provider);

async function pollForBurnEventsEthereum() {
  console.log('Polling for burn events on Ethereum...');

  try {
    const transferEventSignature = ethers.utils.id("Transfer(address,address,uint256)");
    const filter = {
      address: ERC20_CONTRACT_ADDRESS,
      topics: [transferEventSignature, null, ethers.utils.hexZeroPad(wallet.address, 32)]
    };

    provider.on(filter, async (log) => {
      console.log('Transfer event log:', );
      
    });
  } catch (error) {
    console.error('Error creating event filter:', );
  }
}

module.exports = pollForBurnEventsEthereum;

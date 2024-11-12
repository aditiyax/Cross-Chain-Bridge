const { ethers } = require("ethers");
const { Connection, PublicKey,Keypair} = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount, mintTo, burn,Token, TOKEN_PROGRAM_ID, } = require('@solana/spl-token');
const fs = require('fs');
require('dotenv').config();


// Ethereum setup
const providerETH = new ethers.JsonRpcProvider(process.env.ETH_URL);
const privateKeyETH = process.env.ETH_PRIVATE_KEY;
const walletETH = new ethers.Wallet(privateKeyETH, providerETH);
const contractABI = JSON.parse(fs.readFileSync('./eth_contract_abi.json', 'utf8'));
const erc20Contract = new ethers.Contract(process.env.ETH_CONTRACT_ADDRESS, contractABI, walletETH);

// Solana setup
const connectionSOL = new Connection('https://api.devnet.solana.com', 'confirmed');
const fromWalletSOL = Keypair.fromSecretKey(new Uint8Array([125,194,80,77,136,206,123,213,47,202,224,100,65,61,18,58,141,38,112,217,204,41,206,229,193,39,58,180,151,159,148,141,229,150,255,206,20,117,253,255,83,38,8,79,2,53,2,209,166,141,240,115,115,190,126,44,106,43,145,162,81,102,52,20]));
const splTokenMintPublicKey = new PublicKey(process.env.SOL_MINT_ADDRESS);

// Event listeners
erc20Contract.on('Transfer', async (from, to, amount) => {
  console.log(`ERC-20 Transfer event: ${amount.toString()} tokens from ${from} to ${to}`);
  // Implement the logic to burn SPL tokens on Solana
  await burnTokens(splTokenMintPublicKey, to, amount);
});



async function pollForBurnEventsSolana() {
  // Poll for burn events and handle the logic
  // Placeholder for actual burn event processing
  let lastSignature = '';

  setInterval(async () => {
    try {
      // Fetch recent transactions for the SPL token account
      const signatureInfos = await connectionSOL.getConfirmedSignaturesForAddress2(
        splTokenMintPublicKey, 
        { before: lastSignature, limit: 10 }
      );
      
      if (signatureInfos.length === 0) return;

      // Update the lastSignature for pagination
      lastSignature = signatureInfos[0].signature;

      for (const info of signatureInfos) {
        const tx = await connectionSOL.getTransaction(info.signature);

        if (tx && tx.meta && tx.meta.preTokenBalances) {
          // Check if the transaction contains a burn event
          tx.meta.preTokenBalances.forEach(async (balance) => {
            if (balance.owner === splTokenMintPublicKey.toBase58() && balance.uiAmount > 0) {
              console.log(`Detected burn event: ${balance.uiAmount} tokens burned`);
              // Process the burn event and trigger minting on Ethereum
              await mintTokensOnEthereum(balance.uiAmount);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error polling Solana burn events:', error);
    }
  }, 30000); // Poll every 30 seconds
}



async function mintTokensOnSolana(amount) {
  try {
    // Create a new instance of the SPL Token
    const token = new Token(connectionSOL, splTokenMintPublicKey, TOKEN_PROGRAM_ID, fromWalletSOL);

    // Get the token account of the wallet
    const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(fromWalletSOL.publicKey);

    // Mint tokens to the wallet's token account
    const mintTx = await token.mintTo(
      fromTokenAccount.address,
      fromWalletSOL.publicKey,
      [], // Add signers if required
      amount
    );
    
    // Confirm the transaction
    await connectionSOL.confirmTransaction(mintTx);
    
    console.log(`Successfully minted ${amount} SPL tokens on Solana`);
  } catch (error) {
    console.error('Error minting tokens on Solana:', error);
  }
}


async function pollForBurnEventsEthereum() {
  // Poll for burn events and handle the logic
  // Placeholder for actual burn event processing
// Listen for Transfer events
    erc20Contract.on('Transfer', async (from, to, amount) => {
    console.log(`ERC-20 Transfer event detected: ${amount.toString()} tokens from ${from} to ${to}`);

    if (to === 'BURN_ADDRESS') { // Check if the destination address is the burn address
      console.log(`Detected burn event on Ethereum: ${amount.toString()} tokens burned`);
      // Process the burn event and trigger minting on Solana
      await mintTokensOnSolana(amount);
    }
  });
}

async function mintTokensOnEthereum(amount) {
    try {
      // Define the mint function
      const mintTx = await erc20Contract.mint(walletETH.address, ethers.utils.parseUnits(amount.toString(), 18));
      
      // Wait for the transaction to be mined
      await mintTx.wait();
      
      console.log(`Successfully minted ${amount.toString()} ERC-20 tokens on Ethereum`);
    } catch (error) {
      console.error('Error minting tokens on Ethereum:', error);
    }
  }
  


async function startRelayer() {
  console.log("Polling for burn events on Solana...");
  pollForBurnEventsSolana();

  console.log("Polling for burn events on Ethereum...");
  pollForBurnEventsEthereum();
}

startRelayer();
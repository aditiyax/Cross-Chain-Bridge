const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { mintTo, getOrCreateAssociatedTokenAccount } = require('@solana/spl-token');
require('dotenv').config();

const SOLANA_CLUSTER_URL = process.env.SOL_URL;
const SOLANA_PRIVATE_KEY = JSON.parse(process.env.SOL_PRIVATE_KEY);
const SPL_TOKEN_MINT_ADDRESS = new PublicKey(process.env.SOL_TOKEN_MINT_ADDRESS);

const connection = new Connection(SOLANA_CLUSTER_URL, 'confirmed');
const solanaWallet = Keypair.fromSecretKey(new Uint8Array(SOLANA_PRIVATE_KEY));

async function mintTokensOnSolana(toAddress, amount) {
  const destinationWallet = new PublicKey(toAddress);
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    solanaWallet,
    SPL_TOKEN_MINT_ADDRESS,
    destinationWallet
  );
  
  await mintTo(
    connection,
    solanaWallet,
    SPL_TOKEN_MINT_ADDRESS,
    tokenAccount.address,
    solanaWallet.publicKey,
    amount
  );
  
  console.log(`Minted ${amount} SPL tokens to Solana address ${toAddress}`);
}

module.exports = mintTokensOnSolana;

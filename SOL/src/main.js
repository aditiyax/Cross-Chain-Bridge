const {
    Connection,
    Keypair,
    PublicKey,
    clusterApiUrl,
    LAMPORTS_PER_SOL
  } = require('@solana/web3.js');
  const {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    getAccount,
    burn
  } = require('@solana/spl-token');
  
  async function mintAndBurnTokens(connection, fromWallet, tokenAccount, mint, amountToMint, amountToBurn, ethAddress) {

    await mintTo(
      connection,
      fromWallet,
      mint,
      tokenAccount.address,
      fromWallet.publicKey,
      amountToMint
    );
    console.log(`Minted ${amountToMint / (10 ** 9)} tokens to your associated token account.`);
  
    
    const tokenAccountBalance = await getAccount(connection, tokenAccount.address);
    console.log(`Token account balance after minting: ${Number(tokenAccountBalance.amount) / (10 ** 9)} tokens`);
  
    if (Number(tokenAccountBalance.amount) < amountToBurn) {
      console.log(`Insufficient funds. Current balance: ${Number(tokenAccountBalance.amount) / (10 ** 9)} tokens.`);
      return;
    }
  
   
    await burn(
      connection,
      fromWallet,
      tokenAccount.address,
      mint,
      fromWallet.publicKey,
      amountToBurn
    );
    
    console.log(`Burned ${amountToBurn / (10 ** 9)} tokens from ${fromWallet.publicKey} and moving to Ethereum wallet ${ethAddress}.`);
    
   
    console.log(`Relaying burn event to Ethereum relayer for Ethereum wallet: ${ethAddress}, amount: ${amountToBurn / (10 ** 9)}.`);
  }
  
  (async () => {
    const fromWallet = Keypair.fromSecretKey(new Uint8Array([your,secret,keypair]));
    const ethAddress = "0xyourAddress"; //add your eth wallet address
    const mintAmount = 100000 * 10 ** 9; // amount of SPL tokens to mint 
    const burnAmount = 1000 * 10 ** 9;  // amount of SPL tokens to burn/transfer
  
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed'); // put your preferred cluster
  
    console.log('Creating SPL token...');
    const mint = await createMint(
      connection,
      fromWallet,
      fromWallet.publicKey,
      null,
      9 
    );
  
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey
    );
  
    console.log('Minting tokens...');
    await mintAndBurnTokens(connection, fromWallet, fromTokenAccount, mint, mintAmount, burnAmount, ethAddress);

    console.log(`View token account on Solana Explorer: https://explorer.solana.com/address/${fromTokenAccount.address}?cluster=devnet`);
    
  })();
  
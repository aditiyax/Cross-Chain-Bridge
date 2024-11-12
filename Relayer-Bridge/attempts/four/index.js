const ethWebSocket = require('./eth_ws');
const solWebSocket = require('./sol_ws');

const startRelayer = () => {
  console.log('Starting the cross-chain relayer...');

  ethWebSocket((value, from, to) => {
    console.log(`ETH Event: Burned ${value} tokens from ${from}, moving to Solana.`);
  });

  solWebSocket((logs, ctx) => {
    console.log('SOL Event: Processing burn event...');
  });
};

// Start relayer
startRelayer();

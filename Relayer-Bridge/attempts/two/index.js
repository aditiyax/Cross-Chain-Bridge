const pollForBurnEventsSolana = require('./pollBurnEventsSolana');
const pollForBurnEventsEthereum = require('./pollBurnEventsEthereum');

function startRelayer() {
    console.log('Polling for burn events on Solana...');
    pollForBurnEventsSolana();
  
    console.log('Polling for burn events on Ethereum...');
    pollForBurnEventsEthereum();
}

startRelayer();

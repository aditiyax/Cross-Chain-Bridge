const { Connection, PublicKey } = require('@solana/web3.js');
const config = require('./config.json');

const solWebSocket = async (onEventCallback) => {
  const connection = new Connection(config.solana.webSocketUrl, 'confirmed');

  const programId = new PublicKey(config.solana.programId);

  connection.onLogs(programId, (logs, ctx) => {
    console.log('Solana Burn Event Detected:', logs);
    // Parse the logs to extract burn event details (value, from address, etc.)
    // Trigger the callback when a burn event happens
    onEventCallback(logs, ctx);
  });

  connection.onSlotChange((slotInfo) => {
    console.log(`New slot info on Solana: ${slotInfo.slot}`);
  });
};

module.exports = solWebSocket;

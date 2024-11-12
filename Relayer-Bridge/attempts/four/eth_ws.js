// const { ethers } = require('ethers');
// const fs = require('fs');
// const config = require('./config.json');

// const ethWebSocket = async (onEventCallback) => {
//   const abi = JSON.parse(fs.readFileSync(config.ethereum.abiFilePath));

//   const provider = new ethers.WebSocketProvider(config.ethereum.webSocketUrl);

//   const contract = new ethers.Contract(config.ethereum.contractAddress, abi, provider);

//   contract.on('Transfer', (from, to, value, event) => {
//     console.log(`Ethereum Burn Event Detected: ${value.toString()} tokens from ${from}`);
//     onEventCallback(value, from, to);
//   });

//   provider._websocket.on('close', () => {
//     console.error('Ethereum WebSocket connection closed.');
//   });

//   provider._websocket.on('error', (err) => {
//     console.error('Ethereum WebSocket connection error:', err);
//   });
// };

// module.exports = ethWebSocket;



const { ethers } = require('ethers');
const fs = require('fs');
const config = require('./config.json');

const ethWebSocket = async (onEventCallback) => {
  // Load ABI from file
  const abi = JSON.parse(fs.readFileSync(config.ethereum.abiFilePath));

  try {
    // Connect to Ethereum via WebSocket
    const provider = new ethers.providers.WebSocketProvider(config.ethereum.webSocketUrl);

    // Create contract instance
    const contract = new ethers.Contract(config.ethereum.contractAddress, abi, provider);

    // Listen for Transfer (burn) events
    contract.on('Transfer', (from, to, value, event) => {
      console.log(`Ethereum Burn Event Detected: ${value.toString()} tokens from ${from}`);
      // Trigger the callback when a burn event happens
      onEventCallback(value, from, to);
    });

    // Handle WebSocket close event
    provider._websocket.on('close', (code, reason) => {
      console.error(`Ethereum WebSocket closed with code: ${code}, reason: ${reason}`);
    });

    // Handle WebSocket error event
    provider._websocket.on('error', (err) => {
      console.error('Ethereum WebSocket connection error:', err);
    });

  } catch (error) {
    console.error('Error setting up Ethereum WebSocket connection:', error);
  }
};

module.exports = ethWebSocket;

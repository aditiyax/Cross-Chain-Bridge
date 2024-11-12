const { ethers } = require("ethers");
const axios = require("axios");

async function main() {
  // Use WebSocket provider instead of HTTP provider
  const provider = new ethers.providers.WebSocketProvider("wss://arb-sepolia.g.alchemy.com/v2/v3cbKGKeAukczPqVd4ULeO5VPk389TTR");
  const contractAddress = "0x20b0C9D6B8c26CEe16C2A4544DCd37611676622C";
  const abi = require("../artifacts/contracts/MyToken.sol/Testtoken.json").abi;

  const contract = new ethers.Contract(contractAddress, abi, provider);

  // Listen for transfer events that indicate burning tokens (to 0x0 address)
  contract.on("Transfer", (from, to, amount, event) => {
    if (to === ethers.constants.AddressZero) {
      console.log(`Burn detected: ${amount.toString()} tokens burned by ${from}`);
      
      // Call the relayer function to transfer details to Solana
      relayToSolana(from, amount);
    }
  });

  // Function to call the relayer
  async function relayToSolana(from, amount) {
    try {
      const relayerEndpoint = "http://localhost:4000/relayToSolana";  // Example endpoint

      // Make a POST request to the relayer
      const response = await axios.post(relayerEndpoint, {
        from: from,
        amount: amount.toString(),
      });

      console.log("Successfully relayed burn event to Solana relayer:", response.data);
    } catch (error) {
      console.error("Error relaying burn event to Solana:", error);
    }
  }

  // Handle WebSocket connection close and errors
  provider._websocket.on('close', (code, reason) => {
    console.error(`Ethereum WebSocket closed with code: ${code}, reason: ${reason}`);
  });

  provider._websocket.on('error', (error) => {
    console.error('Ethereum WebSocket connection error:', error);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

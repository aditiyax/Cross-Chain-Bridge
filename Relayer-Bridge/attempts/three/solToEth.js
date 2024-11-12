const axios = require("axios");

async function relayToEthereum(amount, recipient) {
  try {
    // Example relayer call for Ethereum mint function
    const ethEndpoint = "http://localhost:4000/mintOnEthereum";  // Example Ethereum relayer URL

    // Send burn data from Solana to Ethereum's mint function
    const response = await axios.post(ethEndpoint, {
      amount: amount,
      recipient: recipient,
    });

    console.log("Minted tokens on Ethereum:", response.data);
  } catch (error) {
    console.error("Error relaying to Ethereum:", error);
  }
}

module.exports = relayToEthereum;

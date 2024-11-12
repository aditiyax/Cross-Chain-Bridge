const axios = require("axios");

async function relayToSolana(from, amount) {
  try {
    // Example relayer call for Solana mint function
    const solanaEndpoint = "http://localhost:5000/mintOnSolana"; // Example Solana relayer URL

    // Send burn data to Solana's mint function
    const response = await axios.post(solanaEndpoint, {
      amount: amount,
      recipient: from,  // From Ethereum wallet address, mint tokens to the same address on Solana
    });

    console.log("Minted tokens on Solana:", response.data);
  } catch (error) {
    console.error("Error relaying to Solana:", error);
  }
}

module.exports = relayToSolana;

const WebSocket = require("ws");
const { ethers } = require("ethers");
const fs = require("fs");
require('dotenv').config();


const wsUrl = "wss://api.devnet.solana.com"; //your desired network
const connection = new WebSocket(wsUrl);

const provider = new ethers.WebSocketProvider(process.env.ETH_WSS_URL);
const wallet = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, provider);
const contractAddress = process.env.ETH_CONTRACT_ADDRESS;
const abi = JSON.parse(fs.readFileSync("./path_to_your/eth_contract_abi.json"));
const contract = new ethers.Contract(contractAddress, abi, wallet);

connection.on("open", () => {
  console.log("Connected to Solana WebSocket");

  const subscriptionMessage = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "logsSubscribe",
    params: [
      {
        mentions: [""], // Your SPL token address
      },
      {
        commitment: "finalized",
      },
    ],
  });

  connection.send(subscriptionMessage);
});

connection.on("message", async (data) => {
  const response = JSON.parse(data);
  if (response.method === "logsNotification") {
    const logData = response.params.result;

    // Check if the log indicates a burn
    if (isBurnLog(logData)) {
      const amountBurned = extractBurnAmount(logData);
      console.log(`Burn detected: ${amountBurned} tokens`);

      await mintTokens(amountBurned);
    }
  } else {
    console.log("Received message:", response);
  }
});

connection.on("close", () => {
  console.log("Connection closed");
});

connection.on("error", (error) => {
  console.error("WebSocket error:", error);
});

// Function to Check the log data structure to confirm it's a burn event
function isBurnLog(logData) {

return logData && logData.err === null && logData.logs && logData.logs.some(log => log.includes("burn"));

}

// Function to extract the amount burned from the log data
function extractBurnAmount(logData) {
  const amountLog = logData.logs.find(log => log.includes("burn"));
  if (amountLog) {
    const amount = /* logic to parse your burn amount format */;
    return parseFloat(amount); // Return the amount as a number
  }
  return 0;
}

// Function to mint tokens on Ethereum
async function mintTokens(amount) {
  try {
    const tx = await contract.mint(wallet.address, ethers.utils.parseUnits(amount.toString(), 18));
    console.log(`Mint transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log("Minting successful");
  } catch (error) {
    console.error("Minting failed:", error);
  }
}

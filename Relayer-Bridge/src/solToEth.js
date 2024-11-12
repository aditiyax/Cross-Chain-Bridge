const WebSocket = require("ws");

// Replace with your desired Solana cluster
const wsUrl = "wss://api.devnet.solana.com";

const connection = new WebSocket(wsUrl);

connection.on("open", () => {
  console.log("Connected to Solana WebSocket");

  // Subscribe to all logs
  const subscriptionMessage = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "logsSubscribe",
    params: [
      {
        mentions: ["11111111111111111111111111111111"],
        // e.g., { "mentions": ["YourPublicKey"] }
      },
      {
        commitment: "finalized",
      },
    ],
  });

  connection.send(subscriptionMessage);
});

connection.on("message", (data) => {
  const response = JSON.parse(data);
  if (response.method === "logsNotification") {
    console.log("Log Notification:", response.params.result);
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



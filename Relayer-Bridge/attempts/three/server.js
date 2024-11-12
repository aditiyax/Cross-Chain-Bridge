const express = require('express');
const ethToSol = require('./ethToSol');
const solToEth = require('./solToEth');

const app = express();
app.use(express.json());

// Ethereum to Solana route
app.post('/relayToSolana', (req, res) => {
  const { from, amount } = req.body;
  ethToSol(from, amount)
    .then(() => res.status(200).send("Relayed to Solana"))
    .catch((err) => res.status(500).send("Error relaying to Solana"));
});

// Solana to Ethereum route
app.post('/relayToEthereum', (req, res) => {
  const { recipient, amount } = req.body;
  solToEth(amount, recipient)
    .then(() => res.status(200).send("Relayed to Ethereum"))
    .catch((err) => res.status(500).send("Error relaying to Ethereum"));
});

app.listen(4000, () => {
  console.log("Relayer server listening on port 4000");
});

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    arbitrum_sepolia:{
      url: "https://arb-sepolia.g.alchemy.com/v2/v3cbKGKeAukczPqVd4ULeO5VPk389TTR",
      accounts: ["ff62296d00af372f6ee26f83d8854f1469bc1978c8959a2cf93ba62538c7536d"],
      
    },
  },
  etherscan:{
    apiKey:{
      polygon_amoy: "v3cbKGKeAukczPqVd4ULeO5VPk389TTR" ,arbitrum_sepolia:"Z2BC5MJEED6C4A3DRD64Q8XTXFJY2UPZ9H"},
      

      customChains: [
        {
          network: "arbitrum_sepolia",
          chainId: 421614,
          urls: {
            apiURL: "https://sepolia-rollup.arbitrum.io/rpc",
            browserURL:"https://sepolia.arbiscan.io/"
          }
        }
      ]
  },
};




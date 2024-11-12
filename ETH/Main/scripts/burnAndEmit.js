const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const ERC20Token = await ethers.getContractFactory("Testtoken");
  const erc20 = await ERC20Token.attach('0x20b0C9D6B8c26CEe16C2A4544DCd37611676622C');

  const recipient = "GTDud63gbHS2in8EAFPyrNjg2bLpVLfbZ3y97n1in4Hq";
  const burnAmount = ethers.parseEther("100");  

  // Burn tokens and emit the transfer event
  const tx = await erc20.burnAndMoveToSolana( burnAmount, recipient);
  await tx.wait();

  console.log(`Burned ${burnAmount.toString()} tokens from ${deployer.address} and emitted event.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

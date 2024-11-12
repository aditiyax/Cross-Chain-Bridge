// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Testtoken is ERC20, Ownable { // <------------------
    event BurnAndMoveToSolana(address indexed user, string solanaAddress, uint256 amount);
    event MintFromSolana(address indexed user, uint256 amount);

    address public relayer;
    
// Created a programme for event listeners and emitted events for ERC20 tokens, to perform the Cross-chain Interaction 

    constructor() ERC20("EthereumToken", "ETHR") Ownable(msg.sender){
        _mint(msg.sender, 1000000 * (10 ** decimals()));  // change amount as per your understanding
    }

    modifier onlyRelayer() {
        require(msg.sender == relayer, "Not authorized");
        _;
    }

    function setRelayer(address _relayer) external onlyOwner {
        relayer = _relayer;
    }

    function burnAndMoveToSolana(uint256 amount, string memory solanaAddress) external { // main transfering function 
        _burn(msg.sender, amount);
        emit BurnAndMoveToSolana(msg.sender, solanaAddress, amount);    
    }

    function mintFromSolana(address to, uint256 amount) external onlyRelayer {
        _mint(to, amount);
        emit MintFromSolana(to, amount);
    }

    event TokensBurned(address indexed from, address indexed solanaAddress, uint256 amount);

}


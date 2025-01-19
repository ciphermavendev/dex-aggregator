const { ethers } = require('ethers');

// ERC20 ABI for token interactions
const ERC20_ABI = [
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function name() view returns (string)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address owner) view returns (uint256)'
];

const isValidAddress = (address) => {
    try {
        return ethers.utils.isAddress(address);
    } catch (error) {
        return false;
    }
};

module.exports = {
    isValidAddress,
    ERC20_ABI
};
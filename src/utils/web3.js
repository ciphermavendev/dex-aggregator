const { ethers } = require('ethers');
require('dotenv').config();

class Web3Service {
    constructor(network) {
        if (!process.env.ETH_RPC_URL) {
            throw new Error('ETH_RPC_URL environment variable is not set');
        }
        
        try {
            this.provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
            // Test the provider connection
            this.provider.getNetwork().catch(error => {
                console.error('Failed to connect to the Ethereum network:', error);
                throw error;
            });
        } catch (error) {
            console.error('Error initializing Web3Service:', error);
            throw error;
        }
    }

    async getGasPrice() {
        return await this.provider.getGasPrice();
    }
}

module.exports = Web3Service;
const express = require('express');
const { ethers } = require('ethers');
const Web3Service = require('./utils/web3');
const PriceService = require('./services/priceService');
const { NETWORKS } = require('./config/constants');
const { isValidAddress } = require('./utils/helpers');

const app = express();
app.use(express.json());

const web3Service = new Web3Service(NETWORKS.ETHEREUM);
const priceService = new PriceService(web3Service.provider);

app.get('/api/price', async (req, res) => {
    try {
        const { tokenIn, tokenOut, amount } = req.query;
        
        // Validate inputs
        if (!tokenIn || !tokenOut || !amount) {
            return res.status(400).json({ 
                error: 'Missing required parameters. Please provide tokenIn, tokenOut, and amount.' 
            });
        }

        // Validate addresses
        if (!isValidAddress(tokenIn) || !isValidAddress(tokenOut)) {
            return res.status(400).json({ 
                error: 'Invalid token address provided.' 
            });
        }

        try {
            // Parse amount with proper error handling
            const parsedAmount = ethers.utils.parseUnits(amount, 18); // Assuming 18 decimals

            const bestPrice = await priceService.getBestPrice(
                tokenIn,
                tokenOut,
                parsedAmount.toString()
            );
            
            res.json(bestPrice);
        } catch (parseError) {
            return res.status(400).json({ 
                error: 'Invalid amount format. Please provide a valid number.' 
            });
        }
    } catch (error) {
        console.error('Price fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`DEX Aggregator running on port ${PORT}`);
});
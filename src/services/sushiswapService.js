const { ChainId, Token, Route, Pair } = require('@sushiswap/sdk');
const { Contract } = require('@ethersproject/contracts');
const { ERC20_ABI } = require('../utils/helpers');

class SushiswapService {
    constructor(provider) {
        this.provider = provider;
        this.chainId = ChainId.MAINNET;
    }

    async getTokenData(tokenAddress) {
        const contract = new Contract(tokenAddress, ERC20_ABI, this.provider);
        const [decimals, symbol, name] = await Promise.all([
            contract.decimals(),
            contract.symbol(),
            contract.name()
        ]);
        return { decimals, symbol, name };
    }

    async getPrice(tokenInAddress, tokenOutAddress, amountIn) {
        try {
            // Get token details
            const tokenInData = await this.getTokenData(tokenInAddress);
            const tokenOutData = await this.getTokenData(tokenOutAddress);

            // Create token instances with fetched data
            const tokenIn = new Token(
                this.chainId,
                tokenInAddress,
                tokenInData.decimals,
                tokenInData.symbol,
                tokenInData.name
            );

            const tokenOut = new Token(
                this.chainId,
                tokenOutAddress,
                tokenOutData.decimals,
                tokenOutData.symbol,
                tokenOutData.name
            );

            const pair = await Pair.fetchData(
                tokenIn,
                tokenOut,
                this.provider
            );

            const route = new Route([pair], tokenIn);
            
            return {
                price: parseFloat(route.midPrice.toSignificant(6)),
                path: [tokenIn.address, tokenOut.address]
            };
        } catch (error) {
            console.error('Sushiswap getPrice error:', error);
            return null;
        }
    }
}

module.exports = SushiswapService;
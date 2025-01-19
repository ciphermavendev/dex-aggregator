const { ChainId, Token, Fetcher, Route, WETH, Trade, TokenAmount } = require('@uniswap/sdk');
const { Contract } = require('@ethersproject/contracts');
const { ERC20_ABI } = require('../utils/helpers');

class UniswapService {
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

            // Handle WETH pairs specially
            const inputIsWETH = tokenInAddress.toLowerCase() === WETH[this.chainId].address.toLowerCase();
            const outputIsWETH = tokenOutAddress.toLowerCase() === WETH[this.chainId].address.toLowerCase();

            let pair;
            if (inputIsWETH || outputIsWETH) {
                const nonWETHToken = inputIsWETH ? tokenOut : tokenIn;
                pair = await Fetcher.fetchPairData(nonWETHToken, WETH[this.chainId], this.provider);
            } else {
                pair = await Fetcher.fetchPairData(tokenIn, tokenOut, this.provider);
            }

            const route = new Route([pair], tokenIn);
            const trade = new Trade(
                route,
                new TokenAmount(tokenIn, amountIn),
                Trade.EXACT_INPUT
            );

            return {
                price: parseFloat(trade.executionPrice.toSignificant(6)),
                priceImpact: parseFloat(trade.priceImpact.toSignificant(2)),
                path: route.path.map(token => token.address)
            };
        } catch (error) {
            console.error('Uniswap getPrice error:', error);
            return null;
        }
    }
}

module.exports = UniswapService;
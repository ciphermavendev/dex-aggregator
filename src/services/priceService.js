const { DEX_PROTOCOLS } = require('../config/constants');
const UniswapService = require('./uniswapService');
const SushiswapService = require('./sushiswapService');

class PriceService {
    constructor(provider) {
        if (!provider) {
            throw new Error('Provider is required for PriceService');
        }
        
        // Initialize protocol services with the provider
        this.protocols = {
            [DEX_PROTOCOLS.UNISWAP]: new UniswapService(provider),
            [DEX_PROTOCOLS.SUSHISWAP]: new SushiswapService(provider)
        };
    }

    async getBestPrice(tokenIn, tokenOut, amount) {
        console.log('Getting prices for:', {
            tokenIn,
            tokenOut,
            amount: amount.toString()
        });

        const prices = await Promise.all(
            Object.values(DEX_PROTOCOLS).map(async (protocol) => {
                try {
                    console.log(`Fetching price from ${protocol}...`);
                    const price = await this.protocols[protocol].getPrice(
                        tokenIn,
                        tokenOut,
                        amount
                    );
                    console.log(`${protocol} price result:`, price);
                    return { protocol, price: price ? price.price : 0 };
                } catch (error) {
                    console.error(`Error fetching price from ${protocol}:`, error);
                    return { protocol, price: 0 };
                }
            })
        );

        const bestPrice = prices.reduce((best, current) => {
            return current.price > best.price ? current : best;
        }, { protocol: '', price: 0 });

        console.log('Best price result:', bestPrice);
        return bestPrice;
    }
}

module.exports = PriceService;
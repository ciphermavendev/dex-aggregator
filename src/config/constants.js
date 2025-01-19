const NETWORKS = {
    ETHEREUM: {
        chainId: 1,
        rpcUrl: process.env.ETH_RPC_URL,
        name: 'Ethereum Mainnet'
    }
};

const DEX_PROTOCOLS = {
    UNISWAP: 'Uniswap',
    SUSHISWAP: 'SushiSwap'
};

module.exports = {
    NETWORKS,
    DEX_PROTOCOLS
};
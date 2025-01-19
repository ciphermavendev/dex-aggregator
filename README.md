# DEX Aggregator

A decentralized exchange (DEX) aggregator service that finds the best swap prices across multiple DEXes including Uniswap and SushiSwap.

## Features

- Price comparison across multiple DEX protocols
- Best price routing
- Gas price estimation
- Support for ERC20 tokens
- Transaction formatting and validation
- Slippage protection
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Ethereum node access (Infura, Alchemy, or local node)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dex-aggregator.git
cd dex-aggregator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:
```env
ETH_RPC_URL=your_ethereum_node_url
PORT=3000
```

## Usage

### Starting the Server

Development mode with hot reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### API Endpoints

#### Get Best Price
```
GET /api/price
```

Query Parameters:
- `tokenIn`: Input token address
- `tokenOut`: Output token address
- `amount`: Amount of input token

Example Response:
```json
{
  "protocol": "Uniswap",
  "price": "1.5",
  "priceImpact": "0.5%",
  "estimatedGas": "21000"
}
```

## Utility Functions

The project includes several utility functions for token handling:

- `isValidAddress`: Validates Ethereum addresses
- `formatAmount`: Formats token amounts with proper decimals
- `getTokenInfo`: Fetches ERC20 token information
- `calculatePriceImpact`: Calculates swap price impact
- `calculateSlippageAmount`: Adjusts amounts for slippage
- `sortTokens`: Sorts token addresses for consistent ordering

## Project Structure

```
├── src/
│   ├── config/
│   │   └── constants.js
│   ├── services/
│   │   ├── priceService.js
│   │   ├── sushiswapService.js
│   │   └── uniswapService.js
│   ├── utils/
│   │   └── web3.js
│   └── index.js
├── .env
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Dependencies

- ethers.js: Ethereum web3 library
- @uniswap/sdk: Uniswap SDK for price calculations
- @sushiswap/sdk: SushiSwap SDK for price calculations
- express: Web server framework
- dotenv: Environment variable management

## Disclaimer

This software is provided "as is", without warranty of any kind. Use at your own risk.
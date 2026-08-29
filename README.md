# Crypto Wallet Checker

A small Telegram bot that checks the native ETH balance of an Ethereum wallet and provides an Etherscan link for further inspection.

## What changed in 1.1.0

- Telegram and Etherscan credentials are loaded from environment variables instead of source code.
- Ethereum addresses are validated before making an API request.
- Uses Etherscan API V2 with an explicit Ethereum mainnet chain ID.
- Checks the API response before treating the result as a balance.
- Uses `BigInt` to avoid precision loss when converting wei to ETH.
- Adds an HTTP timeout and Telegram polling error handling.
- Updated dependencies and added a JavaScript syntax check.

## Requirements

- Node.js 18+
- A Telegram bot token
- An Etherscan API key

## Installation

```bash
git clone https://github.com/harshitethic/crypto-wallet-checker.git
cd crypto-wallet-checker
npm install
```

Set the required environment variables.

### Linux/macOS

```bash
export TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
export ETHERSCAN_API_KEY="your-etherscan-api-key"
```

### Windows PowerShell

```powershell
$env:TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
$env:ETHERSCAN_API_KEY="your-etherscan-api-key"
```

Never commit either credential to the repository.

## Run

```bash
npm start
```

## Check syntax

```bash
npm run check
```

## Usage

- `/start` - Start the bot
- `/help` - Show available commands
- `/scan <wallet address>` - Fetch the ETH balance for an Ethereum mainnet address

Example:

```text
/scan 0x0000000000000000000000000000000000000000
```

## Security notes

This bot only needs a public wallet address. **Never send a private key or seed phrase to the bot.**

The Etherscan API key and Telegram bot token must be supplied through environment variables and should be stored securely in production.

## License

MIT

# Crypto Wallet Checker

Crypto Wallet Checker is a Telegram bot that allows you to fetch the balance of Ethereum wallets and view token holdings using the Etherscan API.

## Installation

1. Clone the repository:

   <code> git clone https://github.com/harshitethic/crypto-wallet-checker.git
   </code>

2. Install dependencies:

   <code>cd crypto-wallet-checker
   npm install
   </code>

3. Set up your Telegram bot:

   - Create a new Telegram bot by following the instructions <a href="https://core.telegram.org/bots#creating-a-new-bot">here</a>.
   - Replace <code>'YOUR_TELEGRAM_BOT_TOKEN'</code> in <code>index.js</code> with your actual Telegram bot token.

4. Run the bot:

   <code>node index.js</code>

## Usage

1. Start the bot by sending the <code>/start</code> command in your Telegram chat.

2. Use the following commands to interact with the bot:

   - <code>/start</code> - Start the bot
   - <code>/help</code> - Show available commands
   - <code>/scan {wallet address}</code> - Fetch the balance for a wallet address

3. The bot will provide you with the wallet balance in ETH and a button to view token holdings on etherscan.io.

## Credits

Crypto Wallet Checker is developed by <a href="https://github.com/harshitethic">Harshit Sharma</a>. It utilizes the following libraries:

- <a href="https://www.npmjs.com/package/node-telegram-bot-api">node-telegram-bot-api</a>
- <a href="https://www.npmjs.com/package/axios">axios</a>

## License

This project is licensed under the <a href="LICENSE">MIT License</a>.


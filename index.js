const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const etherscanApiUrl = 'https://api.etherscan.io/v2/api';

if (!botToken) {
    throw new Error('Missing TELEGRAM_BOT_TOKEN environment variable.');
}

if (!etherscanApiKey) {
    throw new Error('Missing ETHERSCAN_API_KEY environment variable.');
}

const bot = new TelegramBot(botToken, { polling: true });

const isValidEthereumAddress = (address) => /^0x[a-fA-F0-9]{40}$/.test(address);

const formatEthBalance = (wei) => {
    const value = BigInt(wei);
    const whole = value / 1000000000000000000n;
    const fraction = (value % 1000000000000000000n).toString().padStart(18, '0').replace(/0+$/, '');
    return fraction ? `${whole}.${fraction}` : whole.toString();
};

bot.onText(/^\/start(?:@\w+)?$/, async (msg) => {
    const chatId = msg.chat.id;
    const imageCaption = 'Welcome to the Ethereum Balance Bot!\n/help - Show available commands';

    try {
        await bot.sendPhoto(chatId, 'https://harshitethic.in/eth.jpg', {
            caption: imageCaption
        });
    } catch (error) {
        await bot.sendMessage(chatId, imageCaption);
    }
});

bot.onText(/^\/help(?:@\w+)?$/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        'Here are the available commands:\n' +
        '/start - Start the bot\n' +
        '/help - Show available commands\n' +
        '/scan <wallet address> - Fetch the ETH balance for an Ethereum wallet'
    );
});

bot.onText(/^\/scan(?:@\w+)?\s+(.+)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const walletAddress = match[1].trim();

    if (!isValidEthereumAddress(walletAddress)) {
        await bot.sendMessage(
            chatId,
            '❌ Invalid Ethereum address. Please provide a 42-character address starting with 0x.'
        );
        return;
    }

    try {
        const response = await axios.get(etherscanApiUrl, {
            params: {
                chainid: 1,
                module: 'account',
                action: 'balance',
                address: walletAddress,
                tag: 'latest',
                apikey: etherscanApiKey
            },
            timeout: 10000
        });

        const data = response.data;

        if (data.status !== '1' || !/^\d+$/.test(String(data.result))) {
            throw new Error(data.message || 'Etherscan returned an invalid response.');
        }

        const balanceInEth = formatEthBalance(data.result);
        const etherscanLink = `https://etherscan.io/address/${walletAddress}#tokentxns`;

        await bot.sendMessage(
            chatId,
            `🔍 Wallet Address: ${walletAddress}\n\n💰 Balance: ${balanceInEth} ETH`
        );

        await bot.sendMessage(chatId, 'Click the button below to view the wallet on Etherscan:', {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: 'View on Etherscan',
                        url: etherscanLink
                    }
                ]]
            }
        });
    } catch (error) {
        console.error('Wallet balance lookup failed:', error.message);
        await bot.sendMessage(
            chatId,
            '❌ Unable to fetch that wallet balance right now. Please verify the address and try again later.'
        );
    }
});

bot.on('polling_error', (error) => {
    console.error('Telegram polling error:', error.message);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram bot token
const botToken = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(botToken, {
    polling: true
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const imageCaption = 'Welcome to the Etherscan Balance Bot!\n/help - Show available commands';

    // Replace 'https://harshitethic.in/eth.jpg' with the actual image URL
    bot.sendPhoto(chatId, 'https://harshitethic.in/eth.jpg', {
        caption: imageCaption
    });
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        `Here are the available commands:
/start - Start the bot
/help - Show available commands
/scan {wallet address} - Fetch the balance for a wallet address`
    );
});

bot.onText(/\/scan (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const walletAddress = match[1].trim();

    try {
        const response = await axios.get(`https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}`);
        const balance = response.data.result;
        const balanceInEth = balance / 1e18;

        bot.sendMessage(chatId, `🔍 Wallet Address: ${walletAddress}\n\n💰 Balance: ${balanceInEth} ETH`);

        // Generate the etherscan.io tokenholdings link
        const etherscanLink = 'https://etherscan.io/tokenholdings?a=' + walletAddress;

        // Create the button and link markup
        const inlineKeyboard = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'View Token Holdings',
                            url: etherscanLink
                        }
                    ]
                ]
            }
        };

        bot.sendMessage(chatId, 'Click the button below to view your token holdings:', inlineKeyboard);
    } catch (error) {
        bot.sendMessage(chatId, '❌ An error occurred while fetching the balance. Please try again later.');
    }
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
});

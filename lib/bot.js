'use strict';
const {errorCode} = require('./errors');
const {isValidEthereumAddress} = require('./ethereum');
const {createBalanceLookup} = require('./balance');

function registerBot({ bot, http, apiKey, username, logger = console }) {
    function onText(pattern, handler) {
        bot.onText(pattern, async (...args) => {
            const addressed = /^\/\w+@([A-Za-z0-9_]+)/.exec(args[0].text || '');
            if (addressed && (!username || addressed[1].toLowerCase() !== username.toLowerCase())) return;
            try { await handler(...args); }
            catch (error) { logger.error('Telegram command failed:', errorCode(error)); }
        });
    }
    const lookup = createBalanceLookup({http, apiKey});
    onText(/^\/start(?:@\w+)?\s*$/i, async (msg) => {
        const caption = 'Welcome to the Ethereum Balance Bot!\n/help - Show available commands';
        try {
            await bot.sendPhoto(msg.chat.id, 'https://harshitethic.in/eth.jpg', {caption});
        } catch {
            await bot.sendMessage(msg.chat.id, caption);
        }
    });
    onText(/^\/help(?:@\w+)?\s*$/i, async (msg) => {
        await bot.sendMessage(msg.chat.id, 'Here are the available commands:\n' +
            '/start - Start the bot\n/help - Show available commands\n' +
            '/scan <wallet address> - Fetch the ETH balance for an Ethereum wallet');
    });
    onText(/^\/scan(?:@\w+)?\s*$/i, async (msg) => {
        await bot.sendMessage(msg.chat.id, 'Usage: /scan 0xYourEthereumWalletAddress');
    });
    onText(/^\/scan(?:@\w+)?\s+(\S[\s\S]*)$/i, async (msg, match) => {
        const walletAddress = match[1].trim();
        if (!isValidEthereumAddress(walletAddress)) {
            await bot.sendMessage(msg.chat.id,
                '❌ Invalid Ethereum address. Please provide a 42-character address starting with 0x.');
            return;
        }
        try {
            const balance = await lookup(walletAddress);
            await bot.sendMessage(msg.chat.id,
                `🔍 Wallet Address: ${walletAddress}\n\n💰 Balance: ${balance} ETH`, {
                    reply_markup: {inline_keyboard: [[{text: 'View on Etherscan',
                        url: `https://etherscan.io/address/${walletAddress}`}]]}
                });
        } catch (error) {
            logger.error('Wallet balance lookup failed:', errorCode(error));
            await bot.sendMessage(msg.chat.id,
                '❌ Unable to fetch that wallet balance right now. Please verify the address and try again later.');
        }
    });
    bot.on('polling_error', (error) => logger.error('Telegram polling error:', errorCode(error)));
    let shutdownPromise;
    return {
        shutdown() {
            if (!shutdownPromise) {
                lookup.close();
                shutdownPromise = Promise.resolve().then(() => bot.stopPolling());
            }
            return shutdownPromise;
        }
    };
}
module.exports = {registerBot};

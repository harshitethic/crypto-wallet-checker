'use strict';
const {registerBot} = require('./lib/bot');

function start(env = process.env) {
    const botToken = env.TELEGRAM_BOT_TOKEN;
    const apiKey = env.ETHERSCAN_API_KEY;
    if (!botToken) throw new Error('Missing TELEGRAM_BOT_TOKEN environment variable.');
    if (!apiKey) throw new Error('Missing ETHERSCAN_API_KEY environment variable.');
    const TelegramBot = require('node-telegram-bot-api');
    const http = require('axios');
    const bot = new TelegramBot(botToken, {polling: true});
    const app = registerBot({bot, http, apiKey});
    const stop = () => app.shutdown().catch((error) => {
        console.error('Failed to stop polling:', error.message);
        process.exitCode = 1;
    });
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
    return app;
}
if (require.main === module) start();
module.exports = {start};

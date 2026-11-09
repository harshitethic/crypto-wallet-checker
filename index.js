'use strict';
const {errorCode} = require('./lib/errors');
const {registerBot} = require('./lib/bot');
const {loadConfig} = require('./lib/config');

async function start(env = process.env) {
    const {botToken, apiKey} = loadConfig(env);
    const TelegramBot = require('node-telegram-bot-api');
    const http = require('axios');
    const bot = new TelegramBot(botToken, {polling: false});
    const {username} = await bot.getMe();
    const app = registerBot({bot, http, apiKey, username});
    const stop = () => app.shutdown().catch((error) => {
        console.error('Failed to stop polling:', errorCode(error));
        process.exitCode = 1;
    });
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
    await bot.startPolling();
    return app;
}
if (require.main === module) start().catch((error) => {
    console.error('Bot startup failed:', errorCode(error));
    process.exitCode = 1;
});
module.exports = {start};

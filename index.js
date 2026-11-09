'use strict';
const {errorCode} = require('./lib/errors');
const {registerBot} = require('./lib/bot');
const {loadConfig} = require('./lib/config');

function start(env = process.env) {
    const {botToken, apiKey} = loadConfig(env);
    const TelegramBot = require('node-telegram-bot-api');
    const http = require('axios');
    const bot = new TelegramBot(botToken, {polling: true});
    const app = registerBot({bot, http, apiKey});
    const stop = () => app.shutdown().catch((error) => {
        console.error('Failed to stop polling:', errorCode(error));
        process.exitCode = 1;
    });
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
    return app;
}
if (require.main === module) start();
module.exports = {start};

'use strict';
function loadConfig(env) {
    function required(name) {
        const value = env[name];
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error(`Missing ${name} environment variable.`);
        }
        return value.trim();
    }
    return {botToken: required('TELEGRAM_BOT_TOKEN'), apiKey: required('ETHERSCAN_API_KEY')};
}
module.exports = {loadConfig};

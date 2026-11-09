'use strict';
const {parseWeiBalance, formatEthBalance} = require('./ethereum');
function createBalanceLookup({http, apiKey, maxConcurrent = 4}) {
    if (!Number.isInteger(maxConcurrent) || maxConcurrent < 1 || maxConcurrent > 100) {
        throw new RangeError('maxConcurrent must be an integer from 1 to 100');
    }
    const pending = new Map();
    return function lookup(address) {
        const key = address.toLowerCase();
        if (pending.has(key)) return pending.get(key);
        if (pending.size >= maxConcurrent) return Promise.reject(new Error('Balance lookup capacity reached'));
        const request = Promise.resolve().then(async () => {
            const response = await http.get('https://api.etherscan.io/v2/api', {
                params: {chainid: 1, module: 'account', action: 'balance',
                    address, tag: 'latest', apikey: apiKey}, timeout: 10000
            });
            return formatEthBalance(parseWeiBalance(response.data));
        }).finally(() => pending.delete(key));
        pending.set(key, request);
        return request;
    };
}
module.exports = {createBalanceLookup};

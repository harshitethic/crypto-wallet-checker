'use strict';
const {parseWeiBalance, formatEthBalance} = require('./ethereum');
function createBalanceLookup({http, apiKey, maxConcurrent = 4}) {
    if (!Number.isInteger(maxConcurrent) || maxConcurrent < 1 || maxConcurrent > 100) {
        throw new RangeError('maxConcurrent must be an integer from 1 to 100');
    }
    const pending = new Map();
    const controller = new AbortController();
    function lookup(address) {
        if (controller.signal.aborted) return Promise.reject(new Error("Balance lookup stopped"));
        const key = address.toLowerCase();
        if (pending.has(key)) return pending.get(key);
        if (pending.size >= maxConcurrent) return Promise.reject(new Error('Balance lookup capacity reached'));
        const request = Promise.resolve().then(async () => {
            const response = await http.get('https://api.etherscan.io/v2/api', {
                params: {chainid: 1, module: 'account', action: 'balance',
                    address, tag: 'latest', apikey: apiKey}, timeout: 10000,
                maxContentLength: 64 * 1024, maxRedirects: 0, signal: controller.signal
            });
            return formatEthBalance(parseWeiBalance(response.data));
        }).finally(() => pending.delete(key));
        pending.set(key, request);
        return request;
    }
    lookup.close = () => controller.abort();
    return lookup;
}
module.exports = {createBalanceLookup};

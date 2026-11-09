'use strict';
const {parseWeiBalance, formatEthBalance} = require('./ethereum');
function createBalanceLookup({http, apiKey}) {
    const pending = new Map();
    return function lookup(address) {
        const key = address.toLowerCase();
        if (pending.has(key)) return pending.get(key);
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

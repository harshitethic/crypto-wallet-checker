'use strict';

const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;
const WEI_PER_ETH = 1000000000000000000n;

function isValidEthereumAddress(address) {
    return typeof address === 'string' && ADDRESS_PATTERN.test(address);
}

function parseWeiBalance(data) {
    if (!data || data.status !== '1' || typeof data.result !== 'string' ||
        !/^\d+$/.test(data.result)) {
        throw new Error('Etherscan returned an invalid balance response.');
    }
    return data.result;
}

function formatEthBalance(wei) {
    if (typeof wei !== 'string' || !/^\d+$/.test(wei)) {
        throw new TypeError('wei must be a non-negative decimal string');
    }
    const value = BigInt(wei);
    const whole = value / WEI_PER_ETH;
    const fraction = (value % WEI_PER_ETH).toString()
        .padStart(18, '0').replace(/0+$/, '');
    return fraction ? `${whole}.${fraction}` : whole.toString();
}

module.exports = { isValidEthereumAddress, parseWeiBalance, formatEthBalance };

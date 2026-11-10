'use strict';

const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;
const MAX_UINT256 = (1n << 256n) - 1n;
function isWei(value) {
    return typeof value === 'string' && value.length <= 78 && /^\d+$/.test(value) && BigInt(value) <= MAX_UINT256;
}

const WEI_PER_ETH = 1000000000000000000n;

function isValidEthereumAddress(address) {
    return typeof address === 'string' && ADDRESS_PATTERN.test(address);
}

function parseWeiBalance(data) {
    if (!data || data.status !== '1' || !isWei(data.result)) {
        throw new Error('Etherscan returned an invalid balance response.');
    }
    return data.result;
}

function formatEthBalance(wei) {
    if (!isWei(wei)) {
        throw new TypeError('wei must be a non-negative decimal string');
    }
    const value = BigInt(wei);
    const whole = value / WEI_PER_ETH;
    const fraction = (value % WEI_PER_ETH).toString()
        .padStart(18, '0').replace(/0+$/, '');
    return fraction ? `${whole}.${fraction}` : whole.toString();
}

module.exports = { isValidEthereumAddress, parseWeiBalance, formatEthBalance };

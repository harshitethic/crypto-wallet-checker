'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { isValidEthereumAddress, parseWeiBalance, formatEthBalance } = require('../lib/ethereum');

test('accepts canonical 20-byte hex Ethereum addresses', () => {
    assert.equal(isValidEthereumAddress('0x' + 'a'.repeat(40)), true);
    assert.equal(isValidEthereumAddress('0x' + 'Ab'.repeat(20)), true);
    assert.equal(isValidEthereumAddress('0x' + '0'.repeat(40)), true);
});

test('rejects missing, truncated, padded, and unsafe address values', () => {
    for (const invalid of [undefined, null, 12, {}, '', '0x' + 'a'.repeat(39),
        '0x' + 'a'.repeat(41), '0X' + 'a'.repeat(40), ' 0x' + 'a'.repeat(40),
        '0x' + 'g'.repeat(40), '0x' + 'a'.repeat(40) + '\n']) {
        assert.equal(isValidEthereumAddress(invalid), false);
    }
});

test('parses only successful Etherscan V2 decimal wei strings', () => {
    assert.equal(parseWeiBalance({ status: '1', result: '0' }), '0');
    assert.equal(parseWeiBalance({ status: '1', result: '1000000000000000000' }),
        '1000000000000000000');
});

test('rejects Etherscan failures and malformed balances without coercion', () => {
    for (const invalid of [undefined, null, {}, { status: '0', result: '1' },
        { status: 1, result: '1' }, { status: '1', result: 1 },
        { status: '1', result: '1e18' }, { status: '1', result: '-1' },
        { status: '1', result: '' }, { status: '1', result: '1.0' }]) {
        assert.throws(() => parseWeiBalance(invalid), /invalid balance/);
    }
});

test('converts wei to exact ETH with no floating-point rounding', () => {
    assert.equal(formatEthBalance('0'), '0');
    assert.equal(formatEthBalance('1'), '0.000000000000000001');
    assert.equal(formatEthBalance('1000000000000000000'), '1');
    assert.equal(formatEthBalance('1234567890123456789'), '1.234567890123456789');
    assert.equal(formatEthBalance('2000000000000000000000000000000000000'),
        '2000000000000000000');
});

test('rejects malformed or negative wei inputs before BigInt conversion', () => {
    for (const value of [1, -1, NaN, null, undefined, '', '-1', '1e18', '2.5',
        '0x1', ' 1', '1 ']) {
        assert.throws(() => formatEthBalance(value), TypeError);
    }
});

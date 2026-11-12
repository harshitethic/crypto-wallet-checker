'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createBalanceLookup } = require('../lib/balance');

test('shutdown before dispatch prevents the scheduled HTTP request', async () => {
    let requests = 0;
    const lookup = createBalanceLookup({
        apiKey: 'fixture',
        http: { get: async () => { requests++; return {data: {status: '1', result: '0'}}; } }
    });
    const pending = lookup('0xabc');
    lookup.close();
    await assert.rejects(pending, (error) => error.name === 'AbortError');
    assert.equal(requests, 0);
});

test('shutdown rejects a late successful response from a non-cooperative HTTP client', async () => {
    let resolveResponse;
    const lookup = createBalanceLookup({
        apiKey: 'fixture',
        http: { get: () => new Promise(resolve => { resolveResponse = resolve; }) }
    });
    const pending = lookup('0xabc');
    await Promise.resolve();
    lookup.close();
    resolveResponse({ data: { status: '1', result: '1000000000000000000' } });
    await assert.rejects(pending, (error) => error.name === 'AbortError');
});

test('a completed lookup still succeeds without shutdown', async () => {
    const lookup = createBalanceLookup({
        apiKey: 'fixture',
        http: { get: async () => ({ data: { status: '1', result: '1' } }) }
    });
    assert.equal(await lookup('0xabc'), '0.000000000000000001');
    lookup.close();
});

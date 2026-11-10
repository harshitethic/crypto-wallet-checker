'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {loadConfig}=require('../lib/config');
test('whitespace credentials fail without including their values',()=>{
  for(const invalid of ['', '  ', null, 42]){
    assert.throws(()=>loadConfig({TELEGRAM_BOT_TOKEN:invalid,ETHERSCAN_API_KEY:'secret'}),/TELEGRAM_BOT_TOKEN/);
    assert.throws(()=>loadConfig({TELEGRAM_BOT_TOKEN:'token',ETHERSCAN_API_KEY:invalid}),/ETHERSCAN_API_KEY/);
  }
  assert.deepEqual(loadConfig({TELEGRAM_BOT_TOKEN:' token ',ETHERSCAN_API_KEY:' key '}),{botToken:'token',apiKey:'key'});
});

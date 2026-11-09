'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {parseWeiBalance,formatEthBalance}=require('../lib/ethereum');
test('rejects impossible and unbounded balances before BigInt formatting',()=>{
  for(const value of ['9'.repeat(10000), (1n<<256n).toString()]){
    assert.throws(()=>parseWeiBalance({status:'1',result:value}));assert.throws(()=>formatEthBalance(value));
  }
  const max=((1n<<256n)-1n).toString();assert.equal(parseWeiBalance({status:'1',result:max}),max);
  assert.ok(formatEthBalance(max));
});

'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {createBalanceLookup}=require('../lib/balance');
test('simultaneous address lookups share only the in-flight request',async()=>{
  let resolve,calls=0;
  const lookup=createBalanceLookup({apiKey:'fixture',http:{get(){calls++;return new Promise(r=>{resolve=r;});}}});
  const a=lookup('0xabc'),b=lookup('0xABC');await Promise.resolve();assert.equal(calls,1);
  resolve({data:{status:'1',result:'0'}});assert.deepEqual(await Promise.all([a,b]),['0','0']);
  const c=lookup('0xabc');await Promise.resolve();assert.equal(calls,2);resolve({data:{status:'1',result:'1'}});await c;
});
test('failed requests are evicted so retries can succeed',async()=>{
  let calls=0;const lookup=createBalanceLookup({apiKey:'fixture',http:{async get(){if(++calls===1)throw Error('offline');return {data:{status:'1',result:'0'}};}}});
  await assert.rejects(lookup('a'));assert.equal(await lookup('a'),'0');assert.equal(calls,2);
});

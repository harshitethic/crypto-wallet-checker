'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {createBalanceLookup}=require('../lib/balance');
test('closing the client aborts active requests and rejects new work',async()=>{
  let signal;const lookup=createBalanceLookup({http:{get(url,options){signal=options.signal;return new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('aborted'))));}}});
  const pending=lookup('a');await Promise.resolve();assert.equal(signal.aborted,false);
  lookup.close();await assert.rejects(pending,/aborted/);assert.equal(signal.aborted,true);
  await assert.rejects(lookup('b'),/stopped/);lookup.close();
});

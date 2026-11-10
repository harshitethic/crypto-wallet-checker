'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {createBalanceLookup}=require('../lib/balance');
test('distinct requests are bounded and capacity recovers after completion',async()=>{
  let resolve;const lookup=createBalanceLookup({maxConcurrent:1,http:{get(){return new Promise(r=>{resolve=r;});}}});
  const first=lookup('a');await Promise.resolve();await assert.rejects(lookup('b'),/capacity/);
  assert.equal(lookup('A'),first);resolve({data:{status:'1',result:'0'}});await first;
  const next=lookup('b');await Promise.resolve();resolve({data:{status:'1',result:'0'}});await next;
});

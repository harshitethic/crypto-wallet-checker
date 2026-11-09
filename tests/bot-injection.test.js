'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {registerBot}=require('../lib/bot');
const {fakeBot,address}=require('./helpers');

test('entrypoint imports without credentials or polling side effects',()=>{
  assert.equal(typeof require('../index').start,'function');
});
test('injected client receives a validated V2 balance request',async()=>{
  const bot=fakeBot();const requests=[];
  registerBot({bot,apiKey:'fixture',http:{async get(...args){requests.push(args);return {data:{status:'1',result:'1'}};}}});
  await bot.dispatch('/scan '+address);
  assert.equal(requests.length,1);assert.equal(requests[0][1].params.chainid,1);
  assert.match(bot.sent[0][1],/0.000000000000000001 ETH/);
  await bot.dispatch('/scan bad');assert.equal(requests.length,1);
});

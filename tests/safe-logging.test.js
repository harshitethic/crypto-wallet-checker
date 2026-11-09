'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {registerBot}=require('../lib/bot');
const {fakeBot,address}=require('./helpers');

test('upstream credentials never appear in application logs',async()=>{
  const bot=fakeBot();const logs=[];
  registerBot({bot,apiKey:'fixture',logger:{error(...args){logs.push(args);}},http:{async get(){throw new Error('https://api.invalid/?apikey=SECRET');}}});
  await bot.dispatch('/scan '+address);
  assert.equal(JSON.stringify(logs).includes('SECRET'),false);
  assert.ok(logs.length);
});

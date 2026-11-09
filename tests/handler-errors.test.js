'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {registerBot}=require('../lib/bot');
const {fakeBot,address}=require('./helpers');

test('every failing Telegram reply is contained at the handler boundary',async()=>{
  for(const text of ['/help','/start','/scan','/scan bad','/scan '+address]) {
    const bot=fakeBot();let errors=0;
    bot.sendPhoto=bot.sendMessage=async()=>{throw new Error('offline');};
    registerBot({bot,apiKey:'fixture',logger:{error(){errors++;}},http:{async get(){throw new Error('offline');}}});
    await assert.doesNotReject(bot.dispatch(text));assert.ok(errors>=1);
  }
});

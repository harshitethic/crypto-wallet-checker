'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {registerBot}=require('../lib/bot');
const {fakeBot,address}=require('./helpers');

test('commands for other bots are ignored and whitespace gets one response',async()=>{
  const bot=fakeBot();let requests=0;
  registerBot({bot,username:'WalletBot',apiKey:'fixture',http:{async get(){requests++;return {data:{status:'1',result:'0'}};}}});
  await bot.dispatch('/scan@OtherBot '+address);assert.equal(requests,0);assert.equal(bot.sent.length,0);
  await bot.dispatch('/scan@walletbot '+address);assert.equal(requests,1);
  const before=bot.sent.length;await bot.dispatch('/scan    ');assert.equal(bot.sent.length,before+1);
  await bot.dispatch('/scan '+address+'\nsecond');assert.match(bot.sent.at(-1)[1],/Invalid/);
  await bot.dispatch('/HELP  ');assert.match(bot.sent.at(-1)[1],/available commands/);
});

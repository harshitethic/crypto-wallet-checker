'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {registerBot}=require('../lib/bot');
const {fakeBot,address}=require('./helpers');

test('all shutdown callers await the same polling stop',async()=>{
  const bot=fakeBot();let finish,stops=0;
  bot.stopPolling=()=>{stops++;return new Promise(r=>{finish=r;});};
  const app=registerBot({bot,http:{},apiKey:'fixture'});
  const a=app.shutdown(),b=app.shutdown();assert.equal(a,b);await Promise.resolve();assert.equal(stops,1);
  let done=false;b.then(()=>{done=true;});await Promise.resolve();assert.equal(done,false);
  finish();await a;assert.equal(done,true);
});

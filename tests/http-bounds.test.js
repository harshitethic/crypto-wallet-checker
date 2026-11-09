'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {createBalanceLookup}=require('../lib/balance');
test('HTTP requests cannot follow redirects or buffer unlimited response bodies',async()=>{
  let options;const lookup=createBalanceLookup({apiKey:'fixture',http:{async get(url,opts){options=opts;return {data:{status:'1',result:'0'}};}}});
  await lookup('a');assert.equal(options.maxRedirects,0);assert.equal(options.maxContentLength,65536);assert.equal(options.timeout,10000);
});

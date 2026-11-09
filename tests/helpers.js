function fakeBot() {
  const handlers=[]; const sent=[];
  return {sent, onText(re,fn){handlers.push([re,fn]);}, on(){},
    async sendMessage(...args){sent.push(args);}, async sendPhoto(){},
    async stopPolling(){},
    async dispatch(text){
      for(const [re,fn] of handlers){const m=re.exec(text);if(m)await fn({text,chat:{id:1}},m);}
    }};
}
const address='0x'+'a'.repeat(40);

module.exports={fakeBot,address};

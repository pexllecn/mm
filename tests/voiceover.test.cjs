const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Player,TRACKS,locate,validate,normalize}=require('../igloo/assets/voiceover.js');

test('Every production narration cue fits the show and stays inside the recording',()=>{
  for(const track of Object.values(TRACKS))assert.equal(validate(track),true);
});

test('Seeking resolves original-speed speech, quiet gaps and exact cue boundaries',()=>{
  const cues=[{at:2,from:1,to:5,label:'One'},{at:10,from:7,to:12,label:'Two'}];
  assert.equal(locate(cues,1),null);
  assert.equal(locate(cues,2).position,1);
  assert.equal(locate(cues,4.5).position,3.5);
  assert.equal(locate(cues,6),null);
  assert.equal(locate(cues,10).index,1);
  assert.equal(locate(cues,12,2).position,7);
  assert.equal(locate(cues,8,-2).position,7);
  assert.equal(locate(cues,15),null);
});

test('Imported settings cannot introduce invalid voices, gains or timing values',()=>{
  assert.deepEqual(normalize({voice:'missing',volume:NaN,offset:Infinity,duck:'yes',duckLevel:-4}),
    {voice:'female',volume:.9,offset:0,duck:true,duckLevel:0});
  assert.equal(normalize({offset:100}).offset,1);
});

class Param {
  constructor(){this.value=1;}
  setValueAtTime(v){this.value=v;}
  linearRampToValueAtTime(v){this.value=v;}
  setTargetAtTime(v){this.value=v;}
  cancelScheduledValues(){}
}
class AudioContext {
  constructor(){this.currentTime=20;this.state='running';this.starts=[];this.stops=[];}
  createGain(){return {gain:new Param(),connect(){},disconnect(){}};}
  createBufferSource(){const ctx=this;return {connect(){},disconnect(){},start(...args){ctx.starts.push(args);},stop(...args){ctx.stops.push(args);}};}
  resume(){this.state='running';return Promise.resolve();}
}
function player(){
  const p=new Player({Context:AudioContext,storage:null,tracks:{
    female:{label:'Female',duration:20,cues:[{at:0,from:1,to:9,label:'Opening'},{at:12,from:12,to:18,label:'Finale'}]},
    male:{label:'Male',duration:20,cues:[{at:0,from:2,to:10,label:'Opening'},{at:12,from:14,to:20,label:'Finale'}]}
  }});
  p.context();p.buffers={female:{duration:20},male:{duration:20}};p.states={female:'ready',male:'ready'};
  return p;
}

test('Pause, seek, voice switch, silence, restart and mute follow one presentation clock',()=>{
  const p=player();p.update(3,true);
  assert.equal(p.status().position,4);assert.equal(p.status().speaking,true);
  assert.equal(p.duckGain,.24);
  p.ctx.currentTime+=1;p.update(4,true);assert.equal(p.ctx.starts.length,1);
  p.update(4,false);assert.equal(p.status().speaking,false);assert.equal(p.duckGain,1);
  p.ctx.currentTime+=10;p.update(4,true);assert.equal(p.status().position,5);
  p.update(13,true);assert.equal(p.status().position,13);
  p.configure({voice:'male'});assert.equal(p.status().position,15);assert.equal(p.status().voice,'male');
  p.configure({volume:0});assert.equal(p.duckGain,1);
  p.configure({volume:.9,duck:false});assert.equal(p.duckGain,1);
  p.configure({voice:'off'});assert.equal(p.status().speaking,false);
  p.configure({voice:'female'});p.update(9,true);assert.equal(p.status().speaking,false);
  p.update(0,true);assert.equal(p.status().position,1);
});

test('Audio clock drift is corrected and suspended audio does not play or duck music',()=>{
  const p=player();p.update(3,true);p.ctx.currentTime+=.5;p.update(3.1,true);
  assert.equal(p.ctx.starts.length,2);assert.ok(Math.abs(p.status().position-4.1)<1e-8);
  p.ctx.state='suspended';p.update(4,true);
  assert.equal(p.status().speaking,false);assert.equal(p.duckGain,1);
});

test('A recording failure is reported, and retry can recover without reloading the scene',async()=>{
  const p=player();p.buffers={};p.base='https://example.invalid/voiceover.js';
  p.ctx.decodeAudioData=async()=>({duration:20});
  p.fetcher=async()=>({ok:false,status:404});await p.prepare();
  assert.equal(p.states.female,'error');assert.match(p.errors.female,/404/);
  p.fetcher=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)});await p.prepare();
  assert.equal(p.states.female,'ready');assert.equal(p.states.male,'ready');
  p.update(3,true);assert.equal(p.status().speaking,true);
});

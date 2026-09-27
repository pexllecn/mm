const {test}=require('node:test');
const assert=require('node:assert/strict');
const {outputSize,FrameMeter,QualityGovernor}=require('../igloo/assets/runtime.js');

test('Retina output uses physical pixels and stays inside GPU and pixel limits',()=>{
  assert.deepEqual(outputSize(1920,1080,2),{width:3840,height:2160,scale:2});
  for(const [w,h,dpr,max] of [[7680,4320,2,16384],[12000,6000,3,8192],[1920,1080,1,1024]]){
    const s=outputSize(w,h,dpr,max);
    assert.ok(s.width*s.height<=33554432);assert.ok(s.width<=max&&s.height<=max);
    assert.ok(Math.abs(s.width/s.height-w/h)<.01);
  }
});
test('Frame measurements retain stalls instead of reporting a clamped artificial fps',()=>{
  const m=new FrameMeter(60);for(let i=0;i<59;i++)m.push(1000/60);m.push(500);
  assert.ok(m.read().fps<41);assert.equal(m.read().frames,60);
  for(let i=0;i<60;i++)m.push(1000/60);
  assert.ok(Math.abs(m.read().fps-60)<.001);assert.equal(m.read().missed,0);
  m.clear();assert.equal(m.read().frames,0);
});
test('Adaptive policy responds around 60 fps and avoids oscillating tiers',()=>{
  const q=new QualityGovernor(5,3),slow={fps:49,p95:28,gpuMs:20};
  assert.equal(q.decide(slow),3);assert.equal(q.decide(slow),2);
  for(let i=0;i<3;i++)assert.equal(q.decide(slow),2);
  assert.equal(q.decide(slow),1);
  for(let i=0;i<30;i++)q.decide(slow);
  assert.equal(q.index,0);
});
test('Upscaling requires sustained measured GPU headroom, not just a 60 Hz display',()=>{
  const q=new QualityGovernor(5,2);
  for(let i=0;i<40;i++)q.decide({fps:60,p95:17,gpuMs:null});
  assert.equal(q.index,2);
  for(let i=0;i<9;i++)q.decide({fps:60,p95:17,gpuMs:9});
  assert.equal(q.index,2);q.decide({fps:60,p95:17,gpuMs:9});assert.equal(q.index,3);
  for(let i=0;i<100;i++)q.decide({fps:60,p95:17,gpuMs:9});
  assert.equal(q.index,5);
});
test('The root and Igloo entry points stay identical apart from relative asset URLs',()=>{
  const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
  const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.equal(html.replaceAll('igloo/assets/','assets/'),fs.readFileSync(path.join(root,'igloo/9.html'),'utf8'));
  for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim())assert.doesNotThrow(()=>new vm.Script(m[1]));
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
});

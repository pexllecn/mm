const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const walls=require('../igloo/assets/topic-walls.js');
test('all eight ambitions get a distinct visible cue before the closing message',()=>{
 assert.equal(walls.topics.length,8);
 for(const t of walls.topics){
  const cue=walls.activeAt((t.t0+t.t1)/2);
  assert.equal(walls.topicFor(cue).id,t.id);
  assert.equal(walls.opacityAt((t.t0+t.t1)/2,cue),1);
  assert.ok(t.t1-t.t0>=7.5);
 }
 assert.equal(walls.activeAt(141).eb,'Ireland 2036');
 assert.equal(walls.topicFor(walls.activeAt(135)).id,'defence');
 assert.equal(walls.activeAt(150),null);
});
test('imported overlapping cues cannot hide Education and Defence',()=>{
 const cues=[{t0:114.5,t1:126,eb:'06 · Housing'},{t0:118,t1:129,eb:'07 · Education'},{t0:129,t1:139,eb:'08 · Defence'}];
 assert.equal(walls.topicFor(walls.activeAt(121,cues)).id,'education');
 assert.equal(walls.topicFor(walls.activeAt(130,cues)).id,'defence');
});
test('caption fades are bounded and safe on seeks',()=>{
 const c=walls.captions[3];
 for(const t of [0,c.t0,c.t0+.3,c.t1,c.t1+.3,162]){
  const a=walls.opacityAt(t,c);assert.ok(a>=0&&a<=1);
 }
 assert.equal(walls.opacityAt(c.t0,c),0);
 assert.equal(walls.opacityAt(c.t1+.6,c),0);
});
test('every supplied illustration resolves locally with source-page provenance',()=>{
 const dir=path.join(__dirname,'../igloo/assets/topics');
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'sources.json')));
 for(const t of walls.topics)for(const id of t.images){
  assert.ok(fs.statSync(path.join(dir,id+'.webp')).size>1000);
  assert.ok(manifest.images.find(x=>x.file===id+'.webp'));
 }
 assert.deepEqual(walls.topics.find(t=>t.id==='sustainability').images,['sustainability']);
 assert.equal(walls.topics.find(t=>t.id==='education').actions.length,3);
 assert.ok(walls.topics.every(t=>t.images.length>0));
});
test('venue calibration survives defaults, including image size and map fit',()=>{
 assert.equal(walls.defaults.lwSize,.62);assert.equal(walls.defaults.panSize,.86);
 assert.equal(walls.defaults.dx,-1.26);assert.equal(walls.defaults.panFlipY,1);
 assert.equal(walls.defaults.capOn,0);
});

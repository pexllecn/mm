/* CI smoke test: real production shaders and UI, small synthetic map fixtures.
   This validates functionality in software WebGL, not venue performance or geography. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const zlib=require('node:zlib');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'test-results');fs.mkdirSync(out,{recursive:true});
function crc32(buf){let c=-1;for(const b of buf){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^-1)>>>0;}
function chunk(type,data){const t=Buffer.from(type),head=Buffer.alloc(4),tail=Buffer.alloc(4);head.writeUInt32BE(data.length);tail.writeUInt32BE(crc32(Buffer.concat([t,data])));return Buffer.concat([head,t,data,tail]);}
function png(rgb){const h=Buffer.alloc(13);h.writeUInt32BE(256);h.writeUInt32BE(256,4);h[8]=8;h[9]=2;const rows=Buffer.alloc(256*(1+256*3));for(let y=0;y<256;y++)for(let x=0;x<256;x++)rgb(x,y).forEach((c,k)=>rows[y*769+1+x*3+k]=c);return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',h),chunk('IDAT',zlib.deflateSync(rows)),chunk('IEND',Buffer.alloc(0))]);}
const heightPNG=png(()=>[128,120,0]);
const imageryPNG=png((x,y)=>[40+(x>>4)%2*12,65+(y>>4)%2*12,37]);
const server=http.createServer((req,res)=>{
  const relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html';
  const file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
  let data=fs.readFileSync(file);
  if(file.endsWith('.html'))data=Buffer.from(data.toString().replace('const ELEV_Z = 10;','const ELEV_Z = 6;').replace('const FW = 2560,','const FW = 256,').replace(/z: (1[1-5]), px:/g,'z: 7, px:'));
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.mp3':'audio/mpeg'};
  res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});res.end(data);
});
(async()=>{
  await new Promise(r=>server.listen(8036,'127.0.0.1',r));
  const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/shader|WebGL|THREE|ReferenceError|TypeError/.test(m.text()))errors.push(m.text());});
    await page.route('**/three.min.js',route=>route.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.join(path.dirname(require.resolve('three')),'three.min.js'))}));
    await page.route('https://fonts.googleapis.com/**',route=>route.fulfill({contentType:'text/css',body:''}));
    await page.route('**/terrarium/**',route=>route.fulfill({contentType:'image/png',body:heightPNG}));
    await page.route('**/World_Imagery/**',route=>route.fulfill({contentType:'image/png',body:imageryPNG}));
    await page.goto('http://127.0.0.1:8036/?view=desk');
    await page.waitForFunction(()=>!document.querySelector('#start').disabled||document.querySelector('#load-note').classList.contains('err'),{},{timeout:180000});
    assert.equal(await page.locator('#start').isEnabled(),true,await page.locator('#load-note').textContent());
    await page.waitForFunction(()=>window.__ireland.metrics().narration.ready,{},{timeout:30000});
    await page.screenshot({path:path.join(out,'01-gate.png')});
    await page.getByRole('button',{name:'Enter the experience'}).click();
    await page.waitForFunction(()=>window.__ireland.metrics().renderedFrames>2);
    await page.getByRole('button',{name:'Pause the journey'}).click();
    await page.waitForTimeout(300);
    const paused=await page.evaluate(()=>window.__ireland.metrics());
    await page.waitForTimeout(350);
    const held=await page.evaluate(()=>window.__ireland.metrics());
    assert.equal(held.showTime,paused.showTime);assert.equal(held.renderedFrames,paused.renderedFrames);
    // Decode the actual supplied recordings and exercise the real audio clock.
    await page.locator('#b-voice').click();
    await page.locator('[data-pane="sound"] [data-voice="male"]').click();
    await page.waitForFunction(()=>window.__ireland.metrics().narration.ready);
    await page.evaluate(()=>window.__ireland.seek(94.5));
    await page.getByRole('button',{name:'Play the journey',exact:true}).click();
    await page.waitForFunction(()=>window.__ireland.metrics().narration.speaking);
    let narration=await page.evaluate(()=>window.__ireland.metrics().narration);
    assert.equal(narration.voice,'male');assert.equal(narration.cue,'Energy');assert.equal(narration.context,'running');
    assert.ok(Math.abs(narration.position-narration.expectedPosition)<.4,'Narration follows the show clock');
    assert.equal(narration.duckGain,.24);
    await page.locator('#v-duck').uncheck();
    assert.equal((await page.evaluate(()=>window.__ireland.metrics().narration)).duckGain,1);
    await page.locator('#v-duck').check();
    await page.locator('[data-pane="sound"] [data-voice="female"]').click();
    await page.waitForFunction(()=>window.__ireland.metrics().narration.voice==='female'&&window.__ireland.metrics().narration.speaking);
    narration=await page.evaluate(()=>window.__ireland.metrics().narration);
    assert.equal(narration.cue,'Energy');assert.ok(narration.position>=64.16);
    await page.getByRole('button',{name:'Pause the journey'}).click();
    assert.equal((await page.evaluate(()=>window.__ireland.metrics().narration)).speaking,false);
    await page.locator('#v-offset').evaluate(el=>{el.value='.5';el.dispatchEvent(new Event('input',{bubbles:true}));});
    assert.equal((await page.evaluate(()=>window.__ireland.metrics().narration)).settings.offset,.5);
    await page.screenshot({path:path.join(out,'06-voice-controls.png')});
    await page.locator('[data-pane="sound"] [data-voice="off"]').click();
    assert.equal((await page.evaluate(()=>window.__ireland.metrics().narration)).voice,'off');
    await page.locator('#voice-reset').click();
    await page.locator('#close-control').click();
    // Keyboard narration toggle works while transport retains focus.
    await page.locator('#b-play').focus();await page.keyboard.press('n');
    assert.equal((await page.evaluate(()=>window.__ireland.metrics().narration)).voice,'off');
    await page.keyboard.press('n');
    assert.equal((await page.evaluate(()=>window.__ireland.metrics().narration)).voice,'female');
    await page.locator('#b-restart').click();
    await page.waitForFunction(()=>window.__ireland.metrics().narration.speaking);
    assert.ok((await page.evaluate(()=>window.__ireland.metrics().narration)).position<5);
    await page.getByRole('button',{name:'Pause the journey'}).click();
    await page.locator('#b-chapters').click();
    await page.getByRole('button',{name:/05 The turn/}).click();
    await page.waitForTimeout(300);
    assert.ok((await page.evaluate(()=>window.__ireland.metrics())).showTime>=78);
    await page.locator('#close-chapters').click();
    await page.locator('#b-mode').click();await page.locator('#b-mode').click();
    await page.waitForTimeout(500);
    await page.screenshot({path:path.join(out,'02-packed-walls-floor.png')});
    await page.locator('#b-control').click();
    await page.locator('[data-tab="performance"]').click();
    await page.locator('#b-calibrate').click();
    await page.waitForTimeout(300);
    await page.screenshot({path:path.join(out,'03-calibration.png')});
    await page.locator('#b-calibrate').click();
    await page.locator('#close-control').click();
    await page.locator('#b-mode').click();
    await page.locator('#b-media').click();
    await page.locator('#file-s05').setInputFiles({name:'test-original.png',mimeType:'image/png',buffer:imageryPNG});
    await page.waitForFunction(()=>document.querySelector('#media-note').textContent.includes('Original file'));
    assert.equal(await page.locator('#slots').getByText('test-original.png',{exact:true}).count(),1);
    await page.locator('#close-media').click();
    await page.setViewportSize({width:390,height:844});
    await page.locator('#b-chapters').click();
    await page.screenshot({path:path.join(out,'04-mobile-chapters.png')});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.locator('#close-chapters').click();
    await page.locator('#b-voice').click();
    await page.screenshot({path:path.join(out,'07-mobile-voice.png')});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.locator('#close-control').click();
    await page.locator('#b-chapters').click();
    await page.setViewportSize({width:1280,height:800});
    await page.getByRole('button',{name:/10 Together/}).click();
    await page.locator('#close-chapters').click();
    await page.waitForTimeout(400);
    await page.screenshot({path:path.join(out,'05-finale.png')});
    const metrics=await page.evaluate(()=>window.__ireland.metrics());
    fs.writeFileSync(path.join(out,'smoke-results.json'),JSON.stringify({fixture:'Synthetic map tiles, reduced dataset, software WebGL. Not a venue FPS benchmark.',metrics,errors},null,2));
    assert.deepEqual(errors,[]);
    console.log('PASS: shader warm-up, playback, held pause, chapter seek, packed output, calibration, local media, mobile layout finale, both real narration recordings, audio clock sync, voice switching, ducking, offset, mute and restart.');
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});

/* Run with a built-in temporary static server:
   node tests/topic-walls.browser.cjs
   Optional existing server: IRELAND_TEST_URL=http://127.0.0.1:8036
   Requires Playwright + Chromium. Optional CHROMIUM_PATH and THREE_TEST_PATH.
   The route fixture skips external terrain loading, but runs the actual UI and shader. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright' : 'playwright');
let origin=process.env.IRELAND_TEST_URL;
(async()=>{
 let server;
 if(!origin){
  const root=path.resolve(__dirname,'..');
  server=require('node:http').createServer((req,res)=>{
   const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
   if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);res.end();return;}
   const mime={'.js':'application/javascript','.html':'text/html','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.mp3':'audio/mpeg'};
   res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));origin='http://127.0.0.1:'+server.address().port;
 }
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try {
  const page=await browser.newPage({viewport:{width:1500,height:600}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error' && /THREE|GL_INVALID|shader|WebGLProgram/.test(m.text()))errors.push(m.text());});
  if(process.env.THREE_TEST_PATH)await page.route('**/three.min.js',r=>r.fulfill({contentType:'application/javascript',body:fs.readFileSync(process.env.THREE_TEST_PATH,'utf8')}));
  await page.route('https://fonts.googleapis.com/**',r=>r.abort());
  await page.route('https://fonts.gstatic.com/**',r=>r.abort());
  await page.route(url=>url.origin===origin&&(url.pathname==='/index.html'||url.pathname==='/igloo/9.html'),async route=>{
   const response=await route.fetch();let html=await response.text();
   html=html.slice(0,html.indexOf('// ---------------------------------------------------------------- bring the real world in'))+`
    window.__projectionTest = {
      ready: async () => { await fontsReady; await topicRenderer.load(); },
      render: (time, output=1) => {
        setMode(output); const p=post.material.uniforms;
        applyTime(time,1/60); p.uIntro.value=99; p.uFade.value=1;
        p.uHarp.value.set(0,0);p.uWel.value.set(0,0,0,0);p.uOut.value.x=0;
        // A neutral world is a test fixture, never a production fallback.
        renderer.setRenderTarget(null);renderer.render(post.scene,post.cam);
        return {alpha:p.uTopicA.value,image:p.uTopicImage.value,glError:renderer.getContext().getError(),rect:p.uRect.value.toArray()};
      },
      atlas: id => {const c=CAPTIONS.find(c=>c.id===id);return topicRenderer.get(TopicWalls.topicFor(c),c,ctrl).texture.image.toDataURL();}
    };
    })();</script>`;
   await route.fulfill({response,body:html});
  });
  for(const route of ['/index.html','/igloo/9.html']){
   await page.goto(origin+route,{waitUntil:'load'});await page.waitForFunction(()=>!!window.__projectionTest);
   await page.evaluate(()=>window.__projectionTest.ready());
   assert.equal(await page.evaluate(()=>window.__ireland.topics.state().content.captions.length),12);
   await page.evaluate(()=>{document.querySelector('#start-screen')?.remove();document.querySelectorAll('main,aside,header,#hud,#gate').forEach(e=>e.hidden=true);});
   for(const time of [35,58,72,88,102,112,123,134]){
    const data=await page.evaluate(t=>window.__projectionTest.render(t),time);
    assert.equal(data.alpha,1);assert.equal(data.glError,0);assert.equal(data.image,1);
   }
   const closing=await page.evaluate(()=>window.__projectionTest.render(142));assert.equal(closing.alpha,0);
   // All projector modes compile, including preview and the equirectangular output.
   for(const mode of [0,1,2])assert.equal((await page.evaluate(m=>window.__projectionTest.render(88,m),mode)).glError,0);
   await page.evaluate(()=>window.__projectionTest.render(88,1));
   await page.locator('#stage').screenshot({path:'/tmp/ireland-topic-projection-'+(route.includes('igloo')?'igloo':'root')+'.png'});
   // Import and export are exercised against the production content editor.
   await page.evaluate(()=>{const content=window.__ireland.topics.state().content;content.captions[3].ti='Energy edited';window.__ireland.topics.import(content);});
   assert.equal(await page.evaluate(()=>window.__ireland.topics.state().content.captions[3].ti),'Energy edited');
  }
  assert.deepEqual(errors,[]);console.log('PASS: both entry points, 8 topics, all projection modes, GL compilation, images and JSON content import.');
 } finally {await browser.close();if(server)server.closeAllConnections();if(server)server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

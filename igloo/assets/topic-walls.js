/* Ireland 2036: the user-supplied PDF, composed for physical walls, not screen overlays. */
(function (root) {
  'use strict';
  const defaults = {
    fmapb:1.02,lines:1,grade:.12,warm:.35,nlight:.55,land:.58,inset:.38,fscale:1,tiltx:0,tilty:0,dscale:.74,dx:-1.26,dy:.62,
    vol:1.24,voice:'female',vvol:1,duck:.4,voff:0,owall:0,cv:2,
    lwOn:1,lwSize:.62,lwY:.5,lwOp:1,lwFeather:.16,lwRadius:.08,lwShadow:.45,lwSpread:.5,lwVignette:.25,lwTint:.18,lwGround:.35,
    nvUri:'',nvGender:'female',nvRate:.95,nvPitch:1,nvVol:1,nvLead:-.8,
    panOn:1,panTitle:.68,panDetail:.22,panFill:.5,panMedia:1,panSize:.86,panY:.5,panMat:.22,
    wFront:1,wRight:1,wBack:1,wLeft:1,capOn:0,panFlipX:0,panFlipY:1,film:1,mapb:.42,mapd:.8,harp:.78,arp:1.16,sea:.02
  };
  // Cue IDs are stable across content edits. Order follows the supplied JSON, not PDF page order.
  const topics = [
    {id:'energy',label:'01 · Energy',t0:24,t1:48,title:'Powered by Irish wind, sun and sea',page:9,images:['energy'],
      actions:['Offshore wind at scale off the east and south coasts','Celtic Interconnector linking Ireland to the European grid','Green hydrogen and long-duration storage balancing the system'],
      metrics:[['85%+','renewable electricity'],['10 GW','offshore wind connected'],['12 GW','solar on roofs and farms']]},
    {id:'sustainability',label:'02 · Sustainability',t0:52.5,t1:63.5,title:'Net zero within reach, nature restored',page:11,images:['sustainability'],
      actions:['Carbon budgets met through successive Climate Action Plans','National retrofit programme upgrading homes to B2 or better','Nature Restoration Plan reviving bogs, rivers and native woodland'],
      metrics:[['−60%','national emissions vs 2018'],['700k','homes retrofitted to B2'],['13%','forest cover']]},
    {id:'transport',label:'03 · Transport',t0:66.5,t1:78.5,title:'Connected, low-carbon, on time, everywhere',page:7,images:['transport'],
      actions:['MetroLink carrying passengers from Swords to the city centre','DART+ and BusConnects running across all five cities','A national active-travel network of safe walking and cycling routes'],
      metrics:[['1m','electric vehicles on Irish roads'],['+600k','extra sustainable journeys every day'],['−60%','transport emissions vs 2018']]},
    {id:'economy',label:'04 · Economy',t0:82.5,t1:94.5,title:'A global hub, thriving in every region',page:3,images:['economy-map','economy-people'],
      actions:['Scaled Irish-owned champions in AI, semiconductors and life sciences','Balanced regional growth: Cork, Limerick, Galway and Waterford','Future Ireland Fund built from windfall surpluses for long-term resilience'],
      metrics:[['3m+','people in work'],['€100bn','Future Ireland Fund reserves'],['2x','growth in indigenous exports']]},
    {id:'health',label:'05 · Health',t0:98.5,t1:106,title:'Care when needed, close to home',page:5,images:['health-home','health-hospital'],
      actions:['Sláintecare delivered universal, single-tier access to care','Dedicated elective hospitals in Dublin, Cork and Galway','A shared electronic health record for every patient'],
      metrics:[['10 wks','maximum outpatient wait'],['100%','with a digital health record'],['84+','years average life expectancy']]},
    {id:'housing',label:'06 · Housing',t0:108,t1:117,title:'A secure, affordable home for everyone',page:13,images:['housing'],
      actions:['50,000+ homes delivered every year, sustained for a decade','Land Development Agency and cost-rental at national scale','Modern methods of construction cutting build times and costs'],
      metrics:[['500k','new homes built since 2026'],['50k+','homes completed per year'],['30k+','cost-rental homes']]},
    {id:'education',label:'07 · Education',t0:118,t1:128,title:'Every learner ready for an AI world',page:15,images:['education'],
      actions:['Senior cycle reform with AI and digital literacy for all','Free schoolbooks and hot meals in every school','Lifelong learning accounts to reskill every adult'],
      metrics:[['95%','of students complete the Leaving Cert'],['25%','of adults in learning each year'],['Top 5','OECD ranking for reading']]},
    {id:'defence',label:'08 · Defence',t0:129,t1:139,title:'Secure seas, skies and cyberspace',page:17,images:['defence'],
      actions:["Commission on the Defence Forces’ Level of Ambition 2 delivered",'Maritime security strategy protecting subsea cables and energy','National Cyber Security Centre scaled to protect critical services'],
      metrics:[['€2bn','annual defence investment'],['11,500','Defence Forces personnel'],['100%','primary radar coverage of Irish airspace']]}
  ];
  const captions = [
    {t0:2,t1:8.2,eb:'Our coast',ti:'Where the Atlantic meets us',sub:'The Cliffs of Moher, County Clare'},
    {t0:9,t1:14.6,eb:'Our people',ti:'5.4 million people',sub:'One of the youngest populations in Europe'},
    {t0:17,t1:20,eb:'2026 → 2036',ti:'Eight ambitions. One decade. One country.',sub:'In 2026 we set out bold goals. This is what we delivered.'},
    ...topics.map(t=>({id:t.id,t0:t.t0,t1:t.t1,eb:t.label,ti:t.title,sub:t.metrics.map(m=>m.join(' ')).join(' · ')})),
    {t0:140,t1:145,eb:'Ireland 2036',ti:'We didn’t wait for 2036. We built it.',sub:'The ambitions were bold. The delivery was shared.'}
  ];
  const smooth = v => {v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
  function activeAt(time, cues=captions) {
    // Latest starting cue wins an overlap, so imported older JSON cannot starve a topic.
    return cues.filter(c=>time>=c.t0 && time<c.t1+.6).sort((a,b)=>b.t0-a.t0)[0] || null;
  }
  function topicFor(cue) {
    if(!cue)return null;
    return topics.find(t=>t.id===cue.id || new RegExp('(?:^|[ ·])'+t.id+'(?:$|[ ·])','i').test(cue.eb)) || null;
  }
  function opacityAt(time,cue){return cue ? smooth((time-cue.t0)/.6)*(1-smooth((time-cue.t1)/.6)) : 0;}
  function createRenderer(THREE, base) {
    const cache=new Map(), pictures=new Map();
    let generation=0;
    const SANS='"IBM Plex Sans Condensed", "Plex Local", Arial, sans-serif';
    function invalidate(){generation++;cache.forEach(v=>v.texture.dispose());cache.clear();}
    async function load(){
      await Promise.all(topics.flatMap(t=>t.images).map(async id=>{
        const im=new Image();im.src=new URL('topics/'+id+'.webp',base).href;
        try{await im.decode();pictures.set(id,im);}catch(e){console.warn('Topic image unavailable:',id);}
      }));invalidate();
    }
    function wrap(ctx,text,x,y,width,size,lineHeight,maxLines=3){
      ctx.font=`500 ${size}px ${SANS}`;
      const words=String(text).split(/\s+/);let line='', lines=[];
      for(const word of words){const next=line?line+' '+word:word;if(ctx.measureText(next).width>width && line){lines.push(line);line=word;}else line=next;}
      if(line)lines.push(line);
      if(lines.length>maxLines && size>18)return wrap(ctx,text,x,y,width,size-2,lineHeight-2,maxLines);
      lines.slice(0,maxLines).forEach((s,i)=>ctx.fillText(s,x,y+i*lineHeight));
      return y+Math.min(lines.length,maxLines)*lineHeight;
    }
    function get(topic,cue,settings){
      const key=JSON.stringify([generation,topic.id,cue.ti,cue.eb,cue.sub,settings.panTitle,settings.panDetail]);
      if(cache.has(key))return cache.get(key);
      const cv=document.createElement('canvas');cv.width=3072;cv.height=1024;
      const ctx=cv.getContext('2d');ctx.textBaseline='top';
      // Left half: all wording, transparent behind it; glass is composed in the GPU.
      ctx.fillStyle='#f2c14e';ctx.font=`600 26px ${SANS}`;ctx.fillText(cue.eb.toUpperCase(),76,54);
      ctx.fillRect(76,103,68,3);ctx.fillStyle='#ffffff';
      wrap(ctx,cue.ti,76,137,1384,48+Number(settings.panTitle)*34,76,2);
      ctx.fillStyle='#f2c14e';ctx.font=`600 23px ${SANS}`;ctx.fillText('WHAT WE ACHIEVED',76,330);
      // Custom caption edits remain visible rather than silently reverting to PDF numbers.
      let metrics=topic.metrics;
      const original=topic.metrics.map(m=>m.join(' ')).join(' · ');
      if(cue.sub && cue.sub!==original){
        const parts=cue.sub.split(' · ');
        metrics=parts.length===3?parts.map(p=>{const m=p.match(/^(Top \d+|[^ ]+(?: (?:GW|wks))?)\s+(.*)$/);return m?[m[1],m[2]]:[p,''];}):[];
        if(!metrics.length){ctx.fillStyle='#ffffff';wrap(ctx,cue.sub,76,394,1384,48,60,3);}
      }
      metrics.forEach((m,i)=>{
        const x=76+i*473;ctx.fillStyle='rgba(242,193,78,.5)';ctx.fillRect(x,382,390,2);
        ctx.fillStyle='#fff';wrap(ctx,m[0],x,413,405,86,90,1);
        ctx.fillStyle='#dce4e4';wrap(ctx,m[1],x,522,390,34,41,2);
      });
      if(topic.actions.length){
        ctx.fillStyle='#f2c14e';ctx.font=`600 23px ${SANS}`;ctx.fillText('WHAT WE DID',76,648);
        topic.actions.forEach((a,i)=>{
          ctx.fillStyle='#f2c14e';ctx.font=`500 27px ${SANS}`;ctx.fillText(String(i+1).padStart(2,'0'),76,696+i*69);
          ctx.fillStyle='#e0e7e6';wrap(ctx,a,130,696+i*69,1330,26+Number(settings.panDetail)*14,34,2);
        });
      }
      ctx.fillStyle='#b9c5c5';ctx.font=`400 23px ${SANS}`;ctx.fillText('IRELAND 2036  /  ILLUSTRATIVE PROTOTYPE FIGURES',76,959);
      // Right half: contain every source image, never stretch or crop its content.
      const imgs=topic.images.map(id=>pictures.get(id)).filter(Boolean);
      if(imgs.length){
        const gap=24, available=1456, sum=imgs.reduce((n,i)=>n+i.width/i.height,0);
        const h=Math.min(860,(available-gap*(imgs.length-1))/sum);
        const total=h*sum+gap*(imgs.length-1);let x=1536+(1536-total)/2;
        for(const im of imgs){const w=h*im.width/im.height;ctx.drawImage(im,x,(1024-h)/2,w,h);x+=w+gap;}
      }
      const texture=new THREE.CanvasTexture(cv);texture.flipY=false;texture.generateMipmaps=true;texture.anisotropy=4;texture.minFilter=THREE.LinearMipmapLinearFilter;
      const result={texture,hasImage:imgs.length>0};cache.set(key,result);
      // Only the current and preceding cards occupy GPU memory. No canvas upload each frame.
      while(cache.size>2){const oldest=cache.keys().next().value;cache.get(oldest).texture.dispose();cache.delete(oldest);}
      return result;
    }
    return {get,load,invalidate};
  }
  const api={defaults,topics,captions,activeAt,topicFor,opacityAt,createRenderer};
  if(typeof module!=='undefined' && module.exports)module.exports=api;
  root.IrelandTopicWalls=api;
})(typeof window!=='undefined'?window:globalThis);

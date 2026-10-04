import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,sep} from 'node:path';
import {once} from 'node:events';

test('cloned project starts with its own homepage and isolated content by default',async()=>{
 const root=resolve(import.meta.dirname,'..');
 const pkg=JSON.parse(await readFile(join(root,'package.json'),'utf8'));
 const expected=pkg.name==='ravi-seth-boutique'?'boutique':'estate';
 const folder=await mkdtemp(join(tmpdir(),'ravi-default-'));
 const env={...process.env,HOST:'127.0.0.1',PORT:'0',DATA_DIR:folder,ADMIN_TOKEN:'test-secret',PUBLISH_READY:'false'};
 delete env.SITE_VARIANT;delete env.GOOGLE_SHEETS_WEBHOOK_URL;delete env.GOOGLE_SHEETS_SECRET;
 const child=spawn(process.execPath,['server.mjs'],{cwd:root,env,stdio:['ignore','pipe','pipe']});
 let stderr='';child.stderr.on('data',part=>stderr+=part);
 try{
  const base=await new Promise((resolveReady,reject)=>{
   const timer=setTimeout(()=>reject(Error('Server did not start: '+stderr)),10000);
   let output='';
   child.stdout.on('data',part=>{output+=part;const match=output.match(/Website server: (http:\/\/127\.0\.0\.1:\d+)/);if(match){clearTimeout(timer);resolveReady(match[1])}});
   child.once('error',error=>{clearTimeout(timer);reject(error)});
   child.once('exit',code=>{clearTimeout(timer);reject(Error(`Server exited ${code}: ${stderr}`))});
  });
  const config=await (await fetch(base+'/api/site-config')).json();assert.equal(config.variant,expected);
  const home=await (await fetch(base+'/')).text();assert.ok(home.includes(`data-page="${expected}"`));
  const listings=await (await fetch(base+'/api/listings')).json();assert.ok(listings.length);
  assert.ok(listings.every(item=>expected==='estate'?item.section==='estate':['boutique','car'].includes(item.section)));
  assert.equal((await fetch(base+(expected==='estate'?'/boutique.html':'/estate.html'))).status,404);
 }finally{
  if(child.exitCode===null){const stopped=once(child,'exit');child.kill();await stopped;}
  assert.ok(resolve(folder).startsWith(resolve(tmpdir())+sep));await rm(folder,{recursive:true,force:true,maxRetries:10,retryDelay:100});
 }
});

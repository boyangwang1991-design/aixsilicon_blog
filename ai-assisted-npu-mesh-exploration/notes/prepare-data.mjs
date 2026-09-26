import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd(), slug='ai-assisted-npu-mesh-exploration';
const base='reference/aixsilicon_esl_repo-main/aixsilicon_esl_repo-main/models/npu_mesh/';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const interference=read(base+'reports/20260924-interference/interference_checks.json');
const qos=read(base+'reports/20260924-qos/qos_checks.json');
for(const j of [interference,qos]) if(j.overall_status!=='PASS') throw Error('Source checks did not pass');
const names=['alone','mixed','mixed_link64','mixed_bank_ii1','mixed_slots32'];
const ip=names.map(n=>interference.points.find(p=>p.name===n));
if(new Set(ip.map(p=>p.cohort_sha256)).size!==1) throw Error('Decode cohort changed');
const qp=['mixed','shape8','shape16'].map(n=>qos.points.find(p=>p.name===n));
if(new Set(qp.map(p=>p.workload_sha256)).size!==1) throw Error('Mixed QoS workload changed');
for(const p of [...ip,...qp]){
 if(p.latency.count!==128||p.decode_window_completed!==128)throw Error('Decode cohort incomplete');
 const sum=Object.values(p.stages).reduce((a,s)=>a+s.mean,0);
 if(Math.abs(sum-p.latency.mean)>1e-9)throw Error('Stage mean mismatch');
}
const data={date:'2026-09-24',kind:'Uncalibrated SystemC synthetic bus-traffic experiment',units:{latency:'model cycles',batch_end:'model cycle from simulation origin',delivery:'logical B/cycle within [4096,12288)'},interference:ip.map(p=>({case:p.name,p99:p.latency.p99,mean:p.latency.mean,batch_end:p.counters.cycles,stages:Object.fromEntries(Object.entries(p.stages).map(([k,v])=>[k,v.mean]))})),qos:qp.map(p=>({case:p.name,p99:p.latency.p99,batch_end:p.counters.cycles,prefill:p.background.prefill.window_bytes_per_cycle,kv:p.background.kv.window_bytes_per_cycle}))};
fs.writeFileSync(path.join(root,slug,'assets/data/experiment-data.json'),JSON.stringify(data,null,2)+'\n');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const sources=['README.md','docs/design.md','docs/interference.md','docs/qos.md','reports/20260924-interference/report.md','reports/20260924-interference/run_log.md','reports/20260924-interference/baseline_config.json','reports/20260924-interference/interference.csv','reports/20260924-interference/interference_checks.json','reports/20260924-qos/report.md','reports/20260924-qos/run_log.md','reports/20260924-qos/qos.csv','reports/20260924-qos/qos_checks.json'];
const manifest={article:slug,date:'2026-09-26',files:[],editorial_sources:sources.map(f=>({source:base+f,sha256:hash(base+f),access:'internal read-only'})),data_extraction:{target:'assets/data/experiment-data.json',sha256:hash(slug+'/assets/data/experiment-data.json'),script:'notes/prepare-data.mjs',checks:['source PASS','matching Decode cohort hashes','matching full mixed QoS workload hashes','128 completed Decode requests','sum of stage means equals total mean']},assets:[]};
for(const dir of ['assets/generated','assets/charts']) for(const f of fs.readdirSync(path.join(root,slug,dir))){
 if(!/\.(png|svg)$/.test(f))continue;
 const target=dir+'/'+f;
 const bytes=fs.readFileSync(path.join(root,slug,target));
 manifest.assets.push({target,sha256:hash(slug+'/'+target),language:f.includes('-zh')?'zh':'en',purpose:f.startsWith('cover')?'concept cover':dir.endsWith('charts')?'data chart redrawn from archived evidence':'concept explanation',generator:dir.endsWith('charts')?'Matplotlib; assets/plot-data.py':'Codex built-in imagegen',prompt:dir.endsWith('generated')?'notes/'+(f==='cover-en-4x3.png'?'cover-en':f.replace('.png',''))+'-prompt.md':undefined,revisions:f.startsWith('system')?['notes/system-revision.md','notes/system-revision-2.md']:undefined,width:f.endsWith('.png')?bytes.readUInt32BE(16):undefined,height:f.endsWith('.png')?bytes.readUInt32BE(20):undefined});
}
fs.writeFileSync(path.join(root,slug,'sources.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('Validated cohorts, workload hashes, complete samples and stage conservation; extracted '+ip.length+' interference and '+qp.length+' QoS points.');

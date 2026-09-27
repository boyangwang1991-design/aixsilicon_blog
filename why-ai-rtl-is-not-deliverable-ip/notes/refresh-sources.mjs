import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const article=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const root=path.resolve(article,'..');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const base='reference/aixsilicon_ip_repo-main/aixsilicon_ip_repo-main/ips/external_bus/bridge/spi2apb_bridge/';
const planning=JSON.parse(fs.readFileSync(path.join(root,'notes/rtl-to-deliverable-ip-sources.json'),'utf8').replace(/^\uFEFF/,''));
const sources=[...planning.files.map(x=>x.source),...['rtl/spi2apb_engine.sv','verification/parameters/parameter_elab.sv','scripts/parameter_check.py','scripts/regress.py'].map(p=>base+p)].map(source=>({source,sha256:sha(path.join(root,source)),use:source.includes('spec-to-rtl')?'Editorial context; distinguish from previous article':'Read-only factual or method reference'}));
const records=JSON.parse(fs.readFileSync(path.join(article,'notes/generation-records.json'),'utf8'));
const generatedAssets=records.filter(x=>x.selected).map(r=>{
 const p=path.join(article,r.destination),b=fs.readFileSync(p);
 const promptPath=r.key.startsWith('cover')?'notes/cover-prompt.md':'notes/illustration-prompts.md';
 return {purpose:r.key.startsWith('cover')?'conceptual cover':'conceptual teaching illustration',language:r.lang,path:r.destination,sha256:sha(p),width:b.readUInt32BE(16),height:b.readUInt32BE(20),tool:'imagegen',revision:r.revision,output:r.output,promptPath,promptSha256:sha(path.join(article,promptPath)),semanticSource:'assets/figure-specs.json'};
});
const m={type:'original bilingual article',date:'2026-09-27',files:[],evidenceBoundary:'Saved engineering reports checked against source and scripts; no EDA rerun; raw build logs absent from supplied snapshot. Reference material remains private.',sources,articles:['README.md','README.en.md'].map(p=>({path:p,sha256:sha(path.join(article,p))})),generatedAssets,generationHistory:records.map(r=>({key:r.key,revision:r.revision,selected:r.selected,output:r.output,sha256:sha(r.output)}))};
fs.writeFileSync(path.join(article,'sources.json'),JSON.stringify(m,null,2)+'\n');
console.log(JSON.stringify({sources:sources.length,assets:generatedAssets.length,dimensions:generatedAssets.map(a=>[a.path,a.width,a.height])},null,2));

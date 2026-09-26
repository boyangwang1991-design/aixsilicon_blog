import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const slug='ai-assisted-diversity-comparator-design';
const base='reference/aixsilicon_cbb_repo-main/aixsilicon_cbb_repo-main/components/';
const lock=base+'interrupt_safety/lockstep_comparator/';
const sourcePaths=[base+'safety_reliability/diversity_comparator/diversity_comparator_contract.md', ...['docs/design.md','docs/cbb_spec.md','docs/integration.md','docs/detail-design/impl_redundant.md','docs/intake.md','reports/verification-report.md','reports/ppa-report.md','reports/ppa-summary.json','reports/skill-result.yaml','rtl/lockstep_comparator_logic.sv','CHANGELOG.md'].map(x=>lock+x),'reference/aixsilicon_skill_repo-main/aixsilicon_skill_repo-main/skills/cbb-development-suite/SKILL.md'];
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
fs.copyFileSync(path.join(root,slug,'assets/generated/cover-en.png'),path.join(root,slug,'assets/generated/cover-en-4x3.png'));
const generated=fs.readdirSync(path.join(root,slug,'assets/generated')).filter(x=>x.endsWith('.png')).map(f=>{
 const target='assets/generated/'+f;
 const bytes=fs.readFileSync(path.join(root,slug,target));
 const stem=f==='cover-en-4x3.png'?'cover-en':f.slice(0,-4);
 const revisions=fs.readdirSync(path.join(root,slug,'notes')).filter(n=>n.startsWith(stem+'-revision')).map(n=>'notes/'+n);
 return {target,language:f.includes('-zh')?'zh':'en',purpose:f.startsWith('cover')?'concept cover':'explanatory concept diagram',tool:'Codex built-in imagegen',sha256:hash(slug+'/'+target),width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),prompt:'notes/'+stem+'-prompt.md',revisions};
});
const out={article:slug,date:'2026-09-26',kind:'original bilingual editorial',files:[],editorial_sources:sourcePaths.map(source=>({source,sha256:hash(source),access:'internal read-only; not a public article reference'})),public_sources:[{url:'https://documentation.infineon.com/aurixtc3xx/docs/vln1745575913166',accessed:'2026-09-26',purpose:'functional safety introduction and comparison redundancy concepts'}],generated_assets:generated,review_notes:'notes/editorial-review.md'};
out.public_sources.push(
 {url:'https://developer.arm.com/community/arm-community-blogs/b/embedded-and-microcontrollers-blog/posts/comparing-lock-step-redundant-execution-versus-split-lock-technologies',accessed:'2026-09-26',purpose:'DCLS execution, resource trade-off, system-defined reaction'},
 {url:'https://documentation.infineon.com/aurixtc3xx/docs/ztz1745575952703',accessed:'2026-09-26',purpose:'Temporal separation, checker input and main observation delays, common infrastructure and system reaction'}
);
fs.writeFileSync(path.join(root,slug,'sources.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(generated.map(({target,width,height})=>({target,width,height})),null,2));

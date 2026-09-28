import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const slug='ai-assisted-watchdog-development';
const base='reference/aixsilicon_ip_repo-main/aixsilicon_ip_repo-main/ips/peripheral/timer/watchdog/';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const sourceFiles=['docs/reuse_plan.md','docs/reviews/lrs_recovery_review.md','docs/reviews/lld_recovery_review.md','docs/hld/08_decisions.md','README.md','watchdog_contract.md','reports/report.md','reports/ppa/ppa_report.md','docs/hld/01_architecture.md','docs/user_manual/watchdog_user_guide.md','docs/integration/watchdog_integration_guide.md','docs/lrs/03_functional_timing.md','docs/lrs/03_functional_service_1.md','docs/lrs/03_functional_supervision_1.md','docs/lrs/03_functional_escalation.md','docs/skill_improvements.md','rtl/watchdog_channel.sv','rtl/watchdog_top.sv','sw/watchdog.c'];
const manifest={article:slug,date:'2026-09-27',kind:'Original bilingual article based on archived candidate-design evidence',files:[],editorial_sources:sourceFiles.map(f=>({source:base+f,sha256:hash(base+f),access:'internal read-only'})),public_sources:[{url:'https://www.st.com/resource/en/product_training/STM32WB-WDG_TIMERS-System-Window-Watchdog-WWDG.pdf',purpose:'General early/late refresh concept only',verified:'2026-09-27'}],assets:[]};
for(const f of fs.readdirSync(slug+'/assets/generated')){
 if(!f.endsWith('.png'))continue;
 const target='assets/generated/'+f,p=slug+'/'+target,b=fs.readFileSync(p);
 const stem=f==='cover-en-4x3.png'?'cover-en':f.replace('.png','');
 const prompt='notes/'+stem+'-prompt.md';
 manifest.assets.push({target,language:f.includes('-zh')?'zh':'en',purpose:f.startsWith('cover')?'concept cover':'concept explanation',generator:'Codex built-in imagegen',width:b.readUInt32BE(16),height:b.readUInt32BE(20),sha256:hash(p),prompt,prompt_sha256:hash(slug+'/'+prompt)});
}
fs.writeFileSync(slug+'/sources.json',JSON.stringify(manifest,null,2)+'\n');
console.log('Provenance refreshed for '+manifest.assets.length+' images.');

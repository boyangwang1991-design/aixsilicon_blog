import fs from 'node:fs';
import crypto from 'node:crypto';
const slug='ai-assisted-gpio-development';
const base='reference/aixsilicon_ip_repo-main/aixsilicon_ip_repo-main/ips/peripheral/io/gpio/';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const sourceFiles=['README.md','reports/quality/full_process.md','reports/ppa-report.md','docs/user_manual/gpio_user_guide.md','docs/integration/gpio_integration_guide.md','docs/reuse_plan.md','docs/lld/03_gpio_apb_if.md','docs/hld/02_policy_reconfig.md','docs/hld/02_policy_fifo_concurrent.md','rtl/gpio_output.sv','rtl/gpio_input.sv'];
sourceFiles.push('rtl/gpio_irq.sv','rtl/gpio_event_fifo.sv','rtl/gpio_aon_mailbox.sv');
const manifest={article:slug,date:'2026-09-27',kind:'Original bilingual article based on archived candidate-design evidence; no upstream runs performed',files:[],editorial_sources:sourceFiles.map(f=>({source:base+f,sha256:hash(base+f),access:'internal read-only'})),assets:[]};
for(const f of fs.readdirSync(slug+'/assets/generated')){
 if(!f.endsWith('.png'))continue;
 const target='assets/generated/'+f,p=slug+'/'+target,b=fs.readFileSync(p);
 const stem=f==='cover-en-4x3.png'?'cover-en':f.replace('.png','');
 const prompt='notes/'+stem+'-prompt.md';
 manifest.assets.push({target,language:f.includes('-zh')?'zh':'en',purpose:f.startsWith('cover')?'concept cover':'concept explanation',generator:'Codex built-in imagegen',width:b.readUInt32BE(16),height:b.readUInt32BE(20),sha256:hash(p),prompt,prompt_sha256:hash(slug+'/'+prompt)});
}
fs.writeFileSync(slug+'/sources.json',JSON.stringify(manifest,null,2)+'\n');
console.log('Provenance refreshed for '+manifest.assets.length+' image files.');

// Deterministic teaching figures. Invented values, not checkpoint data.
// Usage: node generate-matmul-figures.mjs <node_modules containing sharp>
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const sharp = require(resolve(process.argv[2], 'sharp'));
const out = resolve(dirname(fileURLToPath(import.meta.url)), '../generated');
const c = { ink:'#122b46', teal:'#087d86', amber:'#ac6819', blue:'#516bb4', bg:'#fbf8f0' };
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const text = (x,y,s,size=28,fill=c.ink,anchor='start') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
const box = (x,y,w,h,fill='#ffffff',stroke='none') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const arrow = (x1,y1,x2,y2,color=c.teal) => `<path d="M${x1},${y1} L${x2},${y2}" fill="none" stroke="${color}" stroke-width="3" marker-end="url(#arrow)"/>`;
const start = (title,sub,h) => `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${h}" viewBox="0 0 1000 ${h}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="${c.teal}"/></marker></defs><rect width="1000" height="${h}" fill="${c.bg}"/><g font-family="Microsoft YaHei, sans-serif">${text(50,72,title,38)}${text(50,117,sub,24,'#52657a')}`;
const end = '</g></svg>';
let a = start('一个输出，怎样算出来？','2 个输入特征 × 3 列权重 → 3 个输出特征',990);
a += box(50,155,900,200) + text(90,200,'输入 x',25) + text(90,270,'[ 2   3 ]',38,c.teal);
a += text(310,260,'×',40) + text(460,195,'权重 W：每列对应一个输出',24);
const cols = [c.teal,c.amber,c.blue];
[[1,5],[4,6],[2,-1]].forEach((v,j)=>{
  const x=485+j*145;
  a+=box(x-48,210,96,120,['#e0f0ed','#fcf0d8','#e8edf8'][j]);
  a+=text(x,254,v[0],32,cols[j],'middle')+text(x,305,v[1],32,cols[j],'middle');
});
['2 × 1 + 3 × 5 = 17','2 × 4 + 3 × 6 = 26','2 × 2 + 3 × (−1) = 1'].forEach((s,j)=>{
  const y=390+j*110;
  a+=box(50,y,900,90)+text(85,y+56,`输出 ${j}`,27,cols[j])+text(270,y+57,s,34,cols[j]);
});
a+=box(50,750,900,120,'#e0f0ed')+text(500,800,'y = [ 17   26   1 ]',36,c.teal,'middle')+text(500,843,'同一条输入，三组权重，三次加权求和',27,c.ink,'middle');
a+=text(50,927,'构造数字的原理示意 · 非 Gemma 4 权重',23,'#52657a')+end;
let b=start('共享权重，不混合位置','每个位置独立变换特征；输出保留原来的位置',1040);
b+=box(225,155,550,165,'#fcf0d8')+text(500,196,'同一张权重 W：[2,3]',28,c.amber,'middle')+text(500,244,'[ 1     4      2 ]',31,c.ink,'middle')+text(500,290,'[ 5     6    −1 ]',31,c.ink,'middle');
b+=arrow(400,320,400,440)+`<path d="M775,250 L975,250 L975,570 L500,570 L500,610" fill="none" stroke="${c.teal}" stroke-width="3" marker-end="url(#arrow)"/>`;
[[430,'位置 0','[ 2   3 ]','[ 17   26   1 ]'],[600,'位置 1','[ 1   0 ]','[ 1    4    2 ]']].forEach(([y,label,input,output])=>{
  b+=box(50,y,250,110)+text(75,y+38,label,24)+text(175,y+83,input,32,c.teal,'middle');
  b+=arrow(305,y+58,368,y+58)+box(380,y+15,240,80,'#e0f0ed')+text(500,y+67,'× W',34,c.teal,'middle');
  b+=arrow(628,y+58,690,y+58)+box(700,y,250,110)+text(825,y+69,output,31,c.ink,'middle');
});
b+=box(50,770,900,174,'#e8edf8')+text(500,819,'推广到 B 个请求，每个请求 S 个位置',28,c.ink,'middle')+text(500,873,'[B,S,D] × [D,N] → [B,S,N]',34,c.ink,'middle')+text(500,917,'B、S 保留；只把特征宽度 D 变成 N',26,c.ink,'middle');
b+=text(50,996,'构造数字的原理示意 · 非跨位置 Attention 计算',23,'#52657a')+end;
let d=start('查表之后，向量怎样参与计算？','Embedding 给出起点；Decoder 内的投影重组特征',1120);
d+=box(50,155,900,105,'#e0f0ed')+text(500,197,'主 Embedding：按 token ID 查表并缩放',29,c.ink,'middle')+text(500,239,'得到每个位置的起始表示',26,c.teal,'middle');
d+=arrow(500,265,500,312)+box(50,325,900,635,'#ffffff','#d7dfdf')+text(85,374,'Decoder 内部：两类计算如何使用线性投影',30);
d+=box(85,410,830,230,'#e8edf8')+text(115,454,'Attention：准备匹配与传递信息的表示',29);
d+=text(115,504,'当前状态 → Q / K / V 投影',29,c.blue)+text(115,553,'Q 与 K 匹配位置；按注意力权重汇聚 V',27);
d+=text(115,601,'投影逐位置执行；后续注意力计算跨位置',25,'#52657a');
d+=box(85,665,830,245,'#fcf0d8')+text(115,711,'MLP：加工当前位置的特征组合',29);
d+=text(115,758,'两路 2560 → 10240 投影',29,c.amber)+text(115,804,'激活与逐元素相乘 → 10240 → 2560',28);
d+=text(115,856,'各位置独立计算；输出回到主路宽度',25,'#52657a');
d+=text(50,1012,'概念分工图：上下两框不表示并行执行。',25,'#52657a')+text(50,1050,'Q/K/V 以自行计算 K/V 的层为例；共享层复用 K/V。',23,'#52657a')+text(50,1087,'省略归一化、位置编码、残差及其他分支。',23,'#52657a')+end;
for (const [name,svg] of [['matmul-04-zh',a],['shared-weights-04-zh',b],['projection-role-04-zh',d]]) {
  await fs.writeFile(resolve(out,`${name}.svg`),svg);
  await sharp(Buffer.from(svg)).png().toFile(resolve(out,`${name}.png`));
}

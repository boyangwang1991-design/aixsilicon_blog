"""Redraw published figures from the adjacent extracted dataset; no private files needed."""
import json
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager
import numpy as np

BASE=Path(__file__).resolve().parent
DATA=json.loads((BASE/'data/experiment-data.json').read_text(encoding='utf-8'))
OUT=BASE/'charts'
OUT.mkdir(exist_ok=True)
font=Path('C:/Windows/Fonts/msyh.ttc')
if font.exists():
    font_manager.fontManager.addfont(str(font))
    plt.rcParams['font.family']=font_manager.FontProperties(fname=str(font)).get_name()
plt.rcParams.update({'font.size':12,'axes.spines.top':False,'axes.spines.right':False,'axes.spines.left':False,'axes.spines.bottom':False,'axes.labelcolor':'#24364b','text.color':'#142e46','xtick.color':'#455469','ytick.color':'#455469','svg.fonttype':'none','axes.unicode_minus':False})
NAVY,TEAL,AMBER='#16344f','#008b91','#eaa23b'
I={p['case']:p for p in DATA['interference']}
Q=DATA['qos']
def clean(ax):
    ax.set_axisbelow(True);ax.grid(axis='x',color='#e3e9ee');ax.tick_params(length=0)
def save(fig,name,lang,footer):
    fig.text(.055,.025,footer,fontsize=10,color='#596b7b')
    for ext in ['png','svg']:
        destination=OUT/f'{name}-{lang}.{ext}'
        fig.savefig(destination,dpi=180,facecolor='white')
        if ext=='svg':
            destination.write_text('\n'.join(line.rstrip() for line in destination.read_text(encoding='utf-8').splitlines())+'\n',encoding='utf-8')
    plt.close(fig)
for lang in ['zh','en']:
    zh=lang=='zh'
    labels=['32B 原链路','64B 加宽链路'] if zh else ['32B baseline','64B wider link']
    fig,axes=plt.subplots(1,2,figsize=(12,5.5))
    fig.subplots_adjust(left=.17,right=.93,top=.77,bottom=.22,wspace=.65)
    fig.suptitle('整批更快，Decode 尾部却更慢' if zh else 'A faster batch, a slower Decode tail',fontsize=22,fontweight='bold',y=.96)
    for ax,key,title,lim in zip(axes,['batch_end','p99'],['全批结束周期','Decode p99（周期）'] if zh else ['Batch end cycle','Decode p99 (cycles)'],[29000,70]):
        vals=[I['mixed'][key],I['mixed_link64'][key]]
        ax.barh([0,1],vals,color=[TEAL,AMBER],height=.48)
        ax.set_yticks([0,1],labels);ax.invert_yaxis();ax.set_xlim(0,lim);ax.set_title(title,fontsize=14,pad=20);clean(ax)
        for y,v in enumerate(vals):ax.text(v+lim*.025,y,f'{v:,}',va='center',fontweight='bold',fontsize=14)
    save(fig,'link-tradeoff',lang,'同一混合任务集 · 128 个 Decode 样本 · 未校准的 SystemC 模型' if zh else 'Same mixed workload · 128 Decode samples · Uncalibrated SystemC model')

    keys=['niu_before_injection','request_transport','target_queue_and_service','response_transport']
    leg=['NIU 注入前','请求传输','目标排队 / 服务','返回传输'] if zh else ['Before injection','Request transport','Target queue / service','Response transport']
    colors=['#b7c5d2','#529eb9',AMBER,TEAL]
    fig,ax=plt.subplots(figsize=(12,6))
    fig.subplots_adjust(left=.17,right=.94,top=.65,bottom=.24)
    fig.suptitle('返回更快，目标侧等待更长' if zh else 'Faster returns, longer target-side waiting',fontsize=22,fontweight='bold',y=.95)
    left=np.zeros(2)
    for key,label,color in zip(keys,leg,colors):
        vals=np.array([I['mixed']['stages'][key],I['mixed_link64']['stages'][key]])
        ax.barh([0,1],vals,left=left,height=.45,label=label,color=color)
        for y,v in enumerate(vals):
            if v>2:ax.text(left[y]+v/2,y,f'{v:.3f}',ha='center',va='center',fontsize=12,color='white' if color==TEAL else NAVY,fontweight='bold')
        left+=vals
    for y,total in enumerate(left):ax.text(total+.4,y,f'{total:.3f}',va='center',fontsize=12,fontweight='bold')
    ax.set_yticks([0,1],labels);ax.invert_yaxis();ax.set_xlim(0,51);clean(ax)
    ax.set_xlabel('平均时延（模型周期）' if zh else 'Mean latency (model cycles)',labelpad=12)
    fig.legend(loc='upper center',bbox_to_anchor=(.53,.83),ncol=2,frameon=False,fontsize=12)
    save(fig,'stage-means',lang,'准入均值为 0 · 阶段均值可加和；此图不是 p99 分解' if zh else 'Mean admission = 0 · Stage means add; this is not a p99 decomposition')

    labels=['无整形','8B/cycle','16B/cycle'] if zh else ['No shaping','8B/cycle','16B/cycle']
    fig,axes=plt.subplots(3,1,figsize=(11,10))
    fig.subplots_adjust(left=.2,right=.89,top=.86,bottom=.12,hspace=.65)
    fig.suptitle('保护 Decode，也要计算后台代价' if zh else 'Protect Decode—and account for the cost',fontsize=21,fontweight='bold',y=.97)
    fig.text(.2,.91,'速率为每个后台 (source, context) 桶的补充速率' if zh else 'Rates apply per background (source, context) bucket',fontsize=11)
    for ax,key,title,lim in [(axes[0],'p99','Decode p99（周期）' if zh else 'Decode p99 (cycles)',65),(axes[2],'batch_end','全批结束周期' if zh else 'Batch end cycle',94000)]:
        vals=[p[key] for p in Q];ax.barh(range(3),vals,height=.55,color=[NAVY,TEAL,AMBER]);ax.set_yticks(range(3),labels);ax.invert_yaxis();ax.set_xlim(0,lim);ax.set_title(title,loc='left',fontweight='bold',pad=10);clean(ax)
        for y,v in enumerate(vals):ax.text(v+lim*.02,y,f'{v:,}',va='center',fontsize=12,fontweight='bold')
    ax=axes[1];y=np.arange(3)
    for delta,key,color,label in [(-.18,'prefill',TEAL,'Prefill'),(.18,'kv',AMBER,'KV')]:
        vals=[p[key] for p in Q];ax.barh(y+delta,vals,height=.32,color=color,label=label)
        for yy,v in zip(y+delta,vals):ax.text(v+.25,yy,f'{v:g}',va='center',fontsize=11)
    ax.set_yticks(y,labels);ax.invert_yaxis();ax.set_xlim(0,20);clean(ax);ax.set_title('固定窗口后台交付（B/cycle）' if zh else 'Background delivery in fixed window (B/cycle)',loc='left',fontweight='bold',pad=10);ax.legend(loc='upper right',frameon=False,fontsize=10)
    save(fig,'qos-tradeoff',lang,'完整相同任务集 · 窗口 [4096,12288) · KV 只计目的有效字节' if zh else 'Same complete workload · Window [4096,12288) · KV counts destination bytes only')
print('Rendered 6 bilingual data figures as PNG and editable SVG.')

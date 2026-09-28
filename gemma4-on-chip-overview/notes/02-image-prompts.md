# 第 02 期配图记录

日期：2026-09-28。封面采用 Codex 内置 imagegen；两张包含精确 token 与 ID 的讲解图由 `assets/diagrams/generate-tokenizer-figures.mjs` 从已核对的数据生成 SVG，再由 `render-tokenizer-figures.mjs` 导出 PNG。教学生图与官方 Tokenizer 的数据核对分开进行。图像生成曾给出错误的协议标签和半角问号，相关版本没有纳入文章。

## 独立封面

- 路径：`assets/generated/cover-02-zh.png`。
- 用途：公众号入口，强调一条提问被切成 token 并加上消息边界；图中空白色块不代表固定长度或真实模型张量。
- 最终 imagegen 提示词：

```text
Use case: scientific-educational. Asset type: final independent wide Chinese blog cover for Gemma 4 series chapter 02, 16:9 landscape. Primary visual: one bright continuous line of Chinese writing is being segmented into six unequal glowing rectangular tiles; around it, a subtle larger message frame adds a few small blank boundary tiles. This is an abstract illustration of tokenization and chat formatting, not an exact protocol diagram. Dark midnight navy background, elegant warm white typography, teal and amber tiles, polished engineering editorial style, generous safe margins for phone crop. EXACT visible text, and absolutely no other text anywhere in the image: large headline “一句提问，怎么变成 15 个 Token？”; small subtitle “Gemma 4 的分词与聊天模板”. Do not render example sentences, role names, special token tags, fake IDs, logos, chip props, or watermark. The six tiles must be blank, with no characters. Accuracy and clear thumbnail typography matter more than decorative detail.
```

## 原始文本切分图

- 路径：`assets/generated/token-split-zh.svg`、`assets/generated/token-split-zh.png`。
- 用途：对齐原始问题、六段 token、六个词表 ID；全角 `？` 保持为 U+FF1F。
- 数据：官方 E4B 固定 revision 的 `tok(question, add_special_tokens=False)`；六段与 ID 逐项见第 02 章。
- 图源：`assets/diagrams/generate-tokenizer-figures.mjs`。

## 聊天模板图

- 路径：`assets/generated/chat-template-zh.svg`、`assets/generated/chat-template-zh.png`。
- 用途：以位置 `00–14` 显示模板后完整 15 个 ID；区分边界符、角色名/换行与提问正文。
- 数据：同一官方 Tokenizer revision；单条 `user` 消息且 `add_generation_prompt=True`。`↵` 只作为换行 token `107` 的图内记号。
- 图源：`assets/diagrams/generate-tokenizer-figures.mjs`。

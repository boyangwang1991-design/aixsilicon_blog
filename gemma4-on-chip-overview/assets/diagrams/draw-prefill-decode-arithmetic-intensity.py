"""Draw the quantitative Prefill/Decode weight-reuse explainer for chapter 10."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "assets" / "generated" / "prefill-decode-arithmetic-intensity-zh.png"
FONT = Path(r"C:\Windows\Fonts\NotoSansSC-VF.ttf")
WIDTH, HEIGHT = 2400, 1480

BG = "#F5F7FB"
INK = "#15223A"
MUTED = "#536278"
LINE = "#CED8E6"
BLUE = "#1768BE"
BLUE_PALE = "#E7F2FC"
ORANGE = "#CC6732"
ORANGE_PALE = "#FFF0E6"
WEIGHT = "#6A56AB"


def font(size, bold=False):
    return ImageFont.truetype(str(FONT), size, index=0)


img = Image.new("RGB", (WIDTH, HEIGHT), BG)
d = ImageDraw.Draw(img)


def text(x, y, value, size, color=INK, anchor=None):
    d.text((x, y), value, fill=color, font=font(size), anchor=anchor)


def center(x, y, value, size, color=INK):
    text(x, y, value, size, color, "mm")


def rr(box, radius, fill, outline=None, width=1):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def arrow(x1, y, x2, color):
    d.line((x1, y, x2 - 17, y), fill=color, width=9)
    d.polygon([(x2, y), (x2 - 25, y - 15), (x2 - 25, y + 15)], fill=color)


def matrix(x, y, w, h, rows, cols, color, pale, highlight=False):
    rr((x, y, x + w, y + h), 15, pale, color, 3)
    for r in range(1, rows):
        yy = y + r * h / rows
        d.line((x, yy, x + w, yy), fill=color, width=2)
    for c in range(1, cols):
        xx = x + c * w / cols
        d.line((xx, y, xx, y + h), fill=color, width=2)
    if highlight:
        d.rectangle((x + 3, y + 3, x + w - 3, y + h / rows - 2), fill="#C9DEF4")


text(110, 54, "同一张权重，为什么两阶段的存算比差这么多？", 76)
text(114, 151, "E4B gate 投影  ·  权重 [2560, 10240]  ·  BF16  ·  batch=1", 40, MUTED)


def card(x, title, accent, pale, m, ops, intensity, focus, input_rows):
    x2 = x + 1060
    rr((x, 257, x2, 1195), 38, "#FFFFFF", LINE, 3)
    rr((x + 28, 282, x2 - 28, 393), 26, pale)
    text(x + 65, 303, title, 58, accent)
    text(x + 65, 418, f"输入行数 M = {m}", 39, MUTED)

    iy = 565
    if input_rows > 1:
        matrix(x + 67, iy, 180, 166, 7, 4, accent, pale)
    else:
        matrix(x + 67, iy + 62, 180, 42, 1, 4, accent, pale)
    center(x + 309, iy + 82, "×", 63, accent)
    matrix(x + 375, iy + 9, 232, 146, 5, 7, WEIGHT, "#EDEAF8")
    arrow(x + 630, iy + 82, x + 715, accent)
    if input_rows > 1:
        matrix(x + 738, iy, 180, 166, 7, 4, accent, pale)
    else:
        matrix(x + 738, iy + 62, 180, 42, 1, 4, accent, pale)
    center(x + 157, 770, f"{m} 行输入", 32, MUTED)
    center(x + 491, 770, "同一权重", 32, MUTED)
    center(x + 828, 770, f"{m} 行输出", 32, MUTED)

    rr((x + 56, 812, x2 - 56, 1018), 26, pale)
    center(x + 530, 865, f"{intensity} FLOP / 字节", 65, accent)
    center(x + 530, 952, f"约 {ops} ÷ 50 MiB 权重读取", 35, INK)
    text(x + 66, 1060, "硬件关注", 37, MUTED)
    text(x + 66, 1113, focus, 44, accent)


card(105, "Prefill · 多行共用权重", BLUE, BLUE_PALE, 128, "6.71 GFLOP", 128,
     "分块复用权重，喂饱计算阵列", 128)
card(1235, "Decode · 单行使用权重", ORANGE, ORANGE_PALE, 1, "52.4 MFLOP", 1,
     "权重与历史 K/V 的容量、带宽", 1)

rr((105, 1237, 2295, 1425), 26, "#E9EEF5")
text(150, 1260, "读图边界", 38, INK)
text(150, 1320, "两栏都假设从同一级存储把 50 MiB 权重只读一次；仅统计权重流量。", 35, MUTED)
text(150, 1372, "未计激活、输出、K/V、重复搬运与缓存命中，不代表整模型实测性能。", 35, MUTED)

OUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUT, optimize=True)
print(OUT)

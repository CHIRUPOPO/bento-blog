#!/usr/bin/env python3
# =========================================================
# お弁当写真をやさしく明るくする（共通処理）
#
#   ・目標の明るさ TARGET（約140）を下回る写真だけを持ち上げる
#   ・「ガンマ補正」で暗い部分〜中間だけを明るくし、
#     白い部分（タルタルソース等）は飛ばさず守る
#   ・もともと明るい写真はそのまま（暗くしない）
#
#   使い方:
#     python3 tools/brighten.py 画像ファイル [画像ファイル...]
# =========================================================
import sys, math
from PIL import Image, ImageEnhance, ImageStat

TARGET = 140       # 目指す平均の明るさ（0-255）
DEADZONE = 138     # これ以上明るい写真はさわらない
GAMMA_CAP = 1.6    # 暗すぎる写真を上げすぎない上限
COLOR = 1.04       # ほんの少しだけ彩りを足す（美味しそうに）

def luminance_mean(im):
    return ImageStat.Stat(im.convert("L")).mean[0]

def brighten(im):
    im = im.convert("RGB")
    mean = luminance_mean(im)
    if mean >= DEADZONE:
        return im, mean, mean, 1.0  # すでに十分明るい → そのまま
    # 平均を TARGET に近づけるガンマを計算（白(255)は255のまま＝白飛びしない）
    gamma = math.log(mean / 255.0) / math.log(TARGET / 255.0)
    gamma = max(1.0, min(GAMMA_CAP, gamma))
    lut = [round(255 * ((i / 255.0) ** (1.0 / gamma))) for i in range(256)] * 3
    out = im.point(lut)
    out = ImageEnhance.Color(out).enhance(COLOR)
    return out, mean, luminance_mean(out), gamma

def highlight_pct(im):
    # ほぼ真っ白(>=250)なピクセルの割合（白飛びの目安）
    g = im.convert("L")
    hist = g.histogram()
    return 100.0 * sum(hist[250:]) / (g.width * g.height)

if __name__ == "__main__":
    for path in sys.argv[1:]:
        im = Image.open(path)
        before_hi = highlight_pct(im)
        out, m0, m1, g = brighten(im)
        after_hi = highlight_pct(out)
        if g == 1.0:
            print(f"{path}: 明るさ{m0:.0f} → そのまま（十分明るい）")
        else:
            out.save(path, "JPEG", quality=88, optimize=True)
            print(f"{path}: 明るさ{m0:.0f}→{m1:.0f} (γ={g:.2f}) / 白飛び {before_hi:.1f}%→{after_hi:.1f}%")

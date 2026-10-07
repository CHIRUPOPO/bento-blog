#!/usr/bin/env python3
# =========================================================
# お弁当の写真を自動でブログに追加する（GitHub Actions から呼ばれる）
#
#   ・images/ に新しくアップされた写真を見つける
#   ・名前を images/YYYY-MM-DD.jpg に変えて、明るさ補正する
#   ・obento.js の先頭に1件追加する
#
#   日付:   写真の名前が YYYY-MM-DD ならその日付、
#           ちがうときはアップした日（日本時間）
#   コメント: アップするときの「Commit changes」の入力欄に書いた文
#           （何も書かず「Add files via upload」のままなら空）
#
#   使い方:
#     python3 tools/auto_obento.py 前のコミット 今のコミット
# =========================================================
import os, re, sys, json, subprocess, unicodedata
from PIL import Image, ImageOps

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from brighten import brighten

IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".webp")
DEFAULT_MESSAGES = ("Add files via upload", "Upload")
LIST_START = "const obentoList = ["
PAGE_FILES = ("index.html", "goods.html", "style.css", "goods.js", "health.html", "health.css")


def git(*args):
    return subprocess.run(["git", "-c", "core.quotepath=false", *args],
                          check=True, capture_output=True, text=True).stdout


def nfc(s):
    return unicodedata.normalize("NFC", s)


def added_images(before, after):
    if not before or set(before) == {"0"}:
        before = after + "~1"
    out = git("diff", "--name-only", "--diff-filter=A", "-z", before, after, "--", "images")
    return [p for p in out.split("\0") if p and p.lower().endswith(IMAGE_EXTS)]


def commit_of(path, before, after):
    rng = after if not before or set(before) == {"0"} else f"{before}..{after}"
    return git("log", "-1", "--diff-filter=A", "--format=%H", rng, "--", path).strip() or after


def date_for(path, sha):
    m = re.match(r"(\d{4}-\d{2}-\d{2})", os.path.basename(path))
    if m:
        return m.group(1)
    env = dict(os.environ, TZ="Asia/Tokyo")
    return subprocess.run(["git", "log", "-1", "--format=%cd", "--date=format-local:%Y-%m-%d", sha],
                          check=True, capture_output=True, text=True, env=env).stdout.strip()


def comment_for(sha):
    subject = git("log", "-1", "--format=%s", sha).strip()
    body = git("log", "-1", "--format=%b", sha).strip()
    if subject and not subject.startswith(DEFAULT_MESSAGES):
        return subject
    return body.split("\n\n")[0].replace("\n", " ").strip()


def free_name(date):
    path, n = f"images/{date}.jpg", 2
    while os.path.exists(path):
        path, n = f"images/{date}-{n}.jpg", n + 1
    return path


def main():
    before, after = sys.argv[1], sys.argv[2]
    with open("obento.js", encoding="utf-8") as f:
        js = f.read()
    # ブログのデザイン用の画像（背景・飾り・アイコンなど）はお弁当ではないので、
    # どこかのファイルで使われている画像はスキップする
    known = nfc(js)
    for page in PAGE_FILES:
        if os.path.exists(page):
            with open(page, encoding="utf-8") as f:
                known += nfc(f.read())

    entries, dates = [], []
    for src in added_images(before, after):
        if nfc(src) in known or not os.path.exists(src):
            continue  # すでにブログにのっている写真や、デザイン用の画像はスキップ
        sha = commit_of(src, before, after)
        date = date_for(src, sha)
        comment = comment_for(sha)
        dest = free_name(date)

        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        out, m0, m1, g = brighten(im)
        out.save(dest, "JPEG", quality=88, optimize=True)
        git("rm", "-q", src)
        git("add", dest)
        print(f"{src} → {dest}（明るさ {m0:.0f}→{m1:.0f}）コメント: {comment or '(なし)'}")

        entries.append(
            "\n  {\n"
            f"    date: \"{date}\",\n"
            f"    photo: \"{dest}\",\n"
            f"    comment: {json.dumps(comment, ensure_ascii=False)},\n"
            "  },\n"
        )
        dates.append(date)

    if not entries:
        print("新しいお弁当の写真はありませんでした")
        return

    pos = js.index(LIST_START) + len(LIST_START)
    pos = js.index("\n", pos) + 1
    js = js[:pos] + "".join(entries) + js[pos:]
    with open("obento.js", "w", encoding="utf-8") as f:
        f.write(js)
    git("add", "obento.js")

    label = "・".join(f"{int(d[5:7])}月{int(d[8:10])}日" for d in dict.fromkeys(dates))
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as f:
            f.write(f"label={label}\n")


if __name__ == "__main__":
    main()

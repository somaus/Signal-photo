"""
프레임 원본(흰 배경 PNG/JPG)을 포토부스용 오버레이로 변환한다.

- 가운데 사진 칸만 투명하게 뚫는다 (테두리 선의 안티앨리어싱은 부드럽게 처리)
- 1800x1200 (6x4in @300dpi) 캔버스에 비율 유지로 맞추고 남는 곳은 흰색으로 채운다
- 사진 칸 좌표(slot)를 출력한다 → src/features/photobooth/model/frames.ts 에 붙여넣기

사용법:  python scripts/make-frames.py
  입력: frames-src/*.png|jpg   출력: public/frames/<같은 이름>.png
필요: pip install pillow numpy scipy
"""

import glob
import json
import os

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

OUT_W, OUT_H = 1800, 1200
SRC_DIR = "frames-src"
OUT_DIR = "public/frames"


def find_interior(rgb: np.ndarray):
    """중앙의 흰 사진 칸을 찾는다. 테두리에 틈이 있으면 팽창 반경을 키워가며 막는다."""
    h, w = rgb.shape[:2]
    nonwhite = rgb.min(axis=2) < 235
    for r in range(2, 20, 2):
        closed = ndi.binary_dilation(nonwhite, iterations=r)
        lab, _ = ndi.label(~closed)
        c = lab[h // 2, w // 2]
        if c == 0:
            continue
        core = lab == c
        if not (core[0].any() or core[-1].any() or core[:, 0].any() or core[:, -1].any()):
            return core, r
    raise RuntimeError("사진 칸을 찾지 못했어요. 프레임 테두리가 닫혀 있는지 확인해 주세요.")


def process(path: str):
    src = Image.open(path).convert("RGB")
    rgb = np.asarray(src).astype(np.int16)
    core, r = find_interior(rgb)

    # 팽창으로 줄어든 만큼 다시 넓혀서 테두리 직전까지 투명 처리
    ring = ndi.binary_dilation(core, iterations=r + 3) & ~core
    minch = rgb.min(axis=2)
    alpha = np.full(core.shape, 255.0)
    alpha[core] = 0
    # 흰색에 가까울수록 투명 (min 채널 215 이하 = 불투명, 250 이상 = 투명)
    ring_alpha = np.clip((250 - minch) / (250 - 215), 0, 1) * 255
    alpha[ring] = ring_alpha[ring]

    rgba = np.dstack([rgb.astype(np.uint8), alpha.astype(np.uint8)])
    img = Image.fromarray(rgba, "RGBA")

    sw, sh = src.size
    scale = min(OUT_W / sw, OUT_H / sh)
    nw, nh = round(sw * scale), round(sh * scale)
    img = img.resize((nw, nh), Image.LANCZOS)
    ox, oy = (OUT_W - nw) // 2, (OUT_H - nh) // 2

    canvas = Image.new("RGBA", (OUT_W, OUT_H), (255, 255, 255, 255))
    canvas.paste(img, (ox, oy))

    name = os.path.splitext(os.path.basename(path))[0]
    os.makedirs(OUT_DIR, exist_ok=True)
    canvas.save(os.path.join(OUT_DIR, f"{name}.png"), optimize=True)

    # 사진 칸: 투명 영역 bbox + 테두리 밑으로 살짝 들어가게 여유
    ys, xs = np.where(core)
    pad = (r + 8)
    x0 = max(0, xs.min() - pad) * scale + ox
    y0 = max(0, ys.min() - pad) * scale + oy
    x1 = min(sw, xs.max() + pad) * scale + ox
    y1 = min(sh, ys.max() + pad) * scale + oy
    slot = {
        "x": round(x0 / OUT_W, 4),
        "y": round(y0 / OUT_H, 4),
        "w": round((x1 - x0) / OUT_W, 4),
        "h": round((y1 - y0) / OUT_H, 4),
    }
    return name, slot


if __name__ == "__main__":
    files = sorted(glob.glob(f"{SRC_DIR}/*.png") + glob.glob(f"{SRC_DIR}/*.jpg"))
    for f in files:
        name, slot = process(f)
        print(name, json.dumps(slot))

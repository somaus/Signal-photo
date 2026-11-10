import type { Frame } from "./types";

/** 사진 한 장(프레임) 크기: 6x4in @ 300dpi 가로형 */
export const CANVAS_WIDTH = 1800;
export const CANVAS_HEIGHT = 1200;
export const CANVAS_RATIO = CANVAS_WIDTH / CANVAS_HEIGHT;

/**
 * 프레임 목록.
 *
 * 새 프레임 추가 방법
 * 1. 흰 배경 프레임 원본을 `frames-src/` 에 넣는다. (가운데 사진 칸은 흰색, 테두리는 닫혀 있게)
 * 2. `python scripts/make-frames.py` 실행 → `public/frames/<이름>.png` 생성 + slot 좌표 출력
 * 3. 아래 배열에 항목을 추가하고 출력된 slot 값을 붙여넣는다.
 */
export const FRAMES: Frame[] = [
  {
    id: "pastel-star",
    name: "파스텔 별빛",
    description: "별을 품은 마스코트",
    overlaySrc: "/frames/pastel-star.png",
    background: "#ffffff",
    slot: { x: 0.0942, y: 0.2294, w: 0.8138, h: 0.6002 },
  },
  {
    id: "detective",
    name: "AI 딥페이크 탐정",
    description: "Signal 탐정과 함께",
    overlaySrc: "/frames/detective.png",
    background: "#ffffff",
    slot: { x: 0.0931, y: 0.1738, w: 0.8112, h: 0.6807 },
  },
];

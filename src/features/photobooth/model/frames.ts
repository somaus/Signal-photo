import type { Frame, FrameSlot } from "./types";

/** 인쇄 캔버스 크기 (4x6in @ 300dpi) */
export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 1800;

const DEFAULT_SLOT: FrameSlot = {
  x: 100 / CANVAS_WIDTH,
  y: 100 / CANVAS_HEIGHT,
  w: 1000 / CANVAS_WIDTH,
  h: 1250 / CANVAS_HEIGHT,
};

/**
 * 프레임 목록.
 *
 * 새 프레임 추가 방법
 * 1. 1200x1800 투명 PNG 를 `public/frames/` 에 넣는다. (사진 들어갈 영역은 투명하게 뚫기)
 * 2. 아래 배열에 항목을 추가하고 `overlaySrc` 에 경로를 적는다.
 *    - 오버레이에 문구/로고가 이미 있으면 `caption: false`
 *    - 사진 영역이 기본(100,100,1000x1250)과 다르면 `slot` 을 지정한다.
 *
 * 아래 3개는 오버레이 없이 색상만으로 만든 임시 프레임이다.
 */
export const FRAMES: Frame[] = [
  {
    id: "signal-classic",
    name: "클래식 화이트",
    description: "깔끔한 기본 프레임",
    colors: ["#ffffff", "#dce7f0"],
    textColor: "#253e54",
    caption: true,
    slot: DEFAULT_SLOT,
  },
  {
    id: "signal-navy",
    name: "시그널 네이비",
    description: "Signal 대표 컬러",
    colors: ["#2d4b66", "#14222e"],
    textColor: "#ffffff",
    caption: true,
    slot: DEFAULT_SLOT,
  },
  {
    id: "signal-purple",
    name: "라벤더 시그널",
    description: "부드러운 퍼플 무드",
    colors: ["#f5eaf9", "#d4b7e6"],
    textColor: "#5f4870",
    caption: true,
    slot: DEFAULT_SLOT,
  },
  // 예시)
  // {
  //   id: "signal-01",
  //   name: "프레임 이름",
  //   description: "한 줄 설명",
  //   colors: ["#ffffff", "#ffffff"],
  //   textColor: "#253e54",
  //   caption: false,
  //   overlaySrc: "/frames/signal-01.png",
  //   slot: DEFAULT_SLOT,
  // },
];

export type Step = "start" | "frame" | "filter" | "capture" | "review" | "printing" | "result";

/** 캔버스(인쇄용) 기준 비율로 표현한 사진 영역. 0~1 */
export interface FrameSlot {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Frame {
  id: string;
  name: string;
  description: string;
  /** 위 → 아래 그라데이션 배경색 (오버레이 PNG 가 없을 때의 기본 배경) */
  colors: [string, string];
  /** 하단 캡션 글자색 */
  textColor: string;
  /** 하단 "SIGNAL" 캡션을 그릴지 여부. 디자인된 오버레이를 쓰면 false */
  caption: boolean;
  /** 1200x1800 투명 PNG. 사진 영역은 뚫려 있어야 함. 예: "/frames/signal-01.png" */
  overlaySrc?: string;
  slot: FrameSlot;
}

export interface Filter {
  id: string;
  name: string;
  /** CSS / Canvas `filter` 문자열 */
  css: string;
}

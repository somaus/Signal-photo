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
  /** 사진 칸이 투명하게 뚫린 1800x1200 PNG. scripts/make-frames.py 로 생성 */
  overlaySrc: string;
  /** 오버레이 아래 깔리는 배경색 */
  background: string;
  /** 사진이 들어갈 영역. make-frames.py 출력값을 그대로 붙여넣는다 */
  slot: FrameSlot;
}

export interface Filter {
  id: string;
  name: string;
  /** CSS / Canvas `filter` 문자열 */
  css: string;
}

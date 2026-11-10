import type { ReactNode } from "react";
import { CANVAS_RATIO } from "../model/frames";
import type { Frame } from "../model/types";

interface FrameStageProps {
  frame: Frame;
  /** 사진 영역에 들어갈 내용 (라이브 카메라 등). 없으면 자리표시자 */
  children?: ReactNode;
  className?: string;
}

/** 프레임을 CSS 로 미리 보여주는 컴포넌트. compose.ts 의 캔버스 레이아웃과 같은 비율을 쓴다. */
export default function FrameStage({ frame, children, className = "" }: FrameStageProps) {
  const { slot } = frame;
  return (
    <div
      className={`@container relative overflow-hidden rounded-lg shadow-xl ${className}`}
      style={{ aspectRatio: CANVAS_RATIO, background: frame.background }}
    >
      <div
        className="absolute overflow-hidden bg-gray-200"
        style={{
          left: `${slot.x * 100}%`,
          top: `${slot.y * 100}%`,
          width: `${slot.w * 100}%`,
          height: `${slot.h * 100}%`,
        }}
      >
        {children ?? <SlotPlaceholder />}
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={frame.overlaySrc}
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 size-full"
      />
    </div>
  );
}

function SlotPlaceholder() {
  return (
    <div className="from-primary-100 to-secondary-100 flex size-full items-center justify-center bg-linear-to-br">
      <svg className="h-1/3 text-white/90" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
      </svg>
    </div>
  );
}

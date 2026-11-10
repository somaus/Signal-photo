import type { ReactNode } from "react";
import { formatDate } from "../lib/compose";
import type { Frame } from "../model/types";

interface FrameStageProps {
  frame: Frame;
  /** 사진 영역에 들어갈 내용 (라이브 카메라 등). 없으면 자리표시자 */
  children?: ReactNode;
  className?: string;
}

/**
 * 프레임을 CSS 로 미리 보여주는 컴포넌트. compose.ts 의 캔버스 레이아웃과 동일한 비율을 쓴다.
 * 내부 크기 단위는 cqw (컨테이너 너비 기준) 이므로 어떤 크기로 그려도 비율이 유지된다.
 */
export default function FrameStage({ frame, children, className = "" }: FrameStageProps) {
  const { slot } = frame;
  return (
    <div
      className={`@container relative aspect-2/3 overflow-hidden rounded-lg shadow-xl ${className}`}
      style={{ background: `linear-gradient(to bottom, ${frame.colors[0]}, ${frame.colors[1]})` }}
    >
      <div
        className="absolute overflow-hidden rounded-[2cqw] bg-gray-200"
        style={{
          left: `${slot.x * 100}%`,
          top: `${slot.y * 100}%`,
          width: `${slot.w * 100}%`,
          height: `${slot.h * 100}%`,
        }}
      >
        {children ?? <SlotPlaceholder />}
      </div>

      {frame.overlaySrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={frame.overlaySrc}
          alt=""
          className="pointer-events-none absolute inset-0 size-full"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      {frame.caption && (
        <>
          <span
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pl-[1.3cqw] text-[9cqw] leading-none font-bold tracking-[1.3cqw] whitespace-nowrap"
            style={{ top: "85%", color: frame.textColor }}
          >
            SIGNAL
          </span>
          <span
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[3.2cqw] leading-none font-medium tracking-[0.3cqw] whitespace-nowrap opacity-70"
            style={{ top: "90.3%", color: frame.textColor }}
          >
            {formatDate()}
          </span>
        </>
      )}
    </div>
  );
}

function SlotPlaceholder() {
  return (
    <div className="from-primary-100 to-secondary-100 flex size-full items-center justify-center bg-linear-to-br">
      <svg className="w-1/4 text-white/90" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
      </svg>
    </div>
  );
}

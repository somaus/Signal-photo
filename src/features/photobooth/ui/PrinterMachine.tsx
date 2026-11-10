import { CANVAS_RATIO } from "../model/frames";

interface PrinterMachineProps {
  /** 합성 완료된 인쇄 이미지 (data URL) */
  photo: string;
  /** 0~1. 용지가 배출된 정도 */
  progress: number;
  /** 배출 애니메이션 길이(ms) */
  durationMs?: number;
  /** 인화 중 흐릿 → 선명 효과 */
  developing?: boolean;
  className?: string;
}

/**
 * 인생네컷 기계처럼 슬롯에서 가로형 사진이 아래로 출력되는 일러스트.
 * 폭(W) 기준: 본체 높이 0.3W, 용지 폭 0.8W (가로형 3:2 → 높이 약 0.53W).
 */
export default function PrinterMachine({
  photo,
  progress,
  durationMs = 1000,
  developing = false,
  className = "",
}: PrinterMachineProps) {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <div
      className={`@container relative aspect-100/86 w-[min(86vw,58dvh)] ${className}`}
      aria-hidden
    >
      {/* 용지: 슬롯 아래 영역에서만 보이도록 클리핑 */}
      <div className="absolute inset-x-0 top-[32%] bottom-0 overflow-hidden">
        <div
          className="absolute top-0 left-[10%] w-[80%]"
          style={{
            aspectRatio: CANVAS_RATIO,
            transform: `translateY(${-(1 - p) * 100}%)`,
            transition: `transform ${durationMs}ms linear`,
          }}
        >
          <div className="size-full overflow-hidden rounded-[1cqw] bg-white shadow-2xl ring-1 ring-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt=""
              className="size-full object-cover"
              style={{
                filter: developing
                  ? `blur(${(1 - p) * 10}px) grayscale(${1 - p}) brightness(${1.2 - p * 0.2})`
                  : undefined,
                transition: `filter ${durationMs}ms linear`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 본체 */}
      <div className="from-primary-500 to-primary-700 absolute inset-x-0 top-0 h-[35%] rounded-[4cqw] bg-linear-to-b shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-[4cqw] bg-linear-to-b from-white/20 to-transparent" />
        <div className="absolute top-[16%] left-[6%] flex items-center gap-[1.6cqw]">
          <span className="bg-secondary-300 shadow-secondary-300 animate-blink size-[2cqw] rounded-full shadow-[0_0_8px]" />
          <span className="text-[3.4cqw] font-bold tracking-[0.7cqw] text-white/90">SIGNAL</span>
        </div>
        <div className="bg-primary-800/60 absolute top-[16%] right-[6%] h-[2.8cqw] w-[12cqw] rounded-full" />
        {/* 배출 슬롯 */}
        <div className="bg-primary-900 absolute inset-x-[7%] bottom-[10%] h-[3cqw] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
      </div>
    </div>
  );
}

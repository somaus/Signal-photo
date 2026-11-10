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
 * 인생네컷 기계처럼 슬롯에서 사진이 아래로 출력되는 일러스트.
 * 폭(W) 기준 비율: 본체 0~0.5W, 슬롯 0.5W, 용지 폭 0.66W / 높이 0.99W.
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
      className={`@container relative aspect-100/150 w-[min(86vw,38dvh)] ${className}`}
      aria-hidden
    >
      {/* 용지: 슬롯 아래 영역에서만 보이도록 클리핑 */}
      <div className="absolute inset-x-0 top-[33.3%] bottom-0 overflow-hidden">
        <div
          className="absolute top-0 left-[17%] aspect-2/3 w-[66%]"
          style={{
            transform: `translateY(${-(1 - p) * 100}%)`,
            transition: `transform ${durationMs}ms linear`,
          }}
        >
          <div className="size-full overflow-hidden rounded-[1.2cqw] bg-white shadow-2xl ring-1 ring-black/5">
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
      <div className="from-primary-500 to-primary-700 absolute inset-x-0 top-0 h-[33.3%] rounded-[5cqw] bg-linear-to-b shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-[5cqw] bg-linear-to-b from-white/20 to-transparent" />
        <div className="absolute top-[14%] left-[8%] flex items-center gap-[2cqw]">
          <span className="bg-secondary-300 shadow-secondary-300 animate-blink size-[2.4cqw] rounded-full shadow-[0_0_8px]" />
          <span className="text-[4cqw] font-bold tracking-[0.8cqw] text-white/90">SIGNAL</span>
        </div>
        <div className="bg-primary-800/60 absolute top-[14%] right-[8%] h-[3.4cqw] w-[14cqw] rounded-full" />
        {/* 배출 슬롯 */}
        <div className="bg-primary-900 absolute inset-x-[8%] bottom-[8%] h-[3.6cqw] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
      </div>
    </div>
  );
}

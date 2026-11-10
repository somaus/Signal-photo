interface CopiesStepperProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
}

/** 인쇄 매수 선택 (− n장 +) */
export default function CopiesStepper({ value, min = 1, max, onChange }: CopiesStepperProps) {
  const button =
    "flex size-12 cursor-pointer items-center justify-center rounded-full bg-white text-primary-600 shadow-md ring-1 ring-gray-300 transition-all hover:bg-secondary-100 active:scale-90 disabled:cursor-not-allowed disabled:text-gray-500 disabled:hover:bg-white disabled:active:scale-100";

  return (
    <div className="flex items-center gap-4" role="group" aria-label="인쇄 매수">
      <span className="text-body-1 font-semibold text-gray-700">인쇄 매수</span>
      <div className="flex items-center gap-3 rounded-full bg-white/70 p-1.5 shadow-md backdrop-blur">
        <button
          type="button"
          className={button}
          aria-label="한 장 줄이기"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <output
          aria-live="polite"
          className="text-h3 text-primary-600 min-w-16 text-center font-bold tabular-nums"
        >
          {value}장
        </output>
        <button
          type="button"
          className={button}
          aria-label="한 장 늘리기"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

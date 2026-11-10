import Button from "@/shared/ui/Button";
import Backdrop from "../Backdrop";

export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Backdrop />

      {/* 장식 */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Polaroid
          className="top-[9%] left-[7%] -rotate-12"
          tone="from-primary-200 to-primary-400"
        />
        <Polaroid
          className="top-[14%] right-[8%] rotate-9"
          tone="from-secondary-200 to-secondary-600"
        />
        <Polaroid
          className="bottom-[10%] left-[10%] rotate-6"
          tone="from-secondary-100 to-secondary-500"
        />
        <Polaroid
          className="right-[9%] bottom-[12%] -rotate-8"
          tone="from-primary-100 to-primary-300"
        />
      </div>

      <div className="animate-step-in relative z-10 flex flex-col items-center">
        <span className="text-small text-secondary-800 rounded-full bg-white/80 px-5 py-2 font-semibold tracking-wide shadow-md backdrop-blur">
          SIGNAL BOOTH EVENT
        </span>

        <h1 className="text-primary-600 mt-6 text-[clamp(44px,9vmin,96px)] leading-[1.1] font-bold tracking-tight">
          Signal
          <span className="from-secondary-800 to-primary-400 bg-linear-to-r bg-clip-text text-transparent">
            {" "}
            포토부스
          </span>
        </h1>
        <p className="text-body-1 text-gray-650 sm:text-h3 mt-5 max-w-md">
          찰칵 한 번이면 끝.
          <br />
          찍은 사진은 바로 인쇄해서 가져가세요.
        </p>

        <Button
          size="lg"
          onClick={onStart}
          className="text-h3! animate-pop mt-12 min-w-64 [animation-delay:0.3s]"
        >
          <CameraIcon />
          시작하기
        </Button>

        <p className="text-small text-gray-650 mt-5">화면을 터치해 시작해 주세요</p>
      </div>
    </main>
  );
}

function Polaroid({ className, tone }: { className: string; tone: string }) {
  return (
    <div
      className={`animate-float absolute hidden w-[16vmin] max-w-44 rounded-sm bg-white p-[1.2vmin] pb-[4vmin] shadow-2xl sm:block ${className}`}
    >
      <div className={`aspect-square w-full bg-linear-to-br ${tone}`} />
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

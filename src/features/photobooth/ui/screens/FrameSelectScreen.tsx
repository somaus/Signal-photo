import Button from "@/shared/ui/Button";
import type { Frame } from "../../model/types";
import BoothLayout from "../BoothLayout";
import FrameStage from "../FrameStage";

interface FrameSelectScreenProps {
  frames: Frame[];
  selected: Frame;
  onSelect: (frame: Frame) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function FrameSelectScreen({
  frames,
  selected,
  onSelect,
  onNext,
  onBack,
}: FrameSelectScreenProps) {
  return (
    <BoothLayout
      stepIndex={0}
      title="프레임을 골라주세요"
      description="마음에 드는 프레임을 터치하세요"
      onBack={onBack}
      footer={
        <Button size="lg" className="w-full max-w-md" onClick={onNext}>
          이 프레임으로 선택
        </Button>
      }
    >
      <div className="min-h-0 flex-1 overflow-y-auto py-3">
        <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-1 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {frames.map((frame, index) => {
            const active = frame.id === selected.id;
            return (
              <li
                key={frame.id}
                className="animate-step-in"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <button
                  type="button"
                  onClick={() => onSelect(frame)}
                  aria-pressed={active}
                  className={[
                    "group relative flex w-full cursor-pointer flex-col items-center gap-3 rounded-2xl p-3 transition-all active:scale-[0.97]",
                    active
                      ? "ring-primary-400 bg-white shadow-xl ring-4"
                      : "bg-white/60 shadow-md ring-1 ring-gray-300 hover:bg-white",
                  ].join(" ")}
                >
                  <FrameStage frame={frame} className="w-full" />
                  <span className="text-center">
                    <span className="text-body-2 text-primary-600 block font-bold">
                      {frame.name}
                    </span>
                    <span className="text-small text-gray-650 block">{frame.description}</span>
                  </span>
                  {active && (
                    <span className="animate-pop bg-primary-600 absolute top-5 right-5 flex size-9 items-center justify-center rounded-full text-white shadow-lg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M5 12.5l4.5 4.5L19 7"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </BoothLayout>
  );
}

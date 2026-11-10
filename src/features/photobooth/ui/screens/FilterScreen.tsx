"use client";

import { useRef } from "react";
import Button from "@/shared/ui/Button";
import type { Filter, Frame } from "../../model/types";
import BoothLayout from "../BoothLayout";
import CameraView from "../CameraView";
import FrameStage from "../FrameStage";
import StageBox from "../StageBox";

interface FilterScreenProps {
  frame: Frame;
  filters: Filter[];
  selected: Filter;
  stream: MediaStream | null;
  cameraError: string | null;
  onRetryCamera: () => void;
  onSelect: (filter: Filter) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function FilterScreen({
  frame,
  filters,
  selected,
  stream,
  cameraError,
  onRetryCamera,
  onSelect,
  onNext,
  onBack,
}: FilterScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <BoothLayout
      stepIndex={1}
      title="필터를 골라주세요"
      description="지금 모습이 그대로 미리보기에 나와요"
      onBack={onBack}
      footer={
        <Button size="lg" className="w-full max-w-md" onClick={onNext} disabled={!stream}>
          촬영하러 가기
        </Button>
      }
    >
      <StageBox>
        <FrameStage frame={frame} className="size-full">
          {cameraError ? (
            <CameraError message={cameraError} onRetry={onRetryCamera} />
          ) : (
            <CameraView stream={stream} videoRef={videoRef} filterCss={selected.css} />
          )}
        </FrameStage>
      </StageBox>

      <ul className="mx-auto mt-4 flex w-full max-w-3xl shrink-0 gap-2.5 overflow-x-auto px-1 py-2 sm:justify-center">
        {filters.map((filter) => {
          const active = filter.id === selected.id;
          return (
            <li key={filter.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(filter)}
                aria-pressed={active}
                className={[
                  "text-body-2 min-h-12 cursor-pointer rounded-full px-5 py-2.5 font-semibold whitespace-nowrap transition-all active:scale-95",
                  active
                    ? "bg-primary-600 text-white shadow-lg"
                    : "bg-white/80 text-gray-700 shadow-md ring-1 ring-gray-300 hover:bg-white",
                ].join(" ")}
              >
                {filter.name}
              </button>
            </li>
          );
        })}
      </ul>
    </BoothLayout>
  );
}

export function CameraError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-primary-50 flex size-full flex-col items-center justify-center gap-3 p-[6cqw] text-center">
      <p className="text-primary-600 text-[4.4cqw] font-semibold">{message}</p>
      <Button onClick={onRetry} className="text-[3.6cqw]!">
        다시 시도
      </Button>
    </div>
  );
}

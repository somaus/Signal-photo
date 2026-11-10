"use client";

import { useEffect, useRef, useState } from "react";
import { grabFrame } from "../../lib/useCamera";
import { COUNTDOWN_SECONDS } from "../../model/config";
import type { Filter, Frame } from "../../model/types";
import BoothLayout from "../BoothLayout";
import CameraView from "../CameraView";
import FrameStage from "../FrameStage";
import StageBox from "../StageBox";
import { CameraError } from "./FilterScreen";

interface CaptureScreenProps {
  frame: Frame;
  filter: Filter;
  stream: MediaStream | null;
  cameraError: string | null;
  onRetryCamera: () => void;
  onCapture: (shot: string) => void;
  onBack: () => void;
}

export default function CaptureScreen({
  frame,
  filter,
  stream,
  cameraError,
  onRetryCamera,
  onCapture,
  onBack,
}: CaptureScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onCaptureRef = useRef(onCapture);
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    onCaptureRef.current = onCapture;
  }, [onCapture]);

  useEffect(() => {
    if (count === null) return;
    const timer = window.setTimeout(() => {
      if (count > 1) {
        setCount(count - 1);
        return;
      }
      const video = videoRef.current;
      const shot = video ? grabFrame(video) : null;
      if (shot) onCaptureRef.current(shot);
      else setCount(null);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [count]);

  const counting = count !== null;

  return (
    <BoothLayout
      stepIndex={2}
      title={counting ? "포즈!" : "준비되면 촬영 버튼을 눌러주세요"}
      description={counting ? "카메라를 바라봐 주세요" : "버튼을 누르면 3초 뒤에 찍혀요"}
      onBack={counting ? undefined : onBack}
      footer={
        <button
          type="button"
          aria-label="촬영"
          disabled={!ready || counting}
          onClick={() => setCount(COUNTDOWN_SECONDS)}
          className="group ring-primary-300 hover:ring-primary-400 flex size-24 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-xl ring-4 transition-all active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="from-primary-400 to-primary-600 size-[72px] rounded-full bg-linear-to-b shadow-inner transition-all group-active:scale-90" />
        </button>
      }
    >
      <StageBox>
        <FrameStage frame={frame} className="size-full">
          {cameraError ? (
            <CameraError message={cameraError} onRetry={onRetryCamera} />
          ) : (
            <CameraView
              stream={stream}
              videoRef={videoRef}
              filterCss={filter.css}
              onReady={() => setReady(true)}
            />
          )}
          {counting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span
                key={count}
                className="animate-count text-[40cqw] leading-none font-bold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
              >
                {count}
              </span>
            </div>
          )}
        </FrameStage>
      </StageBox>
    </BoothLayout>
  );
}

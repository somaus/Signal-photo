"use client";

import { useCallback, useState } from "react";
import { useCamera } from "../lib/useCamera";
import { FILTERS } from "../model/filters";
import { FRAMES } from "../model/frames";
import type { Filter, Frame, Step } from "../model/types";
import CaptureScreen from "./screens/CaptureScreen";
import FilterScreen from "./screens/FilterScreen";
import FrameSelectScreen from "./screens/FrameSelectScreen";
import PrintingScreen from "./screens/PrintingScreen";
import ResultScreen from "./screens/ResultScreen";
import ReviewScreen from "./screens/ReviewScreen";
import StartScreen from "./screens/StartScreen";

/**
 * 포토부스 플로우
 * start → frame → filter → capture → review(다시 찍기 ↺ capture) → printing → result → start
 */
export default function PhotoBooth() {
  const camera = useCamera();
  const [step, setStep] = useState<Step>("start");
  const [frame, setFrame] = useState<Frame>(FRAMES[0]);
  const [filter, setFilter] = useState<Filter>(FILTERS[0]);
  const [shot, setShot] = useState<string | null>(null);
  const [printed, setPrinted] = useState<string | null>(null);

  const { start: startCamera, stop: stopCamera } = camera;

  const handleStart = useCallback(() => {
    void startCamera();
    setStep("frame");
  }, [startCamera]);

  const handleRestart = useCallback(() => {
    stopCamera();
    setShot(null);
    setPrinted(null);
    setFrame(FRAMES[0]);
    setFilter(FILTERS[0]);
    setStep("start");
  }, [stopCamera]);

  switch (step) {
    case "start":
      return <StartScreen onStart={handleStart} />;

    case "frame":
      return (
        <FrameSelectScreen
          frames={FRAMES}
          selected={frame}
          onSelect={setFrame}
          onNext={() => setStep("filter")}
          onBack={handleRestart}
        />
      );

    case "filter":
      return (
        <FilterScreen
          frame={frame}
          filters={FILTERS}
          selected={filter}
          stream={camera.stream}
          cameraError={camera.error}
          onRetryCamera={startCamera}
          onSelect={setFilter}
          onNext={() => setStep("capture")}
          onBack={() => setStep("frame")}
        />
      );

    case "capture":
      return (
        <CaptureScreen
          frame={frame}
          filter={filter}
          stream={camera.stream}
          cameraError={camera.error}
          onRetryCamera={startCamera}
          onCapture={(url) => {
            setShot(url);
            setStep("review");
          }}
          onBack={() => setStep("filter")}
        />
      );

    case "review":
      return shot ? (
        <ReviewScreen
          shot={shot}
          frame={frame}
          filter={filter}
          onRetake={() => {
            setShot(null);
            setStep("capture");
          }}
          onConfirm={(composed) => {
            setPrinted(composed);
            // 인쇄 후에는 카메라가 필요 없다
            stopCamera();
            setStep("printing");
          }}
        />
      ) : null;

    case "printing":
      return printed ? <PrintingScreen photo={printed} onDone={() => setStep("result")} /> : null;

    case "result":
      return printed ? <ResultScreen photo={printed} onRestart={handleRestart} /> : null;
  }
}

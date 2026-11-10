"use client";

import { useEffect, type RefObject } from "react";

interface CameraViewProps {
  stream: MediaStream | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  filterCss?: string;
  onReady?: () => void;
}

/** 거울 모드 라이브 카메라. 부모(FrameStage 사진 영역)를 꽉 채운다. */
export default function CameraView({ stream, videoRef, filterCss, onReady }: CameraViewProps) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;
    video.srcObject = stream;
    video.play().catch(() => {});
  }, [stream, videoRef]);

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      autoPlay
      onLoadedData={onReady}
      className="size-full -scale-x-100 object-cover"
      style={{ filter: filterCss && filterCss !== "none" ? filterCss : undefined }}
    />
  );
}

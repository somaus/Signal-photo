"use client";

import { useEffect, useRef, useState } from "react";
import { printImage } from "../../lib/print";
import { PRINT_DURATION_MS } from "../../model/config";
import BoothLayout from "../BoothLayout";
import PrinterMachine from "../PrinterMachine";

interface PrintingScreenProps {
  photo: string;
  onDone: () => void;
}

const MESSAGES = [
  { until: 0.3, text: "사진을 보정하고 있어요" },
  { until: 0.6, text: "프린터로 보내고 있어요" },
  { until: 1.01, text: "한 장 한 장 인화하는 중이에요" },
];

export default function PrintingScreen({ photo, onDone }: PrintingScreenProps) {
  const [progress, setProgress] = useState(0);
  const printedRef = useRef(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  // 프린터로 한 번만 전송
  useEffect(() => {
    if (printedRef.current) return;
    printedRef.current = true;
    void printImage(photo);
  }, [photo]);

  // 진행률 + 완료 처리
  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const ratio = Math.min(1, (Date.now() - startedAt) / PRINT_DURATION_MS);
      setProgress(ratio);
      if (ratio >= 1) {
        window.clearInterval(timer);
        onDoneRef.current();
      }
    }, 200);
    return () => window.clearInterval(timer);
  }, []);

  const message = (MESSAGES.find((m) => progress < m.until) ?? MESSAGES[MESSAGES.length - 1]).text;
  const remaining = Math.max(0, Math.ceil(((1 - progress) * PRINT_DURATION_MS) / 1000));

  return (
    <BoothLayout title="사진을 인쇄하고 있어요" description="잠시만 기다려 주세요. 곧 나와요!">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6">
        <PrinterMachine photo={photo} progress={progress} durationMs={400} developing />

        <div className="w-full max-w-md" role="status" aria-live="polite">
          <div className="h-3 overflow-hidden rounded-full bg-white/80 shadow-inner ring-1 ring-gray-300">
            <div
              className="from-primary-400 via-secondary-700 to-primary-400 animate-shimmer h-full rounded-full bg-linear-to-r bg-size-[200%_100%] transition-[width] duration-200 ease-linear"
              style={{ width: `${Math.max(4, progress * 100)}%` }}
            />
          </div>
          <p className="text-body-1 text-primary-600 mt-3 text-center font-semibold">{message}</p>
          <p className="text-small text-gray-650 mt-0.5 text-center">약 {remaining}초 남았어요</p>
        </div>
      </div>
    </BoothLayout>
  );
}

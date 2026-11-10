"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/shared/ui/Button";
import { RESULT_IDLE_SECONDS } from "../../model/config";
import BoothLayout from "../BoothLayout";
import PrinterMachine from "../PrinterMachine";

interface ResultScreenProps {
  photo: string;
  onRestart: () => void;
}

export default function ResultScreen({ photo, onRestart }: ResultScreenProps) {
  const [out, setOut] = useState(false);
  const [seconds, setSeconds] = useState(RESULT_IDLE_SECONDS);
  const onRestartRef = useRef(onRestart);

  useEffect(() => {
    onRestartRef.current = onRestart;
  }, [onRestart]);

  // 마운트 직후 슬롯에서 사진이 스르륵 나오는 연출
  useEffect(() => {
    const timer = window.setTimeout(() => setOut(true), 250);
    return () => window.clearTimeout(timer);
  }, []);

  // 자동 복귀
  useEffect(() => {
    if (seconds <= 0) {
      onRestartRef.current();
      return;
    }
    const timer = window.setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  return (
    <BoothLayout
      title="완성! 사진이 나왔어요 🎉"
      description="프린터에서 사진을 가져가 주세요"
      footer={
        <>
          <Button size="lg" className="w-full max-w-md" onClick={onRestart}>
            처음으로
          </Button>
          <p className="text-small text-gray-650">
            {seconds}초 뒤에 자동으로 처음 화면으로 돌아가요
          </p>
        </>
      }
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <PrinterMachine photo={photo} progress={out ? 1 : 0} durationMs={2600} />
      </div>
    </BoothLayout>
  );
}

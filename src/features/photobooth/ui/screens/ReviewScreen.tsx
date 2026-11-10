"use client";

import { useEffect, useState } from "react";
import Button from "@/shared/ui/Button";
import { composePhoto } from "../../lib/compose";
import type { Filter, Frame } from "../../model/types";
import BoothLayout from "../BoothLayout";
import StageBox from "../StageBox";

interface ReviewScreenProps {
  shot: string;
  frame: Frame;
  filter: Filter;
  onRetake: () => void;
  onConfirm: (composed: string) => void;
}

export default function ReviewScreen({
  shot,
  frame,
  filter,
  onRetake,
  onConfirm,
}: ReviewScreenProps) {
  const [composed, setComposed] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    composePhoto(shot, frame, filter)
      .then((url) => {
        if (!cancelled) setComposed(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [shot, frame, filter]);

  return (
    <BoothLayout
      stepIndex={3}
      title="사진이 마음에 드시나요?"
      description="마음에 들지 않으면 다시 찍을 수 있어요"
      footer={
        <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
          <Button size="lg" variant="outline" className="flex-1" onClick={onRetake}>
            <RetakeIcon />
            다시 찍기
          </Button>
          <Button
            size="lg"
            className="flex-[1.4]"
            disabled={!composed}
            onClick={() => composed && onConfirm(composed)}
          >
            <PrintIcon />이 사진으로 인쇄하기
          </Button>
        </div>
      }
    >
      <StageBox>
        <div className="relative size-full">
          {composed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={composed}
              alt="촬영한 사진 미리보기"
              className="animate-pop size-full rounded-lg object-cover shadow-2xl"
            />
          ) : (
            <div className="flex size-full items-center justify-center rounded-lg bg-white/70 shadow-xl">
              <p className="animate-blink text-body-1 text-primary-450 font-semibold">
                {failed ? "사진을 불러오지 못했어요. 다시 찍어주세요." : "사진을 만드는 중…"}
              </p>
            </div>
          )}
          {/* 셔터 플래시 */}
          <div className="animate-flash pointer-events-none absolute inset-0 rounded-lg bg-white" />
        </div>
      </StageBox>
    </BoothLayout>
  );
}

function RetakeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12a8 8 0 108-8H8m0 0l3-3M8 4l3 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 9V4h10v5M7 17H5a1 1 0 01-1-1v-6a1 1 0 011-1h14a1 1 0 011 1v6a1 1 0 01-1 1h-2M7 14h10v6H7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

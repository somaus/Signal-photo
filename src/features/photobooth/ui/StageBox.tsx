import type { ReactNode } from "react";

/** 남는 세로 공간에 2:3 스테이지를 높이 기준으로 꽉 채워 가운데 정렬 */
export default function StageBox({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-0 flex-1">
      <div className="absolute inset-y-0 left-1/2 aspect-2/3 -translate-x-1/2">{children}</div>
    </div>
  );
}

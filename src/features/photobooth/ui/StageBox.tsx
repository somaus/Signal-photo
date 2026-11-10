import type { ReactNode } from "react";
import { CANVAS_RATIO } from "../model/frames";

/** 남는 공간 안에 프레임 비율 그대로 최대한 크게 가운데 정렬 */
export default function StageBox({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-0 flex-1" style={{ containerType: "size" }}>
      <div
        className="absolute top-1/2 left-1/2 -translate-1/2"
        style={{
          width: `min(100cqw, ${CANVAS_RATIO * 100}cqh)`,
          aspectRatio: CANVAS_RATIO,
        }}
      >
        {children}
      </div>
    </div>
  );
}

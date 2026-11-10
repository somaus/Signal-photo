/** 카운트다운 시작 숫자 */
export const COUNTDOWN_SECONDS = 3;

/** 인쇄 로딩 화면 최소 유지 시간. 프린터 인화 시간에 맞춰 .env 로 조절 */
export const PRINT_DURATION_MS = Number(process.env.NEXT_PUBLIC_PRINT_DURATION_MS ?? 15000);

/** false 면 window.print() 를 호출하지 않는다 (개발용) */
export const PRINT_ENABLED = process.env.NEXT_PUBLIC_PRINT_ENABLED !== "false";

/**
 * 인쇄 용지 크기 (CSS @page size 값). 예: "landscape"(프린터 기본 용지 가로), "6in 4in"
 * 사진은 용지 안에 비율을 유지한 채 꽉 차게(페이지에 맞게 축소) 들어간다.
 */
export const PRINT_PAGE_SIZE = process.env.NEXT_PUBLIC_PRINT_PAGE_SIZE ?? "landscape";

/** 결과 화면에서 처음으로 자동 복귀까지 걸리는 시간(초) */
export const RESULT_IDLE_SECONDS = Number(process.env.NEXT_PUBLIC_RESULT_IDLE_SECONDS ?? 30);

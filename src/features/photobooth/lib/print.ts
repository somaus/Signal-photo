import { PRINT_ENABLED, PRINT_PAGE_SIZE } from "../model/config";

/**
 * 합성된 사진 한 장을 "페이지에 맞게 축소" 방식으로 인쇄한다.
 * 이미지는 용지 안에 비율을 유지한 채(object-fit: contain) 꽉 차게 들어가고, 넘쳐서 잘리거나
 * 2쪽으로 넘어가지 않는다.
 *
 * 포토 프린터를 OS 기본 프린터로 지정하고, 크롬을 `--kiosk-printing` 옵션으로 실행하면
 * 인쇄 대화상자 없이 바로 출력된다.
 *   chrome.exe --kiosk --kiosk-printing http://localhost:3000
 */
export function printImage(src: string): Promise<void> {
  if (!PRINT_ENABLED) return Promise.resolve();

  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    Object.assign(iframe.style, {
      position: "fixed",
      right: "0",
      bottom: "0",
      width: "0",
      height: "0",
      border: "0",
      visibility: "hidden",
    });
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;
    if (!doc || !win) {
      iframe.remove();
      resolve();
      return;
    }

    const style = doc.createElement("style");
    style.textContent = `
      @page { size: ${PRINT_PAGE_SIZE}; margin: 0; }
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
      body { display: flex; align-items: center; justify-content: center; }
      img {
        display: block;
        max-width: 100vw;
        max-height: 100vh;
        width: 100vw;
        height: 100vh;
        object-fit: contain;
        page-break-inside: avoid;
        break-inside: avoid;
      }
    `;
    doc.head.appendChild(style);

    const img = doc.createElement("img");
    doc.body.appendChild(img);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      iframe.remove();
    };

    img.onload = () => {
      win.onafterprint = cleanup;
      win.focus();
      win.print();
      resolve();
      // afterprint 가 오지 않는 환경 대비
      window.setTimeout(cleanup, 60_000);
    };
    img.onerror = () => {
      cleanup();
      resolve();
    };
    img.src = src;
  });
}

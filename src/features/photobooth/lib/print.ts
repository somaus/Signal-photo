import { PRINT_ENABLED, PRINT_PAGE_SIZE } from "../model/config";

/**
 * 합성된 사진을 copies 장 인쇄한다. 한 장이 한 페이지이고, 각 페이지에 "페이지에 맞게 축소"
 * 방식(object-fit: contain)으로 비율을 유지한 채 꽉 차게 들어간다.
 * 인쇄 작업은 1번만 보내므로 키오스크 모드에서도 대화상자가 여러 번 뜨지 않는다.
 *
 * 포토 프린터를 OS 기본 프린터로 지정하고, 크롬을 `--kiosk-printing` 옵션으로 실행하면
 * 인쇄 대화상자 없이 바로 출력된다.
 *   chrome.exe --kiosk --kiosk-printing http://localhost:3000
 */
export function printImage(src: string, copies = 1): Promise<void> {
  if (!PRINT_ENABLED) return Promise.resolve();
  const count = Math.max(1, Math.floor(copies));

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
      html, body { margin: 0; padding: 0; }
      .page {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        break-after: page;
        page-break-after: always;
      }
      .page:last-child { break-after: auto; page-break-after: auto; }
      img { display: block; width: 100%; height: 100%; object-fit: contain; }
    `;
    doc.head.appendChild(style);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      iframe.remove();
    };

    const loads: Promise<void>[] = [];
    for (let i = 0; i < count; i += 1) {
      const page = doc.createElement("div");
      page.className = "page";
      const img = doc.createElement("img");
      loads.push(
        new Promise<void>((ok, fail) => {
          img.onload = () => ok();
          img.onerror = () => fail(new Error("이미지를 불러오지 못했어요."));
        }),
      );
      img.src = src;
      page.appendChild(img);
      doc.body.appendChild(page);
    }

    Promise.all(loads)
      .then(() => {
        win.onafterprint = cleanup;
        win.focus();
        win.print();
        // afterprint 가 오지 않는 환경 대비
        window.setTimeout(cleanup, 60_000);
      })
      .catch(cleanup)
      .finally(resolve);
  });
}

import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../model/frames";
import { PRINT_COPIES, PRINT_ENABLED, PRINT_PAGE_SIZE } from "../model/config";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("이미지를 불러오지 못했어요."));
    img.src = src;
  });
}

/** 같은 사진을 가로로 PRINT_COPIES 장 붙인 인쇄용 시트를 만든다. */
async function buildSheet(src: string, copies: number): Promise<string> {
  const photo = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH * copies;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("캔버스를 사용할 수 없어요.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < copies; i += 1) {
    ctx.drawImage(photo, i * CANVAS_WIDTH, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
  return canvas.toDataURL("image/jpeg", 0.95);
}

/**
 * 같은 사진 여러 장을 가로로 붙여 여백 없이 인쇄한다.
 * 용지 크기는 NEXT_PUBLIC_PRINT_PAGE_SIZE (기본 "landscape"), 장 수는 NEXT_PUBLIC_PRINT_COPIES (기본 2).
 *
 * 포토 프린터를 OS 기본 프린터로 지정하고, 크롬을 `--kiosk-printing` 옵션으로 실행하면
 * 인쇄 대화상자 없이 바로 출력된다.
 *   chrome.exe --kiosk --kiosk-printing http://localhost:3000
 */
export async function printImage(src: string): Promise<void> {
  if (!PRINT_ENABLED) return;

  let sheet: string;
  try {
    sheet = await buildSheet(src, PRINT_COPIES);
  } catch {
    return;
  }

  await new Promise<void>((resolve) => {
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
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
      img { display: block; width: 100%; height: 100vh; object-fit: contain; }
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
    img.src = sheet;
  });
}

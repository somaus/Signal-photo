import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../model/frames";
import type { Filter, Frame } from "../model/types";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`이미지를 불러오지 못했어요: ${src.slice(0, 40)}`));
    img.src = src;
  });
}

export function formatDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

/**
 * 촬영본 + 필터 + 프레임을 합성해 인쇄용(1200x1800) JPEG data URL 을 만든다.
 * 미리보기 UI(FrameStage)와 같은 레이아웃을 유지해야 한다.
 */
export async function composePhoto(shot: string, frame: Frame, filter: Filter): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("캔버스를 사용할 수 없어요.");

  // 배경
  const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  bg.addColorStop(0, frame.colors[0]);
  bg.addColorStop(1, frame.colors[1]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 사진 (거울 모드 + cover + 필터)
  const photo = await loadImage(shot);
  const sx = frame.slot.x * CANVAS_WIDTH;
  const sy = frame.slot.y * CANVAS_HEIGHT;
  const sw = frame.slot.w * CANVAS_WIDTH;
  const sh = frame.slot.h * CANVAS_HEIGHT;

  const slotRatio = sw / sh;
  const photoRatio = photo.naturalWidth / photo.naturalHeight;
  let cropW = photo.naturalWidth;
  let cropH = photo.naturalHeight;
  if (photoRatio > slotRatio) cropW = cropH * slotRatio;
  else cropH = cropW / slotRatio;
  const cropX = (photo.naturalWidth - cropW) / 2;
  const cropY = (photo.naturalHeight - cropH) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(sx, sy, sw, sh, 24);
  ctx.clip();
  ctx.translate(sx + sw, sy);
  ctx.scale(-1, 1);
  ctx.filter = filter.css;
  ctx.drawImage(photo, cropX, cropY, cropW, cropH, 0, 0, sw, sh);
  ctx.restore();
  ctx.filter = "none";

  // 오버레이 프레임 (없거나 파일이 아직 없으면 건너뜀)
  if (frame.overlaySrc) {
    try {
      const overlay = await loadImage(frame.overlaySrc);
      ctx.drawImage(overlay, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } catch {
      /* 프레임 파일 추가 전에는 무시 */
    }
  }

  // 캡션
  if (frame.caption) {
    ctx.fillStyle = frame.textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = '700 108px Pretendard, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
    ctx.letterSpacing = "16px";
    ctx.fillText("SIGNAL", CANVAS_WIDTH / 2 + 8, CANVAS_HEIGHT * 0.85);
    ctx.font = '500 38px Pretendard, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
    ctx.letterSpacing = "4px";
    ctx.globalAlpha = 0.7;
    ctx.fillText(formatDate(), CANVAS_WIDTH / 2 + 2, CANVAS_HEIGHT * 0.903);
    ctx.globalAlpha = 1;
  }

  return canvas.toDataURL("image/jpeg", 0.95);
}

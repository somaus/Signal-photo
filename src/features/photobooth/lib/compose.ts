import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../model/frames";
import type { Filter, Frame } from "../model/types";

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("이미지를 불러오지 못했어요."));
    img.src = src;
  });
}

/**
 * 촬영본 + 필터 + 프레임 오버레이를 합성해 인쇄용(1800x1200) JPEG data URL 을 만든다.
 * 미리보기 UI(FrameStage)와 같은 레이아웃을 유지해야 한다.
 */
export async function composePhoto(shot: string, frame: Frame, filter: Filter): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("캔버스를 사용할 수 없어요.");

  ctx.fillStyle = frame.background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 사진 (거울 모드 + cover + 필터)
  const [photo, overlay] = await Promise.all([loadImage(shot), loadImage(frame.overlaySrc)]);
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
  ctx.translate(sx + sw, sy);
  ctx.scale(-1, 1);
  ctx.filter = filter.css;
  ctx.drawImage(photo, cropX, cropY, cropW, cropH, 0, 0, sw, sh);
  ctx.restore();
  ctx.filter = "none";

  // 프레임 오버레이 (사진 칸만 투명)
  ctx.drawImage(overlay, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  return canvas.toDataURL("image/jpeg", 0.95);
}

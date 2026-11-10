import type { Filter } from "./types";

export const FILTERS: Filter[] = [
  { id: "original", name: "원본", css: "none" },
  { id: "bright", name: "화사", css: "brightness(1.12) contrast(0.96) saturate(1.15)" },
  { id: "soft", name: "뽀얀", css: "brightness(1.15) contrast(0.88) saturate(0.95) blur(0.3px)" },
  { id: "warm", name: "따뜻", css: "sepia(0.25) saturate(1.3) hue-rotate(-8deg) brightness(1.05)" },
  {
    id: "cool",
    name: "시원",
    css: "saturate(1.1) hue-rotate(12deg) brightness(1.05) contrast(1.05)",
  },
  {
    id: "vintage",
    name: "빈티지",
    css: "sepia(0.55) contrast(1.05) saturate(0.9) brightness(0.98)",
  },
  { id: "mono", name: "흑백", css: "grayscale(1) contrast(1.15)" },
];

import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og-card";

export const alt = "Mohamed Amine Mzoughi, Full-Stack Web Developer in Tunis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<OgCard />, size);
}

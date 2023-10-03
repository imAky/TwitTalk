import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import sharp from "sharp";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBase64Image(imageData: string) {
  // Regular expression to match base64 image data URL format
  const regex = /^data:image\/(png|jpg|jpeg);base64,/;
  return regex.test(imageData);
}

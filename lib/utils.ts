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

export const formatTimeDifference = (time: Date, profile: boolean) => {
  const currentTime: Date = new Date();
  const providedTime: Date = new Date(time);
  if (profile) {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return providedTime.toLocaleDateString("en-US", options);
  }

  const differenceInSeconds: number = Math.floor(
    (currentTime.getTime() - providedTime.getTime()) / 1000
  );

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds}s`;
  } else if (differenceInSeconds < 3600) {
    const differenceInMinutes: number = Math.floor(differenceInSeconds / 60);
    return `${differenceInMinutes}m`;
  } else if (differenceInSeconds < 86400) {
    const differenceInHours: number = Math.floor(differenceInSeconds / 3600);
    return `${differenceInHours}h`;
  } else if (providedTime.getFullYear() === currentTime.getFullYear()) {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return providedTime.toLocaleDateString("en-US", options);
  } else {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return providedTime.toLocaleDateString("en-US", options);
  }
};

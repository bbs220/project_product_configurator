import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const assetPaths = {
  engine: "/models/radialPneumaticEngine.glb",
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

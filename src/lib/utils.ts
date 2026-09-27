import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const assetPaths = {
  veneno: "/models/lamborghiniVeneno.glb",
  gt3: "/models/porsche911gt3.glb",
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

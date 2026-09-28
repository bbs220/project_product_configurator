import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const assetPaths = {
  veneno: "/models/lamborghiniVeneno.glb",
  gt3: "/models/porsche911gt3.glb",
};

export const hdrSet = {
  studioWhiteTint: "/hdris/studio_kontrast_04_2k.hdr",
  studioBlueTint: "/hdris/ferndale_studio_12_2k.hdr",
  modernBuildingAfternoon: "/hdris/modern_buildings_2_2k.hdr",
  raceTrackMidday: "/hdris/zwartkops_start_afternoon_2k.hdr",
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

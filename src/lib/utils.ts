import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const assetPaths = {
  laFerrari: "/models/Ferrari_LaFerrari_2013.glb",
  watch: "/models/Apple_Watch_Ultra_2_2023.glb",
  keyboard: "/models/Knob1_Mechanical_Keyboard_2024.glb",
  mtBike: "/models/SantaCruz_v10_2026.glb",
  guitar: "/models/Fender_Stratocaster_1954r.glb",
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

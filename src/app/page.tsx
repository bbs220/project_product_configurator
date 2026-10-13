import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  return (
    <>
      <SpeedInsights />
      <Analytics />
      <div className="w-full flex flex-col items-center">
        <Hero />
        <FeatureGrid />
      </div>
    </>
  );
}

import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <Hero />
      <FeatureGrid />
    </div>
  );
}

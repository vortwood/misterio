"use client";

import { useState } from "react";
import { EntryGate } from "@/components/entry-gate";
import { NoiseBackground } from "@/components/noise-background";
import { Particles } from "@/components/particles";
import { TeaserHero } from "@/components/teaser-hero";
import { TVGlitch } from "@/components/tv-glitch";

export default function Home() {
  const [glitchEnabled, setGlitchEnabled] = useState(false);

  const handleEnter = () => {
    setGlitchEnabled(true);
  };

  return (
    <EntryGate onEnter={handleEnter}>
      <main className="relative min-h-screen h-screen overflow-hidden">
        <NoiseBackground />
        <Particles />
        <TeaserHero />
        <TVGlitch enabled={glitchEnabled} initialDelay={2000} />
      </main>
    </EntryGate>
  );
}

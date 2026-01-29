"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

type GlitchType = "colorBars" | "vhsTracking" | null;

interface TVGlitchProps {
  enabled?: boolean;
  initialDelay?: number;
}

export function TVGlitch({ enabled = true, initialDelay = 0 }: TVGlitchProps) {
  const [glitchType, setGlitchType] = useState<GlitchType>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastGlitchRef = useRef<GlitchType>("vhsTracking");

  const playStaticNoise = async (duration: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;

    // Resume if suspended (required by browsers)
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    // Create noise buffer
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    // Create and play noise
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Add filter for TV-like sound
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;

    // Gain control
    const gain = ctx.createGain();
    gain.gain.value = 0.08;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + duration);
  };

  useEffect(() => {
    if (!enabled) return;

    const triggerGlitch = () => {
      // Alternate between effects
      const nextGlitch: GlitchType = lastGlitchRef.current === "colorBars" ? "vhsTracking" : "colorBars";
      lastGlitchRef.current = nextGlitch;

      const duration = nextGlitch === "colorBars" ? 1.2 : 0.8;

      setGlitchType(nextGlitch);
      playStaticNoise(duration);

      setTimeout(() => {
        setGlitchType(null);
      }, duration * 1000);
    };

    // Random intervals between 4-10 seconds
    const scheduleNextGlitch = () => {
      const delay = Math.random() * 6000 + 4000;
      return setTimeout(() => {
        triggerGlitch();
        timeoutId = scheduleNextGlitch();
      }, delay);
    };

    // First glitch after initialDelay, then random intervals
    let timeoutId = setTimeout(() => {
      triggerGlitch();
      timeoutId = scheduleNextGlitch();
    }, initialDelay);

    return () => {
      clearTimeout(timeoutId);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [enabled, initialDelay]);

  if (!glitchType) return null;

  if (glitchType === "vhsTracking") {
    return <VHSTracking />;
  }

  return <ColorBars />;
}

function ColorBars() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* SMPTE Color Bars */}
      <div className="absolute inset-0 flex">
        {/* Top section - main color bars (75% height) */}
        <div className="flex w-full h-[75%]">
          <div className="flex-1 bg-[#c0c0c0]" />
          <div className="flex-1 bg-[#c0c000]" />
          <div className="flex-1 bg-[#00c0c0]" />
          <div className="flex-1 bg-[#00c000]" />
          <div className="flex-1 bg-[#c000c0]" />
          <div className="flex-1 bg-[#c00000]" />
          <div className="flex-1 bg-[#0000c0]" />
        </div>
      </div>

      {/* Middle section */}
      <div className="absolute top-[75%] left-0 right-0 h-[8%] flex">
        <div className="flex-1 bg-[#0000c0]" />
        <div className="flex-1 bg-[#131313]" />
        <div className="flex-1 bg-[#c000c0]" />
        <div className="flex-1 bg-[#131313]" />
        <div className="flex-1 bg-[#00c0c0]" />
        <div className="flex-1 bg-[#131313]" />
        <div className="flex-1 bg-[#c0c0c0]" />
      </div>

      {/* Bottom section */}
      <div className="absolute top-[83%] left-0 right-0 h-[17%] flex">
        <div className="w-[12.5%] bg-[#00214c]" />
        <div className="w-[12.5%] bg-[#ffffff]" />
        <div className="w-[12.5%] bg-[#32006a]" />
        <div className="w-[50%] bg-[#131313]" />
        <div className="w-[4%] bg-[#090909]" />
        <div className="w-[4%] bg-[#1d1d1d]" />
        <div className="w-[4.5%] bg-[#131313]" />
      </div>

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)",
        }}
      />
    </div>
  );
}

function VHSTracking() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none bg-black">
      {/* Main static background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          animation: "vhsNoise 0.1s steps(5) infinite",
        }}
      />

      {/* Horizontal tracking lines */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 bg-white/20"
          style={{
            height: `${Math.random() * 20 + 10}px`,
            top: `${i * 12 + Math.random() * 5}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, Math.random() * -100 + 50, 0],
            opacity: [0.1, 0.4, 0.2, 0.1],
            scaleY: [1, 1.5, 0.5, 1],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Color bleed strips */}
      <motion.div
        className="absolute left-0 right-0 h-8"
        style={{
          top: "30%",
          background: "linear-gradient(90deg, transparent, rgba(255,0,0,0.3), rgba(0,255,255,0.3), transparent)",
        }}
        animate={{
          y: [0, 100, -50, 0],
          opacity: [0.5, 0.8, 0.3, 0.5],
        }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
        }}
      />

      <motion.div
        className="absolute left-0 right-0 h-12"
        style={{
          top: "60%",
          background: "linear-gradient(90deg, transparent, rgba(0,0,255,0.3), rgba(255,255,0,0.3), transparent)",
        }}
        animate={{
          y: [0, -80, 60, 0],
          opacity: [0.4, 0.7, 0.2, 0.4],
        }}
        transition={{
          duration: 0.35,
          repeat: Infinity,
        }}
      />

      {/* Rolling bar effect */}
      <motion.div
        className="absolute left-0 right-0 h-24 bg-black/80"
        animate={{
          top: ["-10%", "110%"],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Heavy distortion band */}
      <motion.div
        className="absolute left-0 right-0"
        style={{
          height: "15%",
          background: "repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.1) 2px, transparent 4px)",
        }}
        animate={{
          top: ["20%", "80%", "20%"],
          scaleX: [1, 1.02, 0.98, 1],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.8) 1px, rgba(0,0,0,0.8) 2px)",
        }}
      />

      {/* VHS timestamp flicker */}
      <motion.div
        className="absolute bottom-8 right-8 font-mono text-white/60 text-sm"
        animate={{
          opacity: [1, 0.3, 1, 0.5, 1],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
        }}
      >
        <span className="bg-black/50 px-2 py-1">PLAY ▶</span>
      </motion.div>
    </div>
  );
}

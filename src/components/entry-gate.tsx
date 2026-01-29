"use client";

import { useState, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EntryGateProps {
  children: ReactNode;
  onEnter: () => void;
}

export function EntryGate({ children, onEnter }: EntryGateProps) {
  const [hasEntered, setHasEntered] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleEnter = () => {
    // Initialize audio context on user interaction
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    setHasEntered(true);
    onEnter();
  };

  return (
    <>
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            {/* Noise texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Vignette effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)",
              }}
            />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center text-center px-6 max-w-md"
            >
              {/* Mysterious symbol */}
              <motion.div
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-8 text-6xl select-none"
                style={{
                  fontWeight: 200,
                  color: "rgba(255,255,255,0.15)",
                  textShadow: "0 0 30px rgba(255,255,255,0.1)",
                }}
              >
                ?
              </motion.div>

              {/* Question text */}
              <h2
                className="text-white/80 mb-3 select-none"
                style={{
                  fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
                  fontWeight: 300,
                  letterSpacing: "0.05em",
                  lineHeight: 1.4,
                }}
              >
                ¿Estás listo para descubrir
              </h2>
              <h2
                className="text-white mb-10 select-none"
                style={{
                  fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
                  fontWeight: 400,
                  letterSpacing: "0.05em",
                  lineHeight: 1.4,
                }}
              >
                este misterio?
              </h2>

              {/* Enter button */}
              <motion.button
                onClick={handleEnter}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group cursor-pointer"
              >
                {/* Button glow */}
                <div className="absolute inset-0 bg-white/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Button border */}
                <div
                  className="relative px-10 py-4 border border-white/20 hover:border-white/40 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
                  }}
                >
                  <span
                    className="uppercase tracking-[0.3em] text-white/70 group-hover:text-white/90 transition-colors duration-300 select-none"
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    Entrar
                  </span>
                </div>
              </motion.button>

              {/* Subtle warning */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="mt-8 text-white/20 select-none"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Se recomienda usar auriculares
              </motion.p>
            </motion.div>

            {/* Scanlines */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.015]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - always rendered but hidden until entered */}
      <div className={hasEntered ? "opacity-100" : "opacity-0"}>
        {children}
      </div>
    </>
  );
}

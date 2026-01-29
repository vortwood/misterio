"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { unlockAudio } from "@/lib/audio-context";

interface EntryGateProps {
  children: ReactNode;
  onEnter: () => void;
}

export function EntryGate({ children, onEnter }: EntryGateProps) {
  const [hasEntered, setHasEntered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);

  const handleEnter = async () => {
    if (selectedOption !== 0) return;

    // Unlock audio on user interaction (works on iOS/mobile)
    await unlockAudio();

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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{
              backgroundColor: "#0a0a12",
            }}
          >
            {/* CRT curvature effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)",
              }}
            />

            {/* Blue CRT glow */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(30,60,120,0.3) 0%, transparent 70%)",
              }}
            />

            {/* Content container - styled like old TV menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-10 w-full max-w-lg mx-4"
            >
              {/* Menu box */}
              <div
                className="relative p-1"
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                }}
              >
                {/* Outer border */}
                <div className="border-2 border-white/40 p-1">
                  {/* Inner border */}
                  <div className="border border-white/20 bg-black/60 p-6 sm:p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <motion.div
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-white/90 text-xs sm:text-sm tracking-[0.3em] uppercase mb-2"
                      >
                        ══════ SISTEMA ══════
                      </motion.div>
                      <div
                        className="text-white text-lg sm:text-xl tracking-wider"
                        style={{
                          textShadow: "0 0 10px rgba(255,255,255,0.5)",
                        }}
                      >
                        ADVERTENCIA
                      </div>
                    </div>

                    {/* Message */}
                    <div className="text-center mb-8 space-y-2">
                      <p className="text-white/70 text-sm sm:text-base">
                        ¿Estás seguro de que
                      </p>
                      <p className="text-white/70 text-sm sm:text-base">
                        quieres entrar en
                      </p>
                      <p
                        className="text-white text-sm sm:text-base"
                        style={{
                          textShadow: "0 0 8px rgba(255,255,255,0.4)",
                        }}
                      >
                        este misterio?
                      </p>
                    </div>

                    {/* Menu options */}
                    <div className="space-y-2 mb-6">
                      {/* Option 1: SI */}
                      <motion.button
                        onClick={handleEnter}
                        onMouseEnter={() => setSelectedOption(0)}
                        className="w-full text-left px-4 py-2 cursor-pointer"
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <motion.span
                            animate={{
                              opacity: selectedOption === 0 ? [1, 0.3, 1] : 0.3,
                            }}
                            transition={{
                              duration: 0.5,
                              repeat: selectedOption === 0 ? Infinity : 0,
                            }}
                            className="text-white font-bold"
                          >
                            {selectedOption === 0 ? "►" : " "}
                          </motion.span>
                          <span
                            className={`tracking-wider ${
                              selectedOption === 0
                                ? "text-white"
                                : "text-white/40"
                            }`}
                            style={{
                              textShadow:
                                selectedOption === 0
                                  ? "0 0 10px rgba(255,255,255,0.5)"
                                  : "none",
                            }}
                          >
                            SÍ, ENTRAR
                          </span>
                        </div>
                      </motion.button>

                      {/* Option 2: NO (disabled/grayed) */}
                      <div
                        className="w-full text-left px-4 py-2 cursor-not-allowed"
                        onMouseEnter={() => setSelectedOption(1)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-white/20 font-bold">
                            {selectedOption === 1 ? "►" : " "}
                          </span>
                          <span className="tracking-wider text-white/20 line-through">
                            NO, SALIR
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center border-t border-white/10 pt-4">
                      <motion.p
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-white/30 text-[10px] sm:text-xs tracking-wider uppercase"
                      >
                        Use auriculares para mejor experiencia
                      </motion.p>
                    </div>
                  </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/60" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/60" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/60" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/60" />
              </div>
            </motion.div>

            {/* Scanlines overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)",
              }}
            />

            {/* Flicker effect */}
            <motion.div
              animate={{
                opacity: [0, 0.02, 0, 0.01, 0],
              }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="absolute inset-0 bg-white pointer-events-none"
            />

            {/* VHS timestamp */}
            <motion.div
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute bottom-6 right-6 font-mono text-white/40 text-xs"
              style={{ fontFamily: "'Courier New', monospace" }}
            >
              REC ●
            </motion.div>
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

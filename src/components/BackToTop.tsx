"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const MAG_STRENGTH = 0.35;
const MAG_SPRING   = { stiffness: 180, damping: 22, mass: 0.08 };

export default function BackToTop() {
  const [visible,  setVisible]  = useState(false);
  const [hovered,  setHovered]  = useState(false);
  const [progress, setProgress] = useState(0);

  const ref  = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x    = useSpring(rawX, MAG_SPRING);
  const y    = useSpring(rawY, MAG_SPRING);

  // ── Scroll tracking ────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const scrollY   = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollY > 400);
      setProgress(docHeight > 0 ? scrollY / docHeight : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Magnetic ───────────────────────────────────────────────────────────────
  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - (r.left + r.width  / 2)) * MAG_STRENGTH);
    rawY.set((e.clientY - (r.top  + r.height / 2)) * MAG_STRENGTH);
  };

  const onLeave = () => {
    setHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── SVG ring config ────────────────────────────────────────────────────────
  const SIZE   = 48;
  const RADIUS = 19;
  const CIRC   = 2 * Math.PI * RADIUS;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="back-to-top"
          className="fixed bottom-6 right-6 z-[80]"
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <motion.div
            ref={ref}
            style={{ x, y }}
            onMouseMove={onMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onLeave}
            className="relative cursor-pointer"
            onClick={scrollToTop}
          >
            {/* Progress ring */}
            <svg
              width={SIZE}
              height={SIZE}
              className="absolute inset-0 -rotate-90"
              viewBox={`0 0 ${SIZE} ${SIZE}`}
            >
              {/* Track */}
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="rgba(85,165,59,0.18)"
                strokeWidth="1.5"
              />
              {/* Fill */}
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="#55A53B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - progress)}
                style={{ transition: "stroke-dashoffset 0.12s linear" }}
              />
            </svg>

            {/* Button body */}
            <motion.div
              className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full"
              style={{
                background: hovered
                  ? "rgba(85,165,59,0.18)"
                  : "rgba(6,8,6,0.80)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid",
                borderColor: hovered ? "rgba(85,165,59,0.55)" : "rgba(255,255,255,0.10)",
                transition: "background 0.25s ease, border-color 0.25s ease",
              }}
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              {/* Shimmer on hover */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
                  opacity: hovered ? 1 : 0,
                  transition: "opacity 0.25s ease",
                }}
              />

              {/* Arrow — bounces up */}
              <motion.div
                animate={{ y: hovered ? -2 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              >
                <ArrowUp
                  className="h-4 w-4"
                  style={{ color: hovered ? "#55A53B" : "rgba(255,255,255,0.55)" }}
                />
              </motion.div>
            </motion.div>

            {/* Tooltip */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  key="tip"
                  className="pointer-events-none absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.18 }}
                >
                  <span
                    className="rounded-sm px-2.5 py-1.5 text-[9px] tracking-[0.3em] text-white/60 uppercase"
                    style={{
                      fontFamily: "var(--font-orbitron), monospace",
                      background: "rgba(6,8,6,0.85)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    Back to Top
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

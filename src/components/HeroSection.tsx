"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Play, ArrowRight, Radio } from "lucide-react";
import TextSwitcher from "./TextSwitcher";

// ─────────────────────────────────────────────────────────────────────────────
// Magnetic CTA Button
// ─────────────────────────────────────────────────────────────────────────────
const MAG_STRENGTH = 0.32;
const MAG_SPRING = { stiffness: 160, damping: 20, mass: 0.08 };

function MagneticCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, MAG_SPRING);
  const y = useSpring(rawY, MAG_SPRING);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - (r.left + r.width / 2)) * MAG_STRENGTH);
    rawY.set((e.clientY - (r.top + r.height / 2)) * MAG_STRENGTH);
  };

  const onLeave = () => {
    setHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      className="relative cursor-pointer"
    >
      <a
        href="#book"
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#55A53B] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#55A53B]/30"
      >
        {/* Shine sweep on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 -skew-x-12"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
          }}
          initial={{ x: "-120%" }}
          animate={{ x: hovered ? "220%" : "-120%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <span className="relative z-10">Get a Free Quote</span>
        <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mask-Reveal Headline
// ─────────────────────────────────────────────────────────────────────────────
const HEADLINE_LINES = ["Your Home", "Deserves a"];

function MaskRevealHeadline() {
  return (
    <div>
      {HEADLINE_LINES.map((line, i) => (
        <div key={line} className="overflow-hidden">
          <motion.span
            className="block font-extrabold leading-[1.0] tracking-tighter text-white"
            style={{
              fontFamily: "var(--font-geist), sans-serif",
              fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
            }}
            initial={{ y: "105%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 18,
              delay: 0.15 + i * 0.1,
            }}
          >
            {line}
          </motion.span>
        </div>
      ))}

      {/* TextSwitcher line — same mask reveal */}
      <div className="overflow-hidden">
        <motion.div
          initial={{ y: "105%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 18,
            delay: 0.35,
          }}
          className="font-extrabold leading-[1.0] tracking-tighter"
          style={{
            fontFamily: "var(--font-geist), sans-serif",
            fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
          }}
        >
          <TextSwitcher
            phrases={[
              { first: "Brighter", second: "Shine" },
              { first: "Pristine", second: "Space" },
              { first: "Clean",    second: "Haven" },
              { first: "Fresh",    second: "Start" },
              { first: "Spotless", second: "Home"  },
            ]}
          />
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HUD Status Bar
// ─────────────────────────────────────────────────────────────────────────────
function HUDBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.9 }}
      style={{
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        background: "rgba(0,0,0,0.38)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-6 py-3 sm:flex-row sm:gap-0">

        {/* Operational status */}
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#55A53B]" />
          <span
            className="text-[10px] tracking-[0.28em] text-white/40 uppercase"
            style={{ fontFamily: "var(--font-orbitron), monospace" }}
          >
            OPERATIONAL STATUS:
          </span>
          <span
            className="text-[10px] tracking-[0.28em] text-[#55A53B] uppercase"
            style={{ fontFamily: "var(--font-orbitron), monospace" }}
          >
            ONLINE
          </span>
        </div>

        {/* Coverage cities */}
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] tracking-[0.25em] text-white/35 uppercase"
            style={{ fontFamily: "var(--font-orbitron), monospace" }}
          >
            COVERAGE:
          </span>
          {["NAPLES", "ORLANDO", "MIAMI", "TAMPA"].map((city, i) => (
            <span
              key={city}
              className="text-[10px] tracking-[0.2em] text-white/55 uppercase"
              style={{ fontFamily: "var(--font-orbitron), monospace" }}
            >
              {i > 0 && <span className="mx-1 text-white/20">•</span>}
              {city}
            </span>
          ))}
        </div>

        {/* Live agents */}
        <div className="flex items-center gap-2">
          <Radio className="h-3 w-3 text-white/30" />
          <span
            className="text-[10px] tracking-[0.28em] text-white/35 uppercase"
            style={{ fontFamily: "var(--font-orbitron), monospace" }}
          >
            LIVE AGENTS:
          </span>
          <span
            className="text-[10px] tracking-[0.28em] text-white/60 uppercase"
            style={{ fontFamily: "var(--font-orbitron), monospace" }}
          >
            STANDBY
          </span>
        </div>

      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Video blurs and fades out as the user scrolls away
  const videoBlurValue = useTransform(scrollYProgress, [0, 0.65], [0, 12]);
  const videoOpacity   = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const videoFilter    = useTransform(videoBlurValue, (v) => `blur(${v}px)`);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">

      {/* ── Layer 0: Video with scroll-driven blur + fade ── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ filter: videoFilter, opacity: videoOpacity }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/videos/cleaning.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* ── Layer 1: Dark base overlay ── */}
      <div className="absolute inset-0 z-[1] bg-black/48" />

      {/* ── Layer 2: Cinematic gradient (heavy at bottom) ── */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/75 via-black/15 to-black/25" />

      {/* ── Layer 3: Film grain noise ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />

      {/* ── Layer 10: All Content ── */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex-1" />

        {/* ── Main content grid ── */}
        <div className="mx-auto w-full max-w-7xl px-6 pb-6 md:pb-10">

          {/* "See our Process" pill */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-8"
          >
            <button
              className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.08] px-5 py-2.5 text-sm font-medium text-white/75 transition-all hover:bg-white/[0.14]"
              style={{
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#55A53B]/20 ring-1 ring-[#55A53B]/25">
                <Play className="h-3 w-3 fill-[#55A53B] text-[#55A53B]" />
              </span>
              See our Process
            </button>
          </motion.div>

          {/* Split grid */}
          <div className="grid gap-10 md:grid-cols-2 md:items-end">

            {/* LEFT — Mask-reveal headline */}
            <MaskRevealHeadline />

            {/* RIGHT — Sub-copy + magnetic CTA */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col items-start gap-7 md:items-end md:text-right"
            >
              <p className="max-w-md text-base leading-relaxed text-white/60 md:text-lg">
                Myra Keleher is a premium cleaning collective that turns chaotic
                spaces into pristine sanctuaries&nbsp;&mdash; eco-friendly,
                meticulous, and reliable.
              </p>
              <MagneticCTA />
            </motion.div>
          </div>
        </div>

        {/* Divider line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mx-6 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent"
        />

        {/* ── HUD Status Bar ── */}
        <HUDBar />
      </div>
    </section>
  );
}

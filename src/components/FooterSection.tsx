"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useInView,
} from "framer-motion";
import { Instagram, Linkedin, ArrowUpRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Magnetic Button
// ─────────────────────────────────────────────────────────────────────────────
const MAGNETIC_STRENGTH = 0.38;
const SPRING = { stiffness: 160, damping: 20, mass: 0.08 };

function MagneticButton() {
  const ref    = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x    = useSpring(rawX, SPRING);
  const y    = useSpring(rawY, SPRING);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r  = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - (r.left + r.width  / 2)) * MAGNETIC_STRENGTH);
    rawY.set((e.clientY - (r.top  + r.height / 2)) * MAGNETIC_STRENGTH);
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
      {/* Outer pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={
          hovered
            ? { scale: [1, 1.35, 1.35], opacity: [0.5, 0, 0] }
            : { scale: 1, opacity: 0 }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          border: "1.5px solid rgba(85,165,59,0.6)",
          borderRadius: "50%",
        }}
      />

      {/* Button body */}
      <motion.div
        className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-2 border-[#050505] bg-[#050505]"
        animate={{ scale: hovered ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {/* Fill slide on hover */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white"
          initial={{ scale: 0 }}
          animate={{ scale: hovered ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
        />
        {/* Label */}
        <motion.span
          className="relative z-10 flex flex-col items-center gap-0.5"
          animate={{ color: hovered ? "#050505" : "#ffffff" }}
          transition={{ duration: 0.15 }}
        >
          <span
            className="text-sm font-bold tracking-[0.25em]"
            style={{ fontFamily: "var(--font-geist), sans-serif" }}
          >
            BOOK NOW
          </span>
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300"
            style={{ transform: hovered ? "rotate(0deg)" : "rotate(0deg)" }}
          />
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Headline — stagger reveal on scroll
// ─────────────────────────────────────────────────────────────────────────────
const WORDS = ["READY", "TO", "RESET?"];

function StaggerHeadline() {
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-12%" });

  return (
    <div ref={ref} className="flex flex-wrap items-end justify-center gap-x-5 gap-y-0">
      {WORDS.map((word, i) => (
        <div key={word} className="overflow-hidden">
          <motion.span
            className="block font-extrabold leading-[0.88] tracking-tighter text-white"
            style={{
              fontFamily:  "var(--font-geist), sans-serif",
              fontSize:    "clamp(4rem, 17vw, 18rem)",
            }}
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : {}}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 18,
              delay: 0.1 + i * 0.12,
            }}
          >
            {word}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer Section
// ─────────────────────────────────────────────────────────────────────────────
export default function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: "-5%" });

  return (
    <footer
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#050505]"
    >
      {/* ── Background gradient: electric mint floods from the bottom ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, #55A53B 0%, rgba(85,165,59,0.28) 38%, rgba(85,165,59,0.05) 62%, #050505 100%)",
        }}
      />

      {/* ── Noise grain overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex min-h-screen flex-col">

        {/* Section label — top left */}
        <motion.div
          className="flex items-center gap-3 p-8"
          initial={{ opacity: 0, y: -10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="h-px w-7 bg-white/40" />
          <span
            className="text-[10px] tracking-[0.35em] text-white/50"
            style={{ fontFamily: "var(--font-orbitron), monospace" }}
          >
            07 / INITIATION
          </span>
        </motion.div>

        {/* Centre: headline + button */}
        <div className="flex flex-1 flex-col items-center justify-center gap-12 px-6 pb-32 pt-8">
          <StaggerHeadline />

          {/* Sub-copy */}
          <motion.p
            className="max-w-sm text-center text-sm leading-relaxed text-white/60"
            style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55, duration: 0.7 }}
          >
            Book your first clean and discover what&apos;spotless&apos; actually
            means. Zero obligations — just results.
          </motion.p>

          {/* Magnetic button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              delay: 0.7,
              type: "spring",
              stiffness: 120,
              damping: 16,
            }}
          >
            <a href="#book" aria-label="Book Now">
              <MagneticButton />
            </a>
          </motion.div>
        </div>

        {/* ── Footer utility bar ── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-8 pb-7"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {/* Left — copyright */}
          <p
            className="text-[10px] font-medium tracking-[0.22em] text-white/60 uppercase"
            style={{ fontFamily: "var(--font-orbitron), monospace" }}
          >
            © 2025 Myra Keleher
          </p>

          {/* Centre — legal links */}
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-[10px] font-medium tracking-[0.18em] text-white/50 uppercase transition-colors hover:text-white"
                style={{ fontFamily: "var(--font-orbitron), monospace" }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right — socials */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/60 transition-all hover:border-white hover:text-white"
            >
              <Instagram size={13} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/60 transition-all hover:border-white hover:text-white"
            >
              <Linkedin size={13} />
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface StatProps { end: number; suffix: string; label: string }

// ─────────────────────────────────────────────────────────────────────────────
// Count-Up Stat
// ─────────────────────────────────────────────────────────────────────────────
function CountUpStat({ end, suffix, label }: StatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: end,
        duration: 2,
        ease: "power2.out",
        snap: { val: 1 },
        scrollTrigger: {
          trigger: ref.current!,
          start: "top 88%",
          once: true,
        },
        onUpdate: () => setCount(Math.round(obj.val)),
      });
    });
    return () => ctx.revert();
  }, [end]);

  return (
    <div
      ref={ref}
      className="flex flex-1 flex-col items-center border-r border-[#e5e5e5] px-4 py-6 last:border-r-0"
    >
      <div
        className="text-3xl font-bold text-[#0a0a0a] md:text-4xl"
        style={{ fontFamily: "var(--font-orbitron), monospace" }}
      >
        {count}{suffix}
      </div>
      <div
        className="mt-1 text-[9px] tracking-[0.3em] text-[#6b7280] uppercase"
        style={{ fontFamily: "var(--font-orbitron), monospace" }}
      >
        {label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Magnetic CTA
// ─────────────────────────────────────────────────────────────────────────────
const MAG_STRENGTH = 0.3;
const MAG_SPRING   = { stiffness: 160, damping: 20, mass: 0.08 };

function MagneticCTA() {
  const ref     = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x    = useSpring(rawX, MAG_SPRING);
  const y    = useSpring(rawY, MAG_SPRING);

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

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      className="cursor-pointer"
    >
      <a
        href="#book"
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#55A53B] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#55A53B]/30"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 -skew-x-12"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
          }}
          initial={{ x: "-120%" }}
          animate={{ x: hovered ? "220%" : "-120%" }}
          transition={{ duration: 0.5, ease: "easeInOut" as const }}
        />
        <span className="relative z-10">Discover Our Process</span>
        <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
      </a>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function SplitWords({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className={`word mr-[0.27em] inline-block ${className ?? ""}`}>
          {word}
        </span>
      ))}
    </>
  );
}

const FEATURES = [
  "Certified eco-friendly products",
  "Background-checked specialists",
  "White-glove attention to detail",
  "Flexible scheduling",
];

// ─────────────────────────────────────────────────────────────────────────────
// About Section
// ─────────────────────────────────────────────────────────────────────────────
export default function AboutSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const img1Ref     = useRef<HTMLDivElement>(null);
  const img2Ref     = useRef<HTMLDivElement>(null);
  const img3Ref     = useRef<HTMLDivElement>(null);
  const imgTagRef   = useRef<HTMLDivElement>(null);
  const para1Ref    = useRef<HTMLDivElement>(null);
  const para2Ref    = useRef<HTMLDivElement>(null);
  const sec2Ref     = useRef<HTMLDivElement>(null);
  const sec3Ref     = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // ── Headline word-mask reveal ──────────────────────
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".hword");
        gsap.from(words, {
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
          y: "105%",
          opacity: 0,
          stagger: 0.04,
          duration: 0.85,
          ease: "power3.out",
        });
      }

      // ── Image crossfade ────────────────────────────────
      const img1 = img1Ref.current;
      const img2 = img2Ref.current;
      const img3 = img3Ref.current;

      if (img1 && img2 && sec2Ref.current) {
        ScrollTrigger.create({
          trigger: sec2Ref.current,
          start: "top 55%",
          onEnter: () => {
            gsap.to(img1, { opacity: 0, duration: 0.55, ease: "power2.inOut" });
            gsap.to(img2, { opacity: 1, duration: 0.55, ease: "power2.inOut" });
          },
          onLeaveBack: () => {
            gsap.to(img1, { opacity: 1, duration: 0.55, ease: "power2.inOut" });
            gsap.to(img2, { opacity: 0, duration: 0.55, ease: "power2.inOut" });
          },
        });
      }

      if (img2 && img3 && sec3Ref.current) {
        ScrollTrigger.create({
          trigger: sec3Ref.current,
          start: "top 55%",
          onEnter: () => {
            gsap.to(img2, { opacity: 0, duration: 0.55, ease: "power2.inOut" });
            gsap.to(img3, { opacity: 1, duration: 0.55, ease: "power2.inOut" });
          },
          onLeaveBack: () => {
            gsap.to(img2, { opacity: 1, duration: 0.55, ease: "power2.inOut" });
            gsap.to(img3, { opacity: 0, duration: 0.55, ease: "power2.inOut" });
          },
        });
      }

      // ── Scrub read-along ───────────────────────────────
      [para1Ref, para2Ref].forEach((pRef) => {
        if (!pRef.current) return;
        const words = pRef.current.querySelectorAll(".word");
        if (!words.length) return;
        gsap.fromTo(
          words,
          { opacity: 0.18, color: "#0a0a0a" },
          {
            opacity: 1,
            stagger: 0.03,
            ease: "none",
            scrollTrigger: {
              trigger: pRef.current,
              start: "top 72%",
              end: "bottom 38%",
              scrub: 0.8,
            },
          }
        );
      });

      // ── Feature list slide-in ──────────────────────────
      const featureItems = sectionRef.current.querySelectorAll(".feature-item");
      if (featureItems.length) {
        gsap.from(featureItems, {
          scrollTrigger: {
            trigger: featureItems[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
          x: -20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    },
    { scope: sectionRef }
  );

  const HWord = ({ children, green }: { children: string; green?: boolean }) => (
    <div className="overflow-hidden inline-block mr-[0.38em] mb-[0.08em]">
      <span
        className={`hword inline-block font-extrabold tracking-tighter leading-none ${
          green ? "text-[#55A53B]" : "text-[#0a0a0a]"
        }`}
        style={{
          fontFamily: "var(--font-geist), sans-serif",
          fontSize: "clamp(2.4rem, 6.5vw, 5.5rem)",
        }}
      >
        {children}
      </span>
    </div>
  );

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden bg-white">

      {/* ── Headline ── */}
      <div
        ref={headlineRef}
        className="px-6 pt-20 pb-8 md:pt-28 md:pb-10 lg:px-12"
      >
        <div className="flex flex-wrap items-end">
          <HWord>Find</HWord>
          <HWord>peace</HWord>
          <HWord>of</HWord>
          <HWord>mind</HWord>
          <HWord>in</HWord>
          <HWord>a</HWord>
          <div className="w-full" />
          <HWord green>spotless</HWord>
          <HWord green>sanctuary.</HWord>
        </div>
      </div>

      {/* ── Sticky 2-col body ── */}
      <div className="lg:grid lg:grid-cols-2">

        {/* LEFT — Sticky image viewport */}
        <div className="relative lg:sticky lg:top-0 lg:h-screen">
          {/* Images stacked */}
          <div className="relative h-[60vw] w-full lg:h-full">

            {/* Image 1 (active by default) */}
            <div ref={img1Ref} className="absolute inset-0">
              <Image
                src="/images/home1.png"
                alt="Premium interior"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Image 2 */}
            <div ref={img2Ref} className="absolute inset-0 opacity-0">
              <Image
                src="/images/home2.png"
                alt="Deep clean"
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Image 3 */}
            <div ref={img3Ref} className="absolute inset-0 opacity-0">
              <Image
                src="/images/home3.png"
                alt="Eco friendly"
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Cinematic gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

            {/* Grain overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
                mixBlendMode: "overlay",
              }}
            />

            {/* HUD index labels — bottom left */}
            <div ref={imgTagRef} className="absolute bottom-6 left-6 space-y-0.5">
              {[
                { tag: "01", label: "PREMIUM SPACES" },
                { tag: "02", label: "DEEP CLEAN"     },
                { tag: "03", label: "ECO-FRIENDLY"   },
              ].map(({ tag, label }) => (
                <div key={tag} className="flex items-center gap-2">
                  <span
                    className="text-[9px] tracking-[0.32em] text-white/35 uppercase"
                    style={{ fontFamily: "var(--font-orbitron), monospace" }}
                  >
                    {tag} / {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Scrolling narrative */}
        <div className="flex flex-col px-6 py-16 lg:px-12 lg:py-20">

          {/* Section badge */}
          <div className="mb-10 inline-flex items-center gap-2 self-start rounded-full border border-[#55A53B]/30 bg-[#55A53B]/8 px-4 py-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#55A53B]" />
            <span
              className="text-[10px] tracking-[0.3em] text-[#55A53B] uppercase"
              style={{ fontFamily: "var(--font-orbitron), monospace" }}
            >
              About Myra Keleher
            </span>
          </div>

          {/* ── Section 01 — Identity ── */}
          <div className="mb-24">
            <div
              className="mb-4 text-[10px] tracking-[0.35em] text-[#6b7280] uppercase"
              style={{ fontFamily: "var(--font-orbitron), monospace" }}
            >
              01 / Identity
            </div>
            <div
              ref={para1Ref}
              className="text-xl leading-[1.9] text-[#0a0a0a] lg:text-2xl"
            >
              <SplitWords text="At Myra Keleher, we don't just clean; we curate. Backed by eco-friendly protocols and a vetted team of specialists, we transform your residence into a standard of hygiene and luxury that you can feel the moment you walk in." />
            </div>
          </div>

          {/* ── Section 02 — Standard ── */}
          <div ref={sec2Ref} className="mb-24">
            <div
              className="mb-4 text-[10px] tracking-[0.35em] text-[#6b7280] uppercase"
              style={{ fontFamily: "var(--font-orbitron), monospace" }}
            >
              02 / Standard
            </div>
            <div
              ref={para2Ref}
              className="text-xl leading-[1.9] text-[#0a0a0a] lg:text-2xl"
            >
              <SplitWords text="True luxury starts with the right details — and no one cleans deeper than we do. Every product, every technique, every team member is selected to meet our uncompromising standard of excellence." />
            </div>
          </div>

          {/* ── Section 03 — Promise ── */}
          <div ref={sec3Ref} className="mb-20">
            <div
              className="mb-6 text-[10px] tracking-[0.35em] text-[#6b7280] uppercase"
              style={{ fontFamily: "var(--font-orbitron), monospace" }}
            >
              03 / Promise
            </div>

            <div className="mb-10 space-y-3">
              {FEATURES.map((feature) => (
                <div key={feature} className="feature-item flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#55A53B]" />
                  <span className="text-base text-[#4a4a4a]">{feature}</span>
                </div>
              ))}
            </div>

            <MagneticCTA />
          </div>

          {/* ── HUD Metrics strip ── */}
          <div className="border border-[#e5e5e5]">
            <div className="border-b border-[#e5e5e5] px-5 py-2">
              <span
                className="text-[9px] tracking-[0.3em] text-[#9ca3af] uppercase"
                style={{ fontFamily: "var(--font-orbitron), monospace" }}
              >
                Performance Data
              </span>
            </div>
            <div className="flex divide-x divide-[#e5e5e5]">
              <CountUpStat end={63} suffix="+"  label="Homes Cleaned" />
              <CountUpStat end={99}  suffix="%"  label="Satisfaction"  />
              <CountUpStat end={100} suffix="%"  label="Eco-Friendly"  />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

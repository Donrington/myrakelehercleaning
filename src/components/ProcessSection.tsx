"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";

// 1px blueprint micro-grid
function MicroGrid() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="mg" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="#000000"
            strokeWidth="0.4"
            opacity="0.07"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mg)" />
    </svg>
  );
}

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // BAR-FIRST sync model: each bar fills fully while its card is stationary,
  // then the card snaps quickly to reveal the next. 4:1 hold-to-snap ratio.
  //
  //  0.000 → 0.267  Card 1 holds  (Bar 1 fills 0% → 100%)
  //  0.267 → 0.333  Card 1 snaps  (bar stays full, card slides out)
  //  0.333 → 0.600  Card 2 holds  (Bar 2 fills 0% → 100%)
  //  0.600 → 0.667  Card 2 snaps  (bar stays full, card slides out)
  //  0.667 → 1.000  Card 3 holds  (Bar 3 fills 0% → 100%)
  // Each card is 100vw; container is 300vw.
  // translateX(%) is relative to the element's OWN width, so:
  //   card 2 = -100vw = -33.333% of 300vw
  //   card 3 = -200vw = -66.667% of 300vw
  const x = useTransform(
    scrollYProgress,
    [0,     0.267,       0.333,        0.600,        0.667,        1.0          ],
    ["0%", "0%", "-33.333%", "-33.333%", "-66.667%", "-66.667%"]
  );

  // Bars fill only during their card's hold period — completion = snap trigger
  const w1 = useTransform(scrollYProgress, [0,     0.267], ["0%", "100%"]);
  const w2 = useTransform(scrollYProgress, [0.333, 0.600], ["0%", "100%"]);
  const w3 = useTransform(scrollYProgress, [0.667, 1.0  ], ["0%", "100%"]);

  // Each card gets its own laser tied to its hold window
  const laserY  = useTransform(scrollYProgress, [0,     0.267], ["0%", "100%"]);
  const laserY2 = useTransform(scrollYProgress, [0.333, 0.600], ["0%", "100%"]);
  const laserY3 = useTransform(scrollYProgress, [0.667, 1.0  ], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      {/* ── Sticky Viewport ── */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[#f8f9fa]">
        <MicroGrid />

        {/* Section label */}
        <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
          <div className="h-px w-10 bg-[#0a0a0a]" />
          <span className="font-mono text-xs tracking-[0.3em] text-[#6b7280] uppercase">
            04 — The Process
          </span>
        </div>

        {/* Step progress indicators */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 md:gap-10">
          {[
            { label: "Assessment", w: w1 },
            { label: "Deep Clean", w: w2 },
            { label: "Inspection", w: w3 },
          ].map(({ label, w }) => (
            <div key={label} className="flex flex-col items-start gap-1.5">
              <span className="hidden md:block font-mono text-[10px] tracking-[0.25em] text-[#6b7280] uppercase">
                {label}
              </span>
              <div className="h-px w-14 md:w-24 bg-[#e5e5e5]">
                <motion.div className="h-full bg-[#0a0a0a]" style={{ width: w }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Horizontal Rail (300vw) ── */}
        <motion.div
          className="absolute top-0 left-0 flex h-full"
          style={{ x, width: "300vw" }}
        >
          {/* ═══════════ CARD 1 — ASSESSMENT ═══════════ */}
          <div className="relative flex h-full w-screen items-center justify-center">
            <div className="relative mx-auto flex flex-col md:flex-row h-[76vh] w-[88vw] max-w-[1224px] overflow-hidden border border-[#e5e5e5] bg-white">

              {/* ── Left: LiDAR Scan ── */}
              <div className="relative w-full md:w-1/2 overflow-hidden order-2 md:order-1 h-[55%] md:h-full">
                {/* Base greyscale image */}
                <Image
                  src="/images/livingreoomassess.png"
                  alt=""
                  fill
                  loading="lazy"
                  className="object-cover"
                  style={{ filter: "grayscale(1) contrast(1.15)" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Scanned region above laser — inverted/high contrast */}
                <motion.div
                  className="absolute inset-x-0 top-0 overflow-hidden"
                  style={{ height: laserY }}
                >
                  <div
                    className="absolute inset-x-0 top-0"
                    style={{
                      height: "100vh",
                      backgroundImage: "url('/images/bathandkitchenacess.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "grayscale(1) contrast(1.6) brightness(1.1)",
                    }}
                  />
                </motion.div>

                {/* Green laser line */}
                <motion.div
                  className="absolute inset-x-0 z-10"
                  style={{ top: laserY }}
                >
                  <div className="h-0.5 w-full bg-[#55A53B] shadow-[0_0_14px_4px_rgba(16,185,129,0.55)]" />
                  <div
                    className="h-20 w-full"
                    style={{
                      background: "linear-gradient(to bottom, rgba(16,185,129,0.18), transparent)",
                    }}
                  />
                </motion.div>

                {/* Blueprint scan grid */}
                <div className="absolute inset-0 z-5 pointer-events-none">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="absolute inset-x-0 border-t border-dashed border-emerald-400/15"
                      style={{ top: `${i * 16.66}%` }}
                    />
                  ))}
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute inset-y-0 border-l border-dashed border-emerald-400/10"
                      style={{ left: `${i * 25}%` }}
                    />
                  ))}
                </div>

                {/* Room tags */}
                <div className="absolute top-4 left-4 z-20 space-y-1">
                  {["[Kitchen & Baths]", "[Living Areas]"].map((t) => (
                    <div
                      key={t}
                      className="bg-black/60 px-2 py-0.5 backdrop-blur-sm"
                    >
                      <span className="font-mono text-[10px] text-[#55A53B]">
                        {t}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right: Room Overview ── */}
              <div className="flex w-full md:w-1/2 flex-col justify-between border-b border-[#e5e5e5] md:border-b-0 md:border-l bg-[#f8f9fa] p-4 md:p-8 order-1 md:order-2 h-[45%] md:h-full overflow-y-auto md:overflow-visible">
                <div>
                  <div className="mb-1 font-mono text-xs tracking-[0.3em] text-emerald-600 uppercase">
                    Step 01
                  </div>
                  <h2 className="mb-2 md:mb-4 text-3xl md:text-5xl font-extrabold leading-[1.15] tracking-tight text-[#0a0a0a]">
                    Home
                    <br />
                    Assessment
                  </h2>
                  <p className="text-sm leading-relaxed text-[#6b7280]">
                    We walk every room before we begin. Every surface, corner,
                    and priority area is noted so the team arrives prepared and
                    nothing is missed.
                  </p>
                </div>

                {/* Room overview panel */}
                <div className="space-y-2 border border-[#e5e5e5] bg-white p-4">
                  <div className="mb-3 font-mono text-[10px] tracking-wider text-[#6b7280] uppercase">
                    Room Overview
                  </div>
                  {[
                    { key: "ROOMS_ASSESSED", val: "08" },
                    { key: "FOCUS_AREAS",    val: "12" },
                    { key: "HOURS_PLANNED",  val: "04" },
                  ].map(({ key, val }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#6b7280]">
                        {key}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#0a0a0a]">
                        {val}
                      </span>
                    </div>
                  ))}
                  <div className="mt-2 flex items-center gap-2 border-t border-[#e5e5e5] pt-2">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#55A53B]" />
                    <span className="font-mono text-[10px] text-emerald-600">
                      IN PROGRESS
                    </span>
                  </div>
                </div>

                {/* Area markers */}
                <div className="grid grid-cols-3 gap-2">
                  {["Kitchen", "Bathrooms", "Living"].map((c) => (
                    <div
                      key={c}
                      className="border border-[#e5e5e5] bg-white px-2 py-1.5 text-center"
                    >
                      <span className="font-mono text-[10px] text-[#6b7280]">
                        {c}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════ CARD 2 — DEEP CLEAN ═══════════ */}
          <div className="relative flex h-full w-screen items-center justify-center">
            <div className="relative mx-auto flex flex-col md:flex-row h-[76vh] w-[88vw] max-w-[1224px] overflow-hidden border border-[#e5e5e5] bg-white">

              {/* ── Left: Laser Scan ── */}
              <div className="relative w-full md:w-1/2 overflow-hidden order-2 md:order-1 h-[55%] md:h-full">
                {/* Base greyscale image */}
                <Image
                  src="/images/bathcleaning.png"
                  alt=""
                  fill
                  loading="lazy"
                  className="object-cover"
                  style={{ filter: "grayscale(1) contrast(1.15)" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Scanned region — full-colour reveal grows from top */}
                <motion.div
                  className="absolute inset-x-0 top-0 overflow-hidden"
                  style={{ height: laserY2 }}
                >
                  <div
                    className="absolute inset-x-0 top-0"
                    style={{
                      height: "100vh",
                      backgroundImage: "url('/images/deepclean.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "saturate(1.3) brightness(1.05)",
                    }}
                  />
                </motion.div>

                {/* Green laser line */}
                <motion.div
                  className="absolute inset-x-0 z-10"
                  style={{ top: laserY2 }}
                >
                  <div className="h-0.5 w-full bg-[#55A53B] shadow-[0_0_14px_4px_rgba(16,185,129,0.55)]" />
                  <div
                    className="h-20 w-full"
                    style={{
                      background: "linear-gradient(to bottom, rgba(16,185,129,0.18), transparent)",
                    }}
                  />
                </motion.div>

                {/* Blueprint scan grid */}
                <div className="absolute inset-0 z-5 pointer-events-none">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="absolute inset-x-0 border-t border-dashed border-emerald-400/15"
                      style={{ top: `${i * 16.66}%` }}
                    />
                  ))}
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute inset-y-0 border-l border-dashed border-emerald-400/10"
                      style={{ left: `${i * 25}%` }}
                    />
                  ))}
                </div>

                {/* Room tags */}
                <div className="absolute top-4 left-4 z-20 space-y-1">
                  {["[Bathrooms]", "[Kitchen]"].map((t) => (
                    <div
                      key={t}
                      className="bg-black/60 px-2 py-0.5 backdrop-blur-sm"
                    >
                      <span className="font-mono text-[10px] text-[#55A53B]">
                        {t}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right: Cleaning Panel ── */}
              <div className="flex w-full md:w-1/2 flex-col justify-between border-b border-[#e5e5e5] md:border-b-0 md:border-l bg-[#f8f9fa] p-4 md:p-8 order-1 md:order-2 h-[45%] md:h-full overflow-y-auto md:overflow-visible">
                <div>
                  <div className="mb-1 font-mono text-xs tracking-[0.3em] text-emerald-600 uppercase">
                    Step 02
                  </div>
                  <h2 className="mb-2 md:mb-4 text-3xl md:text-5xl font-extrabold leading-[1.15] tracking-tight text-[#0a0a0a]">
                    Full
                    <br />
                    Deep Clean
                  </h2>
                  <p className="text-sm leading-relaxed text-[#6b7280]">
                    Eco-friendly products applied room by room with professional
                    tools. Every surface, tile, and fixture cleaned to a
                    spotless standard.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Eco Spray",     status: "ACTIVE"   },
                    { name: "Steam Clean",   status: "ACTIVE"   },
                    { name: "HEPA Vacuum",   status: "RUNNING"  },
                    { name: "Microfiber Kit", status: "DEPLOYED" },
                  ].map(({ name, status }) => (
                    <div
                      key={name}
                      className="border border-[#e5e5e5] bg-white p-3"
                    >
                      <div className="mb-1 font-mono text-[10px] text-[#6b7280]">
                        {name}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#55A53B]" />
                        <span className="font-mono text-[10px] font-bold text-emerald-600">
                          {status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Surface cleanliness bar */}
                <div className="border border-[#e5e5e5] bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#6b7280] uppercase">
                      Surface Cleanliness
                    </span>
                    <span className="font-mono text-[10px] font-bold text-emerald-600">
                      99.9%
                    </span>
                  </div>
                  <div className="h-px w-full bg-[#e5e5e5]">
                    <motion.div
                      className="h-full origin-left bg-[#55A53B]"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 0.999 }}
                      transition={{ duration: 3, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════ CARD 3 — INSPECTION ═══════════ */}
          <div className="relative flex h-full w-screen items-center justify-center">
            <div className="relative mx-auto flex flex-col md:flex-row h-[76vh] w-[88vw] max-w-[1224px] overflow-hidden border border-[#e5e5e5] bg-white">

              {/* ── Left: Laser Scan ── */}
              <div className="relative w-full md:w-1/2 overflow-hidden order-2 md:order-1 h-[55%] md:h-full">
                {/* Base greyscale image */}
                <Image
                  src="/images/cleaningroom.png"
                  alt=""
                  fill
                  loading="lazy"
                  className="object-cover"
                  style={{ filter: "grayscale(1) contrast(1.15)" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Scanned region — full-colour reveal grows from top */}
                <motion.div
                  className="absolute inset-x-0 top-0 overflow-hidden"
                  style={{ height: laserY3 }}
                >
                  <div
                    className="absolute inset-x-0 top-0"
                    style={{
                      height: "100vh",
                      backgroundImage: "url('/images/gloves.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "saturate(1.3) brightness(1.05)",
                    }}
                  />
                </motion.div>

                {/* Green laser line */}
                <motion.div
                  className="absolute inset-x-0 z-10"
                  style={{ top: laserY3 }}
                >
                  <div className="h-0.5 w-full bg-[#55A53B] shadow-[0_0_14px_4px_rgba(16,185,129,0.55)]" />
                  <div
                    className="h-20 w-full"
                    style={{
                      background: "linear-gradient(to bottom, rgba(16,185,129,0.18), transparent)",
                    }}
                  />
                </motion.div>

                {/* Blueprint scan grid */}
                <div className="absolute inset-0 z-5 pointer-events-none">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="absolute inset-x-0 border-t border-dashed border-emerald-400/15"
                      style={{ top: `${i * 16.66}%` }}
                    />
                  ))}
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute inset-y-0 border-l border-dashed border-emerald-400/10"
                      style={{ left: `${i * 25}%` }}
                    />
                  ))}
                </div>

                {/* Room tags */}
                <div className="absolute top-4 left-4 z-20 space-y-1">
                  {["[Final Check]", "[All Rooms]"].map((t) => (
                    <div
                      key={t}
                      className="bg-black/60 px-2 py-0.5 backdrop-blur-sm"
                    >
                      <span className="font-mono text-[10px] text-[#55A53B]">
                        {t}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right: Inspection Panel ── */}
              <div className="flex w-full md:w-1/2 flex-col justify-between border-b border-[#e5e5e5] md:border-b-0 md:border-l bg-[#f8f9fa] p-4 md:p-8 order-1 md:order-2 h-[45%] md:h-full overflow-y-auto md:overflow-visible">
                <div>
                  <div className="mb-1 font-mono text-xs tracking-[0.3em] text-emerald-600 uppercase">
                    Step 03
                  </div>
                  <h2 className="mb-2 md:mb-4 text-3xl md:text-5xl font-extrabold leading-[1.15] tracking-tight text-[#0a0a0a]">
                    White-Glove
                    <br />
                    Inspection
                  </h2>
                  <p className="text-sm leading-relaxed text-[#6b7280]">
                    Every room is walked against our 47-point checklist. We do
                    not leave until every detail meets our standard. Certified
                    clean, guaranteed.
                  </p>
                </div>

                {/* Inspection checklist */}
                <div className="space-y-2">
                  <div className="mb-2 font-mono text-[10px] tracking-wider text-[#6b7280] uppercase">
                    Inspection Checklist
                  </div>
                  {[
                    "Every surface wiped down",
                    "No residue or streaks",
                    "Eco products rinsed clean",
                    "Client inspection ready",
                  ].map((label) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 border border-emerald-500 bg-white px-3 py-2"
                    >
                      <div className="flex h-3 w-3 shrink-0 items-center justify-center border border-emerald-500">
                        <div className="h-1.5 w-1.5 bg-[#55A53B]" />
                      </div>
                      <span className="font-mono text-[10px] text-[#6b7280]">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Final status */}
                <div className="border border-emerald-500 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-[#6b7280]">
                      Verification Status
                    </span>
                    <span className="font-mono text-[10px] font-bold text-emerald-500">
                      CERTIFIED CLEAN ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { motion, useInView } from "framer-motion";

// ─────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────
const BRUSH_RADIUS        = 100;
const PARTICLE_SPAWN      = 6;
const PURITY_INTERVAL_MS  = 400;   // pixel-sample purity every 400 ms
const SAMPLE_STRIDE       = 12;    // check every Nth pixel for purity (perf)
const COMPLETION_THRESHOLD = 82;

// ─────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number;
  size: number;
}

// ─────────────────────────────────────────────────────
// Draw helpers
// ─────────────────────────────────────────────────────

/** Object-cover maths — returns draw rect for ctx.drawImage */
function coverRect(
  iw: number, ih: number,
  cw: number, ch: number,
): [number, number, number, number] {
  const ia = iw / ih;
  const ca = cw / ch;
  let sw: number, sh: number, sx: number, sy: number;
  if (ia > ca) { sh = ch; sw = ch * ia; sx = -(sw - cw) / 2; sy = 0; }
  else         { sw = cw; sh = cw / ia; sx = 0; sy = -(sh - ch) / 2; }
  return [sx, sy, sw, sh];
}

/** Programmatic noise / grime — runs once at init */
function paintGrime(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
): void {
  // Per-pixel grain — fast typed-array mutation
  const id   = ctx.getImageData(0, 0, W, H);
  const data = id.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 55;
    data[i]     = Math.max(0, Math.min(255, data[i]     + n));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
  }
  ctx.putImageData(id, 0, 0);

  // Dust motes
  for (let i = 0; i < 1200; i++) {
    ctx.fillStyle = `rgba(${110 + Math.random() * 60},${90 + Math.random() * 40},${50 + Math.random() * 30},${0.04 + Math.random() * 0.12})`;
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Smear streaks
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const len = 20 + Math.random() * 120;
    const angle = Math.random() * Math.PI;
    ctx.strokeStyle = `rgba(80,60,30,${0.03 + Math.random() * 0.07})`;
    ctx.lineWidth = 1 + Math.random() * 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }

  // Vignette overlay  (dark edges = looks dirtier)
  const vg = ctx.createRadialGradient(W/2, H/2, H*0.28, W/2, H/2, H*0.85);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
}

// ─────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────
export default function EvidenceSection() {
  const sectionRef       = useRef<HTMLDivElement>(null);
  const dirtyCanvasRef   = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef        = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, { once: true, margin: "-8%" });

  // React state (minimal — only what drives visible UI)
  const [purity,     setPurity]     = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [resolution, setResolution] = useState<string | null>(null);

  // Perf-critical refs (never trigger re-render)
  const isPointerDown  = useRef(false);
  const lastPos        = useRef<{ x: number; y: number } | null>(null);
  const particles      = useRef<Particle[]>([]);
  const pRafRef        = useRef<number>(0);
  const lastPurityTs   = useRef(0);
  const eraseRafPending = useRef(false);
  const pendingErase   = useRef<{ x: number; y: number; r: number }[]>([]);

  // ─── Init dirty canvas ──────────────────────────────
  const initDirtyCanvas = useCallback(() => {
    const canvas = dirtyCanvasRef.current;
    if (!canvas) return;

    const W = canvas.clientWidth  || window.innerWidth;
    const H = canvas.clientHeight || window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img   = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/images/revealprotocol.png";

    const drawAll = () => {
      // 1 — dirty-filtered image
      ctx.save();
      ctx.filter =
        "sepia(30%) brightness(65%) grayscale(25%) contrast(1.25)";
      const [sx, sy, sw, sh] = coverRect(img.naturalWidth, img.naturalHeight, W, H);
      ctx.drawImage(img, sx, sy, sw, sh);
      ctx.restore();
      ctx.filter = "none";

      // 2 — programmatic grime
      paintGrime(ctx, W, H);
    };

    if (img.complete && img.naturalWidth > 0) {
      drawAll();
    } else {
      img.onload  = drawAll;
      img.onerror = () => {
        // Fallback: solid dark overlay + grime if image fails
        ctx.fillStyle = "rgba(35,30,22,0.93)";
        ctx.fillRect(0, 0, W, H);
        paintGrime(ctx, W, H);
      };
    }
  }, []);

  // ─── Erase stroke (batched via RAF) ─────────────────
  const flushErase = useCallback(() => {
    eraseRafPending.current = false;
    const canvas = dirtyCanvasRef.current;
    if (!canvas || pendingErase.current.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    for (const { x, y, r } of pendingErase.current) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0,    "rgba(0,0,0,1)");
      g.addColorStop(0.40, "rgba(0,0,0,0.85)");
      g.addColorStop(0.75, "rgba(0,0,0,0.30)");
      g.addColorStop(1,    "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    pendingErase.current = [];
  }, []);

  const scheduleErase = useCallback(
    (x: number, y: number, r = BRUSH_RADIUS) => {
      pendingErase.current.push({ x, y, r });
      if (!eraseRafPending.current) {
        eraseRafPending.current = true;
        requestAnimationFrame(flushErase);
      }
    },
    [flushErase],
  );

  // ─── Purity sampling ────────────────────────────────
  const samplePurity = useCallback(() => {
    const canvas = dirtyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width: W, height: H } = canvas;
    const data = ctx.getImageData(0, 0, W, H).data;
    let transparent = 0;
    let total       = 0;
    for (let i = 3; i < data.length; i += 4 * SAMPLE_STRIDE) {
      if (data[i] < 128) transparent++;
      total++;
    }
    const pct = Math.round((transparent / total) * 100);
    setPurity(pct);
    if (pct >= COMPLETION_THRESHOLD) setIsComplete(true);
  }, []);

  // ─── Particles ──────────────────────────────────────
  const spawnParticles = useCallback((x: number, y: number) => {
    for (let i = 0; i < PARTICLE_SPAWN; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.7 + Math.random() * 2.2;
      particles.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4,
        alpha: 0.75 + Math.random() * 0.25,
        size:  2 + Math.random() * 3.5,
      });
    }
    if (particles.current.length > 180) {
      particles.current = particles.current.slice(-180);
    }
  }, []);

  // ─── Particle RAF loop ───────────────────────────────
  useEffect(() => {
    const pCanvas = particleCanvasRef.current;
    if (!pCanvas) return;

    // Set size once; maintain via resize listener
    const resize = () => {
      pCanvas.width  = window.innerWidth;
      pCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      pRafRef.current = requestAnimationFrame(tick);
      const ctx = pCanvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      particles.current = particles.current.filter((p) => p.alpha > 0.015);

      for (const p of particles.current) {
        p.x     += p.vx;
        p.y     += p.vy;
        p.vy    += 0.055; // gravity
        p.alpha *= 0.91;
        p.size  *= 0.97;
        if (p.alpha < 0.015) continue;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        g.addColorStop(0, `rgba(85,165,59,${p.alpha})`);
        g.addColorStop(1, `rgba(85,165,59,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    pRafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(pRafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ─── Canvas init + resize ────────────────────────────
  useEffect(() => {
    setResolution(`${window.innerWidth}×${window.innerHeight}`);
    initDirtyCanvas();
    const onResize = () => {
      setResolution(`${window.innerWidth}×${window.innerHeight}`);
      initDirtyCanvas();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [initDirtyCanvas]);

  // ─── Global cursor tracking ──────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (cursorRef.current)
        cursorRef.current.style.transform =
          `translate(${e.clientX - 28}px, ${e.clientY - 28}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ─── Pointer helpers ────────────────────────────────
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = dirtyCanvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const onDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      isPointerDown.current = true;
      if (!hasStarted) setHasStarted(true);
      const pos = getPos(e);
      lastPos.current = pos;
      scheduleErase(pos.x, pos.y, BRUSH_RADIUS * 1.15);
      spawnParticles(pos.x, pos.y);
      // cursor: scale up
      if (cursorRef.current) {
        cursorRef.current.style.width  = "70px";
        cursorRef.current.style.height = "70px";
        cursorRef.current.style.boxShadow =
          "0 0 28px 8px rgba(85,165,59,0.45), inset 0 0 18px 3px rgba(85,165,59,0.15)";
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasStarted, scheduleErase, spawnParticles],
  );

  const onMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const pos = getPos(e);

      // update cursor position from canvas events too
      if (!("touches" in e) && cursorRef.current) {
        const me = e as React.MouseEvent;
        cursorRef.current.style.transform =
          `translate(${me.clientX - 28}px, ${me.clientY - 28}px)`;
      }

      if (!isPointerDown.current) return;

      // interpolate for gap-free stroke
      if (lastPos.current) {
        const dx    = pos.x - lastPos.current.x;
        const dy    = pos.y - lastPos.current.y;
        const dist  = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.max(1, Math.floor(dist / 12));
        for (let i = 0; i <= steps; i++) {
          scheduleErase(
            lastPos.current.x + (dx * i) / steps,
            lastPos.current.y + (dy * i) / steps,
          );
        }
        if (Math.random() < 0.35) spawnParticles(pos.x, pos.y);
      }
      lastPos.current = pos;

      // throttled purity sampling
      const now = performance.now();
      if (now - lastPurityTs.current > PURITY_INTERVAL_MS) {
        lastPurityTs.current = now;
        samplePurity();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scheduleErase, spawnParticles, samplePurity],
  );

  const onUp = useCallback(() => {
    isPointerDown.current = false;
    lastPos.current       = null;
    samplePurity();
    if (cursorRef.current) {
      cursorRef.current.style.width  = "56px";
      cursorRef.current.style.height = "56px";
      cursorRef.current.style.boxShadow =
        "0 0 16px 4px rgba(85,165,59,0.28), inset 0 0 12px 2px rgba(85,165,59,0.07)";
    }
  }, [samplePurity]);

  // ─────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="evidence"
      className="relative h-screen w-full overflow-hidden"
      style={{ cursor: "none" }}
    >
      {/* ══ Entry fade from black ══ */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-50 bg-black"
        initial={{ opacity: 1 }}
        animate={isInView ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />

      {/* ══ LAYER 1 — Clean image ══ */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/revealprotocol.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* ══ LAYER 2 — Dirty canvas (erased by pointer) ══ */}
      <canvas
        ref={dirtyCanvasRef}
        className="absolute inset-0 z-10 h-full w-full"
        style={{ display: "block" }}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      />

      {/* ══ LAYER 3 — Particle canvas ══ */}
      <canvas
        ref={particleCanvasRef}
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        style={{ display: "block" }}
      />

      {/* ══ LAYER 4 — UI overlay ══ */}
      <div className="pointer-events-none absolute inset-0 z-30">
        {/* Section label — top left */}
        <motion.div
          className="absolute left-8 top-8 flex items-center gap-3"
          initial={{ opacity: 0, y: -12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          <div className="h-px w-7 bg-[#55A53B]" />
          <span
            className="text-[10px] tracking-[0.32em] text-[#55A53B]"
            style={{ fontFamily: "var(--font-orbitron), monospace" }}
          >
            SECTION 05 / THE EVIDENCE
          </span>
        </motion.div>

        {/* Scan-line texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,1) 2px,rgba(255,255,255,1) 3px)",
          }}
        />

        {/* Instruction hint — centred, fades after interaction */}
        {!hasStarted && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.6, duration: 0.9 }}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                className="flex h-[72px] w-[72px] items-center justify-center rounded-full"
                style={{
                  border: "1.5px solid rgba(85,165,59,0.65)",
                  boxShadow: "0 0 36px 10px rgba(85,165,59,0.15)",
                }}
              >
                {/* Hand/scrub icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#55A53B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
              </motion.div>
              <p
                className="text-[11px] tracking-[0.32em] text-[#55A53B]"
                style={{ fontFamily: "var(--font-orbitron), monospace" }}
              >
                SCRUB TO REVEAL
              </p>
              <p
                className="text-xs text-white/35"
                style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
              >
                Drag your cursor across the surface
              </p>
            </div>
          </motion.div>
        )}

        {/* Bottom-left — THE REVEAL PROTOCOL + PURITY counter */}
        <div className="absolute bottom-8 left-8">
          <p
            className="mb-1.5 text-[9px] tracking-[0.38em] text-white/35"
            style={{ fontFamily: "var(--font-orbitron), monospace" }}
          >
            THE REVEAL PROTOCOL
          </p>

          <motion.div
            className="flex items-baseline gap-2"
            animate={{ opacity: purity > 0 ? 1 : 0.4 }}
          >
            <span
              className="text-[2.6rem] font-bold leading-none text-white"
              style={{ fontFamily: "var(--font-orbitron), monospace" }}
            >
              PURITY
            </span>
            <span
              className="text-[2.6rem] font-bold leading-none text-[#55A53B]"
              style={{
                fontFamily: "var(--font-orbitron), monospace",
                textShadow: "0 0 24px rgba(85,165,59,0.5)",
              }}
            >
              {purity}%
            </span>
          </motion.div>

          {/* Purity progress bar */}
          <div className="mt-2.5 h-px w-56 overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-[#55A53B]"
              style={{ boxShadow: "0 0 8px 2px rgba(85,165,59,0.65)" }}
              animate={{ width: `${purity}%` }}
              transition={{ ease: "easeOut", duration: 0.35 }}
            />
          </div>

          {/* Dynamic status label */}
          <p
            className="mt-2 text-[9px] tracking-[0.22em]"
            style={{
              fontFamily: "var(--font-orbitron), monospace",
              color:
                purity >= COMPLETION_THRESHOLD
                  ? "#55A53B"
                  : purity > 0
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(255,255,255,0.15)",
            }}
          >
            {purity >= COMPLETION_THRESHOLD
              ? "✓  CERTIFIED CLEAN — PROTOCOL COMPLETE"
              : purity > 0
              ? "CLEANING IN PROGRESS..."
              : "AWAITING INTERACTION"}
          </p>
        </div>

        {/* Top-right corner — coordinate readout (decorative) */}
        <motion.div
          className="absolute right-8 top-8 text-right"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <p
            className="text-[9px] tracking-[0.3em] text-white/20"
            style={{ fontFamily: "var(--font-orbitron), monospace" }}
          >
            SURFACE SCAN ACTIVE
          </p>
          <p
            className="mt-0.5 text-[9px] tracking-[0.3em] text-[#55A53B]/50"
            style={{ fontFamily: "var(--font-orbitron), monospace" }}
          >
            {resolution ? `RES ${resolution}` : ""}
          </p>
        </motion.div>
      </div>

      {/* ══ Completion banner ══ */}
      {isComplete && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div
            className="rounded-sm border border-[#55A53B]/35 px-14 py-8 text-center"
            style={{
              background: "rgba(0,0,0,0.62)",
              backdropFilter: "blur(18px)",
              boxShadow: "0 0 90px 20px rgba(85,165,59,0.1)",
            }}
          >
            <p
              className="mb-1.5 text-[9px] tracking-[0.38em] text-[#55A53B]"
              style={{ fontFamily: "var(--font-orbitron), monospace" }}
            >
              PROTOCOL COMPLETE — PURITY RESTORED
            </p>
            <p
              className="text-3xl font-extrabold text-white"
              style={{ fontFamily: "var(--font-geist), sans-serif" }}
            >
              That&apos;s what we do.
              <br />
              <span className="text-[#55A53B]">Every time.</span>
            </p>
          </div>
        </motion.div>
      )}

      {/* ══ Custom cursor ring ══ */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed z-[9999]"
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "1.5px solid rgba(85,165,59,0.82)",
          boxShadow:
            "0 0 16px 4px rgba(85,165,59,0.28), inset 0 0 12px 2px rgba(85,165,59,0.07)",
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(85,165,59,0.05)",
          top: 0,
          left: 0,
          transform: "translate(-200px,-200px)",
          transition: "width 0.15s ease, height 0.15s ease, box-shadow 0.15s ease",
        }}
      />
    </section>
  );
}

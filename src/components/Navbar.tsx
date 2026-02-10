"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Nav links config
// ─────────────────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "About",    href: "#about"    },
  { label: "Services", href: "#services" },
  { label: "Process",  href: "#process"  },
  { label: "Reviews",  href: "#evidence" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Magnetic Nav Link
// ─────────────────────────────────────────────────────────────────────────────
const MAG_STRENGTH = 0.28;
const MAG_SPRING   = { stiffness: 180, damping: 22, mass: 0.07 };

function MagneticLink({
  label,
  href,
  scrolled,
}: {
  label: string;
  href: string;
  scrolled: boolean;
}) {
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
      className="relative flex cursor-pointer flex-col items-center"
    >
      <a
        href={href}
        className="text-sm font-medium transition-colors duration-200"
        style={{ color: hovered ? "#55A53B" : scrolled ? "#171717" : "rgba(255,255,255,0.75)" }}
      >
        {label}
      </a>

      {/* Glowing green dot indicator */}
      <motion.div
        className="mt-0.5 rounded-full bg-[#55A53B]"
        animate={{
          width:   hovered ? 4 : 0,
          height:  hovered ? 4 : 0,
          opacity: hovered ? 1 : 0,
          boxShadow: hovered ? "0 0 6px 2px rgba(85,165,59,0.5)" : "none",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Adaptive Book Now Button with shimmer
// ─────────────────────────────────────────────────────────────────────────────
function BookButton({ scrolled }: { scrolled: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href="#book"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold"
      animate={
        scrolled
          ? { backgroundColor: "#55A53B", color: "#ffffff", borderColor: "#55A53B" }
          : { backgroundColor: "rgba(255,255,255,0.08)", color: "#ffffff", borderColor: "rgba(255,255,255,0.4)" }
      }
      transition={{ duration: 0.35, ease: "easeInOut" }}
      style={{ border: "1px solid" }}
    >
      {/* Shimmer sweep */}
      <motion.div
        className="pointer-events-none absolute inset-0 -skew-x-12"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
        }}
        initial={{ x: "-120%" }}
        animate={{ x: hovered ? "220%" : "-120%" }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      />
      <span className="relative z-10">Book Now</span>
    </motion.a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Full-screen mobile overlay
// ─────────────────────────────────────────────────────────────────────────────
const overlayVariants = {
  closed: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" as const } },
  open:   { opacity: 1, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const itemVariants = {
  closed: { y: "60%", opacity: 0 },
  open: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 16,
      delay: 0.08 + i * 0.06,
    },
  }),
};

function MobileOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-overlay"
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 z-60 flex flex-col"
          style={{
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            backgroundColor: "rgba(5,5,5,0.92)",
          }}
        >
          {/* Close button */}
          <div className="flex items-center justify-between px-6 pt-5">
            {/* Logo */}
            <Image
              src="/images/logo.png"
              alt="Myra Keleher"
              width={40}
              height={40}
              className="opacity-80"
            />
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav items — massive stagger */}
          <nav className="flex flex-1 flex-col justify-center px-8 pb-16">
            <div className="space-y-1">
              {navLinks.map((link, i) => (
                <div key={link.href} className="overflow-hidden border-b border-white/6">
                  <motion.div
                    custom={i}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <a
                      href={link.href}
                      onClick={onClose}
                      className="group flex items-end justify-between py-5"
                    >
                      <span
                        className="text-5xl font-extrabold tracking-tighter text-white/85 transition-colors group-hover:text-[#55A53B]"
                        style={{ fontFamily: "var(--font-geist), sans-serif" }}
                      >
                        {link.label}
                      </span>
                      <ArrowUpRight className="mb-2 h-6 w-6 text-white/20 transition-all group-hover:text-[#55A53B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* CTA inside overlay */}
            <motion.div
              custom={navLinks.length}
              variants={itemVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="mt-10"
            >
              <a
                href="#book"
                onClick={onClose}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#55A53B] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#55A53B]/30 transition-all hover:bg-[#4a9433]"
              >
                Book Now
              </a>
            </motion.div>
          </nav>

          {/* HUD footer strip */}
          <div className="border-t border-white/6 px-8 pb-8 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#55A53B]" />
              <span
                className="text-[10px] tracking-[0.3em] text-white/30 uppercase"
                style={{ fontFamily: "var(--font-orbitron), monospace" }}
              >
                OPERATIONAL STATUS:
              </span>
              <span
                className="text-[10px] tracking-[0.3em] text-[#55A53B] uppercase"
                style={{ fontFamily: "var(--font-orbitron), monospace" }}
              >
                ONLINE
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6 md:py-4">
          <motion.div
            className="flex items-center justify-between px-5 py-3 md:px-6"
            animate={
              scrolled
                ? {
                    backgroundColor: "rgba(255,255,255,0.92)",
                    borderColor: "rgba(0,0,0,0.06)",
                    boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
                  }
                : {
                    backgroundColor: "rgba(255,255,255,0.06)",
                    borderColor: "rgba(255,255,255,0.12)",
                    boxShadow: "0 0px 0px rgba(0,0,0,0)",
                  }
            }
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "1rem",
              border: "1px solid",
            }}
          >
            {/* Logo */}
            <a href="#" className="group shrink-0">
              <Image
                src={scrolled ? "/images/MK_Trans_black.png" : "/images/logo.png"}
                alt="Myra Keleher Logo"
                width={44}
                height={44}
                className="transition-all duration-300 group-hover:scale-110"
                style={{ filter: scrolled ? "none" : "brightness(0) invert(1)" }}
              />
            </a>

            {/* Desktop links */}
            <div className="hidden items-center gap-7 md:flex">
              {navLinks.map((link) => (
                <MagneticLink
                  key={link.href}
                  label={link.label}
                  href={link.href}
                  scrolled={scrolled}
                />
              ))}
            </div>

            {/* Desktop Book Now */}
            <div className="hidden items-center md:flex">
              <BookButton scrolled={scrolled} />
            </div>

            {/* Hamburger — mobile */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors md:hidden"
              style={{
                borderColor: scrolled ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)",
                color: scrolled ? "#171717" : "white",
              }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Full-screen mobile overlay */}
      <MobileOverlay open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

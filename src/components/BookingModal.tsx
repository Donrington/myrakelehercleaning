"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { X, ArrowRight, Check, Loader2 } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  contact: string;
  service: string;
  details: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated Field
// ─────────────────────────────────────────────────────────────────────────────
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group flex flex-col gap-2">
      <label
        className="font-mono text-[10px] tracking-[0.35em] text-white/40 uppercase"
      >
        {label}
      </label>
      {children}
      {error && (
        <span className="font-mono text-[10px] tracking-[0.2em] text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Success State
// ─────────────────────────────────────────────────────────────────────────────
function SuccessState() {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="flex flex-col items-center justify-center gap-6 py-16 text-center"
    >
      {/* Check circle */}
      <motion.div
        className="flex h-24 w-24 items-center justify-center rounded-full border border-[#55A53B]/40 bg-[#55A53B]/10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
        >
          <Check className="h-10 w-10 text-[#55A53B]" strokeWidth={2.5} />
        </motion.div>
      </motion.div>

      <div className="space-y-2">
        <motion.p
          className="font-mono text-[10px] tracking-[0.45em] text-[#55A53B] uppercase"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Protocol Initiated
        </motion.p>
        <motion.h3
          className="text-3xl font-extrabold tracking-tighter text-white"
          style={{ fontFamily: "var(--font-geist), sans-serif" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Request Received.
        </motion.h3>
        <motion.p
          className="max-w-xs text-sm leading-relaxed text-white/50"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Our team will reach out within 24 hours to confirm your appointment.
        </motion.p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Booking Modal
// ─────────────────────────────────────────────────────────────────────────────
export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [phase, setPhase] = useState<"form" | "loading" | "success">("form");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  // ── Close on Escape ───────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ── Lock body scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── Reset form when closed ────────────────────────────────────────────────
  const handleClose = () => {
    onClose();
    // Small delay so exit animation plays before reset
    setTimeout(() => {
      reset();
      setPhase("form");
    }, 400);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (_data: FormValues) => {
    setPhase("loading");
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1800));
    setPhase("success");
    // Auto-close after success display
    setTimeout(() => handleClose(), 2800);
  };

  // ── Input shared styles ───────────────────────────────────────────────────
  const inputBase =
    "w-full bg-transparent border-b border-white/20 py-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-[#55A53B] caret-[#55A53B]";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[90]"
            style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", backgroundColor: "rgba(0,0,0,0.80)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            onClick={handleClose}
          />

          {/* ── Modal Card ── */}
          <motion.div
            key="modal"
            className="fixed inset-0 z-[91] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="relative w-full max-w-lg overflow-hidden"
              style={{
                background: "rgba(6,8,6,0.92)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "1.25rem",
              }}
              initial={{ y: 60, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 40, scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Noise grain */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04] rounded-[1.25rem]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                  mixBlendMode: "overlay",
                }}
              />

              {/* Subtle green glow at bottom */}
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-48"
                style={{
                  background: "radial-gradient(ellipse at 50% 100%, rgba(85,165,59,0.12) 0%, transparent 70%)",
                }}
              />

              {/* ── Header bar ── */}
              <div className="relative flex items-center justify-between border-b border-white/8 px-7 py-5">
                {/* HUD indicator */}
                <div className="flex items-center gap-2.5">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#55A53B]" />
                  <span
                    className="font-mono text-[10px] tracking-[0.35em] text-white/35 uppercase"
                  >
                    Intake Protocol
                  </span>
                </div>

                {/* Close */}
                <button
                  onClick={handleClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 text-white/40 transition-all hover:border-white/30 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* ── Body ── */}
              <div className="relative px-7 pb-7 pt-8">
                <AnimatePresence mode="wait">
                  {phase !== "success" ? (
                    <motion.div
                      key="form-content"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Headline */}
                      <div className="mb-8">
                        <h2
                          className="text-4xl font-extrabold tracking-tighter text-white sm:text-5xl"
                          style={{ fontFamily: "var(--font-geist), sans-serif" }}
                        >
                          Initiate Service.
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/40">
                          Enter your details for a preliminary assessment.
                        </p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

                        {/* Name */}
                        <Field label="Full Name" error={errors.name?.message}>
                          <input
                            {...register("name", { required: "Name is required" })}
                            placeholder="Jane Smith"
                            className={inputBase}
                            style={{ borderColor: errors.name ? "rgba(248,113,113,0.6)" : undefined }}
                          />
                        </Field>

                        {/* Contact */}
                        <Field label="Email or Phone" error={errors.contact?.message}>
                          <input
                            {...register("contact", { required: "Contact is required" })}
                            placeholder="jane@example.com or 555-0100"
                            className={inputBase}
                            style={{ borderColor: errors.contact ? "rgba(248,113,113,0.6)" : undefined }}
                          />
                        </Field>

                        {/* Service */}
                        <Field label="Service Type" error={errors.service?.message}>
                          <select
                            {...register("service", { required: "Please select a service" })}
                            className={`${inputBase} cursor-pointer appearance-none`}
                            style={{ borderColor: errors.service ? "rgba(248,113,113,0.6)" : undefined }}
                          >
                            <option value="" className="bg-[#0a0a0a] text-white/60">
                              Select a service…
                            </option>
                            <option value="sanctuary-restoration" className="bg-[#0a0a0a] text-white">
                              Sanctuary Restoration
                            </option>
                            <option value="post-construction" className="bg-[#0a0a0a] text-white">
                              Post Construction Cleaning
                            </option>
                            <option value="fumigation-pest-control" className="bg-[#0a0a0a] text-white">
                              Fumigation & Pest Control
                            </option>
                            <option value="residential-office" className="bg-[#0a0a0a] text-white">
                              Residential / Office Cleaning
                            </option>
                            <option value="deep-cleaning" className="bg-[#0a0a0a] text-white">
                              Deep Cleaning
                            </option>
                            <option value="carpet-cleaning" className="bg-[#0a0a0a] text-white">
                              Carpet Cleaning
                            </option>
                            <option value="move-in-out" className="bg-[#0a0a0a] text-white">
                              Move-In / Move-Out
                            </option>
                            <option value="others" className="bg-[#0a0a0a] text-white">
                              Others
                            </option>
                          </select>
                        </Field>

                        {/* Details */}
                        <Field label="Additional Details" error={errors.details?.message}>
                          <textarea
                            {...register("details")}
                            placeholder="Sq footage, special requests, preferred date…"
                            rows={3}
                            className={`${inputBase} resize-none`}
                          />
                        </Field>

                        {/* Submit */}
                        <motion.button
                          type="submit"
                          disabled={phase === "loading"}
                          className="group relative mt-2 w-full overflow-hidden rounded-full border border-white/15 bg-white py-4 text-sm font-semibold text-[#0a0a0a] transition-colors duration-300 hover:border-[#55A53B] hover:bg-[#55A53B] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          whileTap={{ scale: 0.985 }}
                        >
                          {phase === "loading" ? (
                            <span className="flex items-center justify-center gap-3 font-mono text-xs tracking-[0.3em] uppercase">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2.5">
                              <span className="font-mono text-xs tracking-[0.35em] uppercase">Request Access</span>
                              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                          )}
                        </motion.button>

                      </form>
                    </motion.div>
                  ) : (
                    <SuccessState />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

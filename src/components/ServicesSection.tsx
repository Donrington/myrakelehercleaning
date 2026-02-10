"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Home, Star, Droplets, HardHat, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ratingCounterRef = useRef<HTMLDivElement>(null);
  const pathogenCounterRef = useRef<HTMLDivElement>(null);

  const [ratingValue, setRatingValue] = useState(0);
  const [pathogenValue, setPathogenValue] = useState(0);

  useGSAP(
    () => {
      if (!gridRef.current) return;

      const tiles = gridRef.current.querySelectorAll(".service-tile");

      gsap.from(tiles, {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 60,
        opacity: 0,
        scale: 0.95,
        stagger: 0.08,
        duration: 1,
        ease: "power3.out",
      });

      tiles.forEach((tile, index) => {
        const speed = index % 3 === 0 ? -30 : index % 3 === 1 ? -50 : -40;
        gsap.to(tile, {
          scrollTrigger: {
            trigger: tile,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          y: speed,
          ease: "none",
        });
      });

      if (ratingCounterRef.current) {
        gsap.to(
          { value: 0 },
          {
            value: 5.0,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ratingCounterRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            onUpdate: function () {
              setRatingValue(Number(this.targets()[0].value.toFixed(1)));
            },
          }
        );
      }

      if (pathogenCounterRef.current) {
        gsap.to(
          { value: 0 },
          {
            value: 99.9,
            duration: 2.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: pathogenCounterRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            onUpdate: function () {
              setPathogenValue(Number(this.targets()[0].value.toFixed(1)));
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505]"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bath2.png"
          alt=""
          fill
          loading="lazy"
          className="object-cover opacity-35"
          sizes="100vw"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-[#050505]/85 via-[#050505]/75 to-[#050505]/85" />

      {/* Film Grain Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-30 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />

      {/* Aurora Background Lighting */}
      <div className="pointer-events-none absolute inset-0 z-5">
        <div
          className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #55A53B 0%, transparent 70%)",
            filter: "blur(120px)",
            animation: "float 20s infinite ease-in-out",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #2d5c28 0%, transparent 70%)",
            filter: "blur(120px)",
            animation: "float 25s infinite ease-in-out reverse",
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:py-32">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#55A53B]/30 bg-[#55A53B]/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-[#55A53B]" />
            <span className="text-xs font-bold tracking-widest text-[#55A53B] uppercase">
              Services & Expertise
            </span>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight text-[#f2f2f2] md:text-5xl lg:text-6xl">
            Every Space.{" "}
            <span className="text-[#55A53B]">Every Standard.</span>
            <br />
            Spotless.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#a0a0a0]">
            From post-construction dust to stubborn carpet fibres — we handle
            every scale of clean,
            <br className="hidden md:block" />
            backed by eco-certified protocols and obsessive attention to detail.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-6"
        >
          {/* T-01: Hero Tile — Post Construction Cleaning */}
          <div className="service-tile group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0f0f0f]/60 p-8 backdrop-blur-[40px] md:col-span-2 lg:col-span-8 lg:row-span-2 lg:p-12">
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="border-sweep absolute inset-0 rounded-3xl" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#55A53B]/5 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#55A53B]/10 px-3 py-1">
                  <HardHat className="h-4 w-4 text-[#55A53B]" />
                  <span className="text-xs font-semibold tracking-wide text-[#55A53B] uppercase">
                    Flagship Service
                  </span>
                </div>

                <h3 className="mb-4 text-3xl font-bold leading-tight text-[#f2f2f2] lg:text-5xl">
                  Post Construction
                  <br />
                  Cleaning
                </h3>

                <p className="mb-6 max-w-lg text-base leading-relaxed text-[#a0a0a0] lg:text-lg">
                  Remove dust, paint residue, debris, and chemical deposits left
                  by contractors. We transform raw construction into a liveable,
                  breathable space — polished and ready for occupancy.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[#55A53B]/20 bg-[#55A53B]/5 px-4 py-2 text-sm text-[#55A53B]">
                  Debris Removal
                </span>
                <span className="rounded-full border border-[#55A53B]/20 bg-[#55A53B]/5 px-4 py-2 text-sm text-[#55A53B]">
                  Surface Decontamination
                </span>
                <span className="rounded-full border border-[#55A53B]/20 bg-[#55A53B]/5 px-4 py-2 text-sm text-[#55A53B]">
                  Final Inspection Ready
                </span>
              </div>
            </div>
          </div>

          {/* T-02: Fumigation / Pest Control */}
          <div className="service-tile group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0f0f0f]/60 p-6 backdrop-blur-[40px] md:col-span-1 lg:col-span-4">
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="border-sweep absolute inset-0 rounded-3xl" />
            </div>

            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#55A53B]/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#55A53B]/20 group-hover:shadow-[0_0_40px_rgba(85,165,59,0.3)]">
                <Shield className="h-8 w-8 text-[#55A53B]" />
              </div>

              <h4 className="mb-2 text-xl font-bold text-[#f2f2f2]">
                Fumigation &<br />Pest Control
              </h4>

              <p className="text-sm leading-relaxed text-[#a0a0a0]">
                Eco-safe treatments.
                <br />
                Guaranteed pest-free.
              </p>
            </div>
          </div>

          {/* T-03: Residential / Office Cleaning */}
          <div className="service-tile group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0f0f0f]/60 p-6 backdrop-blur-[40px] md:col-span-1 lg:col-span-4">
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="border-sweep absolute inset-0 rounded-3xl" />
            </div>

            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#55A53B]/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#55A53B]/20 group-hover:shadow-[0_0_40px_rgba(85,165,59,0.3)]">
                <Home className="h-8 w-8 text-[#55A53B]" />
              </div>

              <h4 className="mb-2 text-5xl font-extrabold tracking-tighter text-[#f2f2f2] transition-all duration-500 group-hover:text-[#55A53B]">
                Homes
              </h4>

              <p className="text-sm leading-relaxed text-[#a0a0a0]">
                Residential & office.
                <br />
                Flexible scheduling.
              </p>
            </div>
          </div>

          {/* T-04: Deep Cleaning */}
          <div className="service-tile group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0f0f0f]/60 p-8 backdrop-blur-[40px] md:col-span-2 lg:col-span-6">
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="border-sweep absolute inset-0 rounded-3xl" />
            </div>

            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
                <Droplets className="h-4 w-4 text-[#55A53B]" />
                <span className="text-xs font-semibold tracking-wide text-white/60 uppercase">
                  Full-Room Protocol
                </span>
              </div>

              <h3 className="mb-3 text-2xl font-bold text-[#f2f2f2] lg:text-3xl">
                Deep Cleaning
              </h3>

              <p className="mb-4 text-sm leading-relaxed text-[#a0a0a0]">
                Surface-to-surface purification of every room. Tiles, grout
                lines, appliances, and fixtures treated with eco-certified
                products to eliminate bacteria, grime, and allergens at the
                root.
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-[#55A53B]">
                <span>Tile & Grout</span>
                <span className="text-white/20">•</span>
                <span>Appliances</span>
                <span className="text-white/20">•</span>
                <span>Allergen Removal</span>
              </div>
            </div>
          </div>

          {/* T-05: Data Tile — 5.0 Stars */}
          <div className="service-tile group relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#55A53B]/10 to-[#2d5c28]/10 p-6 backdrop-blur-[40px] md:col-span-1 lg:col-span-3">
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="border-sweep absolute inset-0 rounded-3xl" />
            </div>

            <div
              ref={ratingCounterRef}
              className="relative z-10 flex h-full flex-col items-center justify-center text-center"
            >
              <Star className="mb-3 h-10 w-10 fill-[#55A53B] text-[#55A53B]" />
              <div className="mb-1 text-5xl font-extrabold text-[#f2f2f2]">
                {ratingValue.toFixed(1)}
              </div>
              <p className="mb-2 text-xs font-semibold tracking-wider text-[#55A53B] uppercase">
                Perfect Rating
              </p>
              <p className="text-xs text-[#a0a0a0]">
                500+ Google Reviews
              </p>
            </div>
          </div>

          {/* T-06: Data Tile — 99.9% Pathogen Free */}
          <div className="service-tile group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0f0f0f]/60 p-6 backdrop-blur-[40px] md:col-span-1 lg:col-span-3">
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="border-sweep absolute inset-0 rounded-3xl" />
            </div>

            <div
              ref={pathogenCounterRef}
              className="relative z-10 flex h-full flex-col items-center justify-center text-center"
            >
              <div className="mb-1 text-5xl font-extrabold text-[#f2f2f2]">
                {pathogenValue.toFixed(1)}%
              </div>
              <p className="mb-2 text-xs font-semibold tracking-wider text-[#55A53B] uppercase">
                Pathogen Free
              </p>
              <p className="text-xs text-[#a0a0a0]">
                Certified Lab-Tested Results
              </p>
            </div>
          </div>

          {/* T-07: Action Tile */}
          <div className="service-tile group relative overflow-hidden rounded-3xl bg-[#55A53B] p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(85,165,59,0.4)] md:col-span-2 lg:col-span-12">
            <div className="relative z-10 flex flex-col items-center justify-center text-center md:flex-row md:justify-between md:text-left">
              <div>
                <h3 className="mb-2 text-2xl font-bold text-[#050505] lg:text-3xl">
                  Ready to Transform Your Space?
                </h3>
                <p className="text-sm text-[#050505]/70 lg:text-base">
                  Book your consultation now. White-glove service begins in 24 hours.
                </p>
              </div>

              <a href="#book" className="group/btn mt-6 inline-flex items-center gap-3 rounded-full bg-[#050505] px-8 py-4 text-base font-semibold text-[#55A53B] transition-all duration-300 hover:gap-5 hover:bg-[#0f0f0f] md:mt-0">
                Initiate Service
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                  →
                </span>
              </a>
            </div>

            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          </div>
        </div>

        {/* Additional Services Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
          {/* Carpet Cleaning */}
          <div className="service-tile group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0f0f0f]/60 p-6 backdrop-blur-[40px]">
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="border-sweep absolute inset-0 rounded-3xl" />
            </div>

            <div className="relative z-10">
              <h4 className="mb-2 text-lg font-bold text-[#f2f2f2]">
                Carpet Cleaning
              </h4>
              <p className="mb-3 text-sm leading-relaxed text-[#a0a0a0]">
                Hot-water extraction and dry-foam treatment restore fibres to factory-fresh condition — stains, odours, and allergens eliminated.
              </p>
              <span className="text-xs text-[#55A53B]">Stain & Odour Removal</span>
            </div>
          </div>

          {/* Residential / Office Cleaning */}
          <div className="service-tile group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0f0f0f]/60 p-6 backdrop-blur-[40px]">
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="border-sweep absolute inset-0 rounded-3xl" />
            </div>

            <div className="relative z-10">
              <h4 className="mb-2 text-lg font-bold text-[#f2f2f2]">
                Residential & Office Cleaning
              </h4>
              <p className="mb-3 text-sm leading-relaxed text-[#a0a0a0]">
                Routine or one-time cleans for homes, condos, and workspaces. Maintained to a standard your guests and colleagues will notice.
              </p>
              <span className="text-xs text-[#55A53B]">Recurring Service</span>
            </div>
          </div>

          {/* Move-In / Move-Out */}
          <div className="service-tile group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0f0f0f]/60 p-6 backdrop-blur-[40px]">
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="border-sweep absolute inset-0 rounded-3xl" />
            </div>

            <div className="relative z-10">
              <h4 className="mb-2 text-lg font-bold text-[#f2f2f2]">
                Move-In / Move-Out
              </h4>
              <p className="mb-3 text-sm leading-relaxed text-[#a0a0a0]">
                Full top-to-bottom reset between tenancies. Leave the old space spotless and enter the new one with zero trace of the previous occupant.
              </p>
              <span className="text-xs text-[#55A53B]">Tenancy Turnover</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes borderSweep {
          0% {
            background: conic-gradient(
              from 0deg at 50% 50%,
              transparent 0deg,
              transparent 90deg,
              rgba(85, 165, 59, 0.5) 90deg,
              rgba(85, 165, 59, 0.8) 180deg,
              transparent 180deg,
              transparent 360deg
            );
          }
          100% {
            background: conic-gradient(
              from 360deg at 50% 50%,
              transparent 0deg,
              transparent 90deg,
              rgba(85, 165, 59, 0.5) 90deg,
              rgba(85, 165, 59, 0.8) 180deg,
              transparent 180deg,
              transparent 360deg
            );
          }
        }

        .border-sweep {
          animation: borderSweep 3s linear infinite;
          mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
          mask-composite: exclude;
          padding: 2px;
        }
      `}</style>
    </section>
  );
}

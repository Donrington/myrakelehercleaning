"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

export default function ScrollRevealText({
  text,
  className = "",
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Split text into individual characters
    const chars = text.split("");

    // Create span for each character
    containerRef.current.innerHTML = chars
      .map((char) => {
        const isSpace = char === " ";
        return `<span class="reveal-char" style="display: inline-block; color: #d1d5db;">${
          isSpace ? "&nbsp;" : char
        }</span>`;
      })
      .join("");

    // Animate characters with GSAP
    const charElements = containerRef.current.querySelectorAll(".reveal-char");

    gsap.fromTo(
      charElements,
      {
        color: "#d1d5db", // Light gray (faded)
      },
      {
        color: "#121212", // Black (revealed)
        stagger: 0.02,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, [text]);

  return <span ref={containerRef} className={className} />;
}

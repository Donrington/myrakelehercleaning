"use client";

import { useEffect, useState, useRef } from "react";

interface TextSwitcherProps {
  phrases: Array<{ first: string; second: string }>;
}

export default function TextSwitcher({ phrases }: TextSwitcherProps) {
  const [displayFirstWord, setDisplayFirstWord] = useState("");
  const [displaySecondWord, setDisplaySecondWord] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const selectRef = useRef(0);
  const fullTextFirstRef = useRef<string[]>([]);
  const fullTextSecondRef = useRef<string[]>([]);
  const selectTextFirstRef = useRef<string[]>([]);
  const selectTextSecondRef = useRef<string[]>([]);
  const correctRef = useRef(0);
  const latchRef = useRef(true);

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz \u00A0";

  useEffect(() => {
    // Find max length for each word position
    const maxFirstLength = Math.max(...phrases.map((p) => p.first.length));
    const maxSecondLength = Math.max(...phrases.map((p) => p.second.length));

    // Pad phrases to consistent length
    const paddedPhrases = phrases.map((p) => ({
      first: p.first.padEnd(maxFirstLength, "\u00A0"), // Use non-breaking space
      second: p.second.padEnd(maxSecondLength, "\u00A0"),
    }));

    // Initialize fulltext with non-breaking spaces
    fullTextFirstRef.current = Array(maxFirstLength).fill("\u00A0");
    fullTextSecondRef.current = Array(maxSecondLength).fill("\u00A0");

    // Load first phrase
    loadText(paddedPhrases, maxFirstLength, maxSecondLength);

    // Start flickering
    const interval = setInterval(
      () => flicker(paddedPhrases, maxFirstLength, maxSecondLength),
      35
    );

    return () => clearInterval(interval);
  }, [phrases]);

  const loadText = (
    paddedPhrases: Array<{ first: string; second: string }>,
    maxFirstLength: number,
    maxSecondLength: number
  ) => {
    const currentPhrase = paddedPhrases[selectRef.current];
    selectTextFirstRef.current = currentPhrase.first.split("");
    selectTextSecondRef.current = currentPhrase.second.split("");
    latchRef.current = true;
    setIsTransitioning(true);
  };

  const flicker = (
    paddedPhrases: Array<{ first: string; second: string }>,
    maxFirstLength: number,
    maxSecondLength: number
  ) => {
    correctRef.current = 0;

    // Cycle through characters for first word
    for (let i = 0; i < maxFirstLength; i++) {
      if (selectTextFirstRef.current[i] !== fullTextFirstRef.current[i]) {
        const currentChar = fullTextFirstRef.current[i];
        const currentIndex = chars.indexOf(currentChar);

        if (currentIndex === -1 || currentIndex === chars.length - 1) {
          fullTextFirstRef.current[i] = chars[0];
        } else {
          fullTextFirstRef.current[i] = chars[currentIndex + 1];
        }
        correctRef.current++;
      }
    }

    // Cycle through characters for second word
    for (let i = 0; i < maxSecondLength; i++) {
      if (selectTextSecondRef.current[i] !== fullTextSecondRef.current[i]) {
        const currentChar = fullTextSecondRef.current[i];
        const currentIndex = chars.indexOf(currentChar);

        if (currentIndex === -1 || currentIndex === chars.length - 1) {
          fullTextSecondRef.current[i] = chars[0];
        } else {
          fullTextSecondRef.current[i] = chars[currentIndex + 1];
        }
        correctRef.current++;
      }
    }

    // Update display text
    if (latchRef.current) {
      setDisplayFirstWord(fullTextFirstRef.current.join(""));
      setDisplaySecondWord(fullTextSecondRef.current.join(""));
    }

    // Check if all characters match
    if (correctRef.current === 0 && latchRef.current) {
      latchRef.current = false;
      setIsTransitioning(false);

      // Move to next phrase
      if (selectRef.current >= paddedPhrases.length - 1) {
        selectRef.current = 0;
      } else {
        selectRef.current++;
      }

      // Load next phrase after pause
      setTimeout(
        () => loadText(paddedPhrases, maxFirstLength, maxSecondLength),
        2500
      );
    }
  };

  return (
    <span className="inline-block" style={{ minWidth: "300px" }}>
      <span
        className="inline-block transition-all duration-500 ease-out"
        style={{
          filter: isTransitioning ? "blur(6px)" : "blur(0px)",
          opacity: isTransitioning ? 0.1 : 1,
        }}
      >
        <span
          className="text-[#55A53B]"
          style={{
            textShadow: isTransitioning
              ? "0 0 12px rgba(85, 165, 59, 0.4)"
              : "0 0 0px rgba(85, 165, 59, 0)",
          }}
        >
          {displayFirstWord}
        </span>{" "}
        <span className="text-white">{displaySecondWord}</span>
      </span>
    </span>
  );
}

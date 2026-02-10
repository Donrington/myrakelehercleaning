"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const locations = ["Naples", "Orlando", "Miami", "Tampa"];

export default function SocialProof() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" as const }}
      className="border-t border-white/10 bg-black px-6 py-6"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <span className="text-sm font-medium tracking-wide text-white/40 uppercase">
          Trusted by homeowners in
        </span>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {locations.map((city) => (
            <div key={city} className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-white/30" />
              <span className="text-sm font-semibold tracking-wide text-white/40">
                {city}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

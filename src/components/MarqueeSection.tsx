"use client";

export default function MarqueeSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-[#0A0A0A] to-black py-12">
      {/* Marquee Container */}
      <div className="marquee-container relative h-[120px] flex items-center overflow-hidden md:h-[160px]">
        {/* Blurred Layer */}
        <div
          className="absolute inset-0 flex items-center"
          style={{
            backgroundImage:
              "linear-gradient(to right, #000 0%, transparent 5%, transparent 95%, #000 100%)",
            filter: "contrast(15)",
          }}
          aria-hidden="true"
        >
          <p
            className="marquee-text whitespace-nowrap text-6xl font-extrabold uppercase tracking-tighter text-white md:text-8xl"
            style={{
              filter: "blur(3px)",
            }}
          >
            Premium Cleaning Excellence • Eco-Friendly Solutions • White-Glove Service •
            Premium Cleaning Excellence • Eco-Friendly Solutions • White-Glove Service •
            Premium Cleaning Excellence • Eco-Friendly Solutions • White-Glove Service •
          </p>
        </div>

        {/* Clear Layer on Top */}
        <div className="absolute inset-0 flex items-center">
          <p className="marquee-text whitespace-nowrap text-6xl font-extrabold uppercase tracking-tighter text-white md:text-8xl">
            <span className="text-white">Premium Cleaning Excellence</span>
            <span className="text-[#55A53B]"> • </span>
            <span className="text-white">Eco-Friendly Solutions</span>
            <span className="text-[#55A53B]"> • </span>
            <span className="text-white">White-Glove Service</span>
            <span className="text-[#55A53B]"> • </span>
            <span className="text-white">Premium Cleaning Excellence</span>
            <span className="text-[#55A53B]"> • </span>
            <span className="text-white">Eco-Friendly Solutions</span>
            <span className="text-[#55A53B]"> • </span>
            <span className="text-white">White-Glove Service</span>
            <span className="text-[#55A53B]"> • </span>
            <span className="text-white">Premium Cleaning Excellence</span>
            <span className="text-[#55A53B]"> • </span>
            <span className="text-white">Eco-Friendly Solutions</span>
            <span className="text-[#55A53B]"> • </span>
            <span className="text-white">White-Glove Service</span>
            <span className="text-[#55A53B]"> • </span>
          </p>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .marquee-text {
          animation: marquee 40s linear infinite;
          will-change: transform;
        }

        /* Pause animation on hover */
        .marquee-container:hover .marquee-text {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const floaters = ["🧘‍♀️", "🌸", "⭐", "🦋", "🌈", "💫", "🌺", "🎯", "🌟"];

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #FAF0FF 0%, #FFF5F0 40%, #FFF9F0 70%, #F0FFF8 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--magenta), transparent 70%)" }}
      />
      <div
        className="absolute bottom-10 left-0 w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--orange), transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 left-10 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--purple), transparent 70%)" }}
      />

      {/* Floating emojis */}
      {floaters.map((e, i) => (
        <div
          key={i}
          className={`absolute text-2xl select-none pointer-events-none opacity-25 ${
            i % 3 === 0 ? "float" : i % 3 === 1 ? "float-delay" : "float-delay-2"
          }`}
          style={{ left: `${6 + (i * 10) % 82}%`, top: `${8 + (i * 12) % 72}%` }}
        >
          {e}
        </div>
      ))}

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Image
          src="https://www.sakthiyogalaya.com/images/WebLogo.png"
          alt="Sakthi Yogalaya"
          width={220}
          height={58}
          className="h-14 w-auto object-contain mx-auto pointer-events-none"
          unoptimized
          priority
        />
      </motion.div>

      {/* Season badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <span
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold tracking-wide"
          style={{ background: "var(--orange)", color: "white" }}
        >
          🏆 Season 6 Starts June 1st — Enroll Now!
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="font-fredoka text-5xl sm:text-6xl md:text-7xl leading-tight mb-6"
        style={{ color: "var(--purple-dark)" }}
      >
        Kids Yoga
        <br />
        <span
          className="font-dancing"
          style={{
            background: "linear-gradient(135deg, var(--magenta), var(--orange))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Summer Workshop!
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="text-lg sm:text-xl font-bold mb-4"
        style={{ color: "var(--purple)" }}
      >
        Online · Live · Fun-Filled · Ages 5–15
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-base text-gray-500 mb-12 max-w-lg font-medium"
      >
        Give your child a summer of strength, flexibility & mindfulness —
        all from the comfort of home, live on Zoom!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.38 }}
        className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16"
      >
        <a href="#enroll" className="cta-btn inline-flex items-center justify-center text-white font-extrabold px-14 py-6 rounded-full text-xl whitespace-nowrap">
          🎉 Enroll My Child!
        </a>
        <a
          href="#pricing"
          className="inline-flex items-center justify-center font-bold px-12 py-6 rounded-full text-lg border-2 transition-all hover:bg-purple-50 whitespace-nowrap"
          style={{ borderColor: "var(--purple)", color: "var(--purple)" }}
        >
          See Plans &amp; Pricing
        </a>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        {[
          { icon: "👧", label: "Ages 5–15", sub: "All levels welcome" },
          { icon: "📅", label: "Mon–Sat", sub: "Live sessions" },
          { icon: "💻", label: "100% Online", sub: "Zoom classes" },
          { icon: "🏆", label: "Season 6", sub: "5 years strong" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 text-center shadow-sm border border-purple-100"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-extrabold text-sm" style={{ color: "var(--purple-dark)" }}>{s.label}</div>
            <div className="text-xs text-gray-400 font-medium">{s.sub}</div>
          </div>
        ))}
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-2xl opacity-40"
      >
        ↓
      </motion.div>
    </section>
  );
}

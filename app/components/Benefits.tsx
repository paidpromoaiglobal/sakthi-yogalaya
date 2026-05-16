"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const benefits = [
  { icon: "🧘", title: "Mindfulness & Focus", desc: "Breathing techniques that improve concentration and reduce school stress.", color: "var(--purple)" },
  { icon: "💪", title: "Strength & Flexibility", desc: "Fun poses build core strength, coordination, and body awareness in growing kids.", color: "var(--orange)" },
  { icon: "😌", title: "Calm & Confidence", desc: "Yoga builds self-esteem and helps children manage emotions with grace.", color: "var(--magenta)" },
  { icon: "🌙", title: "Better Sleep", desc: "Relaxation practices help kids wind down and enjoy deeper, restful sleep.", color: "var(--purple)" },
  { icon: "🤸", title: "Playful Movement", desc: "Animal poses and games make every session exciting — they won't want to stop!", color: "var(--orange)" },
  { icon: "👨‍👩‍👧", title: "Family Bonding", desc: "Parents can join in! Our inclusive approach brings families together.", color: "var(--magenta)" },
];

export default function Benefits() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 px-6" style={{ background: "linear-gradient(180deg, #FFF9F5 0%, #FAF0FF 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-extrabold tracking-widest uppercase mb-3" style={{ color: "var(--orange)" }}>
            Why Yoga for Kids?
          </p>
          <h2 className="font-fredoka text-4xl sm:text-5xl mb-3" style={{ color: "var(--purple-dark)" }}>
            The Magic of Yoga <span className="float inline-block">🌈</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg font-medium">
            It's not just exercise — it's a superpower for life!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1.5 border border-purple-50 group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${b.color}15` }}
              >
                {b.icon}
              </div>
              <h3 className="font-extrabold text-base mb-2" style={{ color: b.color }}>{b.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

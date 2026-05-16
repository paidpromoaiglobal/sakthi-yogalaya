"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const timings = ["9:00 AM ET", "10:00 AM ET", "11:00 AM ET", "12:00 Noon ET", "7:00 PM ET"];

const details = [
  { icon: "🚀", label: "Course Starts", value: "June 1, 2026" },
  { icon: "📅", label: "Schedule", value: "Monday – Friday" },
  { icon: "⏱️", label: "Duration", value: "45 min / session" },
  { icon: "🎯", label: "Age Group", value: "5 – 15 years" },
  { icon: "💻", label: "Platform", value: "Live on Zoom" },
  { icon: "🌍", label: "Location", value: "100% Online" },
  { icon: "🗣️", label: "Language", value: "English & Tamil" },
];

export default function WorkshopDetails() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-extrabold tracking-widest uppercase mb-3" style={{ color: "var(--magenta)" }}>
            Program Info
          </p>
          <h2 className="font-fredoka text-4xl sm:text-5xl mb-3" style={{ color: "var(--purple-dark)" }}>
            Workshop Details <span className="bounce-slow inline-block">📋</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {details.map((d) => (
              <div
                key={d.label}
                className="rounded-2xl p-5 text-center border-2 hover:border-purple-300 transition-colors"
                style={{ borderColor: "#EDD9FF", background: "#FAF5FF" }}
              >
                <div className="text-3xl mb-1.5">{d.icon}</div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest mb-1" style={{ color: "var(--magenta)" }}>{d.label}</div>
                <div className="font-extrabold text-sm" style={{ color: "var(--purple-dark)" }}>{d.value}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Timings card */}
            <div
              className="rounded-3xl p-7"
              style={{ background: "linear-gradient(135deg, var(--purple-dark) 0%, var(--purple-light) 100%)" }}
            >
              <h3 className="font-fredoka text-2xl text-white mb-1">Choose Your Timing ⏰</h3>
              <p className="text-purple-300 text-sm mb-5 font-medium">Pick the slot that works best for your child (Eastern Time)</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timings.map((t) => (
                  <div
                    key={t}
                    className="bg-white/15 backdrop-blur-sm rounded-2xl p-3.5 text-center text-white font-bold text-sm border border-white/20 hover:bg-white/25 transition-colors cursor-default"
                  >
                    {t}
                  </div>
                ))}
              </div>
              <p className="text-purple-300 text-xs mt-4 text-center font-medium">✦ Timing confirmed during enrollment</p>
            </div>

            {/* Included */}
            <div
              className="rounded-3xl p-6 border-2"
              style={{ background: "#FFFBEB", borderColor: "#FCD34D" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">🎁</span>
                <div>
                  <div className="font-extrabold text-base mb-2" style={{ color: "var(--purple-dark)" }}>What's Included</div>
                  <ul className="space-y-1.5">
                    {[
                      "Live interactive Zoom sessions",
                      "Digital certificate of completion",
                      "Fun yoga activity worksheets",
                      "WhatsApp parent updates group",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0"
                          style={{ background: "var(--orange)" }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

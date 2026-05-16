"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const plans = [
  {
    id: "1month",
    duration: "1 Month",
    price: 60,
    sessions: "~24 Sessions",
    emoji: "🌱",
    gradient: "linear-gradient(135deg, #5E1F8A 0%, #8B35C1 100%)",
    glow: "rgba(94,31,138,0.3)",
    features: ["Live Zoom classes Mon–Fri", "Choose your timing slot", "Digital certificate", "WhatsApp parent group"],
    badge: null,
  },
  {
    id: "2months",
    duration: "2 Months",
    price: 110,
    sessions: "~48 Sessions",
    emoji: "🌟",
    gradient: "linear-gradient(135deg, #C41E8C 0%, #F97316 100%)",
    glow: "rgba(196,30,140,0.35)",
    features: ["Live Zoom classes Mon–Fri", "Choose your timing slot", "Digital certificate", "WhatsApp parent group", "Save $10 vs monthly!"],
    badge: "Best Value 🏆",
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="py-20 px-6" style={{ background: "linear-gradient(160deg, #FAF0FF 0%, #FFF5F0 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-extrabold tracking-widest uppercase mb-3" style={{ color: "var(--orange)" }}>
            Flexible Plans
          </p>
          <h2 className="font-fredoka text-4xl sm:text-5xl mb-3" style={{ color: "var(--purple-dark)" }}>
            Choose Your Plan <span className="spin-slow inline-block">💫</span>
          </h2>
          <p className="text-gray-500 text-lg font-medium max-w-sm mx-auto">
            Pick the plan that fits your summer schedule
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative rounded-3xl overflow-hidden"
              style={{ boxShadow: `0 20px 60px ${plan.glow}` }}
            >
              {/* Gradient header */}
              <div className="p-7 text-white text-center" style={{ background: plan.gradient }}>
                {plan.badge && (
                  <span className="inline-block bg-white/25 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1 rounded-full mb-3 tracking-wide">
                    {plan.badge}
                  </span>
                )}
                <div className="text-5xl mb-2">{plan.emoji}</div>
                <h3 className="font-fredoka text-3xl mb-1">{plan.duration}</h3>
                <p className="text-white/70 text-sm font-semibold">{plan.sessions}</p>
              </div>

              {/* White body */}
              <div className="bg-white p-7">
                <div className="text-center mb-6">
                  {(() => {
                    const fee = +((plan.price + 0.30) / (1 - 0.029) - plan.price).toFixed(2);
                    return (
                      <>
                        <span className="text-2xl font-semibold text-gray-400">${plan.price}</span>
                        <span className="text-gray-400 text-sm ml-1 font-medium">/ plan</span>
                        <div className="text-xs text-gray-400 mt-1">+ ${fee} processing fee</div>
                      </>
                    );
                  })()}
                </div>

                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600 font-semibold">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0"
                        style={{ background: plan.gradient }}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#enroll"
                  className="block w-full py-4 px-4 rounded-2xl font-extrabold text-sm text-center text-white transition-all hover:-translate-y-0.5 leading-snug"
                  style={{ background: plan.gradient, boxShadow: `0 8px 24px ${plan.glow}` }}
                >
                  Select This Plan →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

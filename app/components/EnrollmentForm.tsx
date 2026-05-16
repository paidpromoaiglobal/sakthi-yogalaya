"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

const timings = ["9:00 AM ET", "10:00 AM ET", "11:00 AM ET", "12:00 Noon ET", "7:00 PM ET"];

interface FormData {
  plan: string;
  kidsName: string;
  dob: string;
  grade: string;
  parentsName: string;
  whatsapp: string;
  email: string;
  address: string;
  experience: string;
  timing: string;
}

const STEPS = ["Plan", "Child", "Parent", "Timing"];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

// Payload sent to /api/enrollment at each step transition
function buildStepPayload(step: number, enrollmentId: string, form: FormData) {
  const base = { enrollment_id: enrollmentId, step };
  if (step === 0) return { ...base, plan: form.plan };
  if (step === 1) return { ...base, kidsName: form.kidsName, dob: form.dob, grade: form.grade, experience: form.experience };
  if (step === 2) return { ...base, parentsName: form.parentsName, whatsapp: form.whatsapp, email: form.email, address: form.address };
  return base;
}

export default function EnrollmentForm() {
  const enrollmentId = useRef<string>(
    typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2)
  );

  const [step, setStep]       = useState(0);
  const [dir, setDir]         = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState<FormData>({
    plan: "", kidsName: "", dob: "", grade: "",
    parentsName: "", whatsapp: "", email: "",
    address: "", experience: "", timing: "",
  });

  const set = (k: keyof FormData, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const saveStep = async (currentStep: number) => {
    try {
      await fetch("/api/enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildStepPayload(currentStep, enrollmentId.current, form)),
      });
    } catch {
      // Non-fatal — user can still proceed
    }
  };

  const next = async () => {
    await saveStep(step);
    setDir(1);
    setStep((s) => s + 1);
  };

  const back = () => { setDir(-1); setStep((s) => s - 1); };

  const canProceed = () => {
    if (step === 0) return !!form.plan;
    if (step === 1) return !!(form.kidsName && form.dob && form.grade);
    if (step === 2) return !!(form.parentsName && form.whatsapp && form.email && form.address);
    if (step === 3) return !!form.timing;
    return false;
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, enrollment_id: enrollmentId.current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment error. Please try again.");
      setLoading(false);
    }
  };

  const basePrice  = form.plan === "2months" ? 110 : 60;
  const planLabel  = form.plan === "2months" ? "2 Months" : "1 Month";
  const stripeFee  = form.plan ? +((basePrice + 0.30) / (1 - 0.029) - basePrice).toFixed(2) : 0;
  const totalPrice = form.plan ? +(basePrice + stripeFee).toFixed(2) : 0;

  const navBtn = "inline-flex items-center justify-center rounded-2xl font-extrabold text-lg whitespace-nowrap transition-all";

  return (
    <section
      id="enroll"
      className="py-24 px-6"
      style={{ background: "linear-gradient(160deg, #FAF5FF 0%, #FFF5F0 100%)" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-extrabold tracking-widest uppercase mb-3" style={{ color: "var(--magenta)" }}>
            Secure Enrollment
          </p>
          <h2 className="font-fredoka text-4xl sm:text-5xl mb-3" style={{ color: "var(--purple-dark)" }}>
            Enroll Your Child! <span className="wiggle inline-block">🎉</span>
          </h2>
          <p className="text-gray-500 font-medium text-base">4 quick steps to secure your child&apos;s spot</p>
        </div>

        {/* Progress stepper */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-base transition-all duration-300 ${
                    i < step
                      ? "text-white"
                      : i === step
                      ? "text-white scale-110 shadow-lg"
                      : "bg-white text-gray-300 border-2 border-gray-200"
                  }`}
                  style={i <= step ? { background: "linear-gradient(135deg, var(--magenta), var(--orange))" } : {}}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span
                  className="text-xs mt-1.5 font-bold"
                  style={i === step ? { color: "var(--magenta)" } : { color: i < step ? "#9CA3AF" : "#D1D5DB" }}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="w-14 h-0.5 mb-6 mx-1 transition-all duration-500"
                  style={{ background: i < step ? "var(--magenta)" : "#E5E7EB" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-3xl overflow-hidden border border-purple-100"
          style={{ boxShadow: "0 25px 60px rgba(94,31,138,0.12)" }}
        >
          {/* Top accent bar */}
          <div className="h-2 w-full" style={{ background: "linear-gradient(90deg, var(--purple), var(--magenta), var(--orange))" }} />

          <div className="p-10 sm:p-12">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >

                {/* STEP 0: Plan */}
                {step === 0 && (
                  <div>
                    <h3 className="font-fredoka text-3xl" style={{ color: "var(--purple-dark)", marginBottom: "8px" }}>Choose Your Plan 💳</h3>
                    <p className="text-gray-400 font-medium" style={{ marginBottom: "40px" }}>Select how long your child will join the workshop</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "32px", marginBottom: "56px" }}>
                      {[
                        { id: "1month",  label: "1 Month",  base: 60,  sessions: "~24 sessions", emoji: "🌱", save: null },
                        { id: "2months", label: "2 Months", base: 110, sessions: "~48 sessions", emoji: "🌟", save: "Save $10!" },
                      ].map((p) => {
                        const fee   = +((p.base + 0.30) / (1 - 0.029) - p.base).toFixed(2);
                        return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => set("plan", p.id)}
                          className={`relative p-7 rounded-2xl border-2 text-left transition-all duration-200 ${form.plan === p.id ? "scale-[1.02]" : "hover:border-purple-200"}`}
                          style={
                            form.plan === p.id
                              ? { borderColor: "var(--magenta)", background: "#FFF0FB", boxShadow: "0 8px 30px rgba(196,30,140,0.15)" }
                              : { borderColor: "#EDD9FF", background: "#FAFAFA" }
                          }
                        >
                          {p.save && (
                            <span className="absolute -top-3 right-4 text-xs font-extrabold px-3 py-1 rounded-full text-white" style={{ background: "var(--orange)" }}>
                              {p.save}
                            </span>
                          )}
                          <div className="text-4xl mb-3">{p.emoji}</div>
                          <div className="font-extrabold text-xl mb-1" style={{ color: "var(--purple-dark)" }}>{p.label}</div>
                          <div className="text-sm text-gray-400 font-semibold mb-3">{p.sessions}</div>
                          <div className="font-fredoka text-4xl mb-1" style={{ color: form.plan === p.id ? "var(--magenta)" : "var(--purple)" }}>
                            ${p.base}
                          </div>
                          <div className="text-xs text-gray-400 font-medium">+ ${fee} processing fee</div>
                          {form.plan === p.id && (
                            <div className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm" style={{ background: "var(--magenta)" }}>✓</div>
                          )}
                        </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 1: Child */}
                {step === 1 && (
                  <div>
                    <h3 className="font-fredoka text-3xl" style={{ color: "var(--purple-dark)", marginBottom: "8px" }}>About Your Child 👧</h3>
                    <p className="text-gray-400 font-medium" style={{ marginBottom: "40px" }}>Tell us about the young yogi!</p>
                    <div className="input-group" style={{ marginBottom: "32px" }}>
                      <input type="text" placeholder=" " value={form.kidsName} onChange={(e) => set("kidsName", e.target.value)} required />
                      <label>Kid&apos;s Full Name *</label>
                    </div>
                    <div className="grid sm:grid-cols-2" style={{ gap: "32px", marginBottom: "32px" }}>
                      <div className="input-group">
                        <input type="date" placeholder=" " value={form.dob} onChange={(e) => set("dob", e.target.value)} required />
                        <label>Date of Birth *</label>
                      </div>
                      <div className="input-group">
                        <input type="text" placeholder=" " value={form.grade} onChange={(e) => set("grade", e.target.value)} required />
                        <label>Grade / Class *</label>
                      </div>
                    </div>
                    <div className="input-group" style={{ marginBottom: "56px" }}>
                      <select value={form.experience} onChange={(e) => set("experience", e.target.value)}>
                        <option value="">Select experience level</option>
                        <option value="none">No experience — complete beginner</option>
                        <option value="some">Some experience (tried a few classes)</option>
                        <option value="regular">Regular practitioner</option>
                      </select>
                      <label>Previous Yoga Experience</label>
                    </div>
                  </div>
                )}

                {/* STEP 2: Parent */}
                {step === 2 && (
                  <div>
                    <h3 className="font-fredoka text-3xl" style={{ color: "var(--purple-dark)", marginBottom: "8px" }}>Parent / Guardian 👨‍👩‍👧</h3>
                    <p className="text-gray-400 font-medium" style={{ marginBottom: "40px" }}>How do we reach you?</p>
                    <div className="input-group" style={{ marginBottom: "32px" }}>
                      <input type="text" placeholder=" " value={form.parentsName} onChange={(e) => set("parentsName", e.target.value)} required />
                      <label>Parent&apos;s Full Name *</label>
                    </div>
                    <div className="grid sm:grid-cols-2" style={{ gap: "32px", marginBottom: "32px" }}>
                      <div className="input-group">
                        <input type="tel" placeholder=" " value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} required />
                        <label>WhatsApp Number *</label>
                      </div>
                      <div className="input-group">
                        <input type="email" placeholder=" " value={form.email} onChange={(e) => set("email", e.target.value)} required />
                        <label>Email Address *</label>
                      </div>
                    </div>
                    <div className="input-group" style={{ marginBottom: "56px" }}>
                      <textarea rows={3} placeholder=" " value={form.address} onChange={(e) => set("address", e.target.value)} required style={{ paddingTop: "26px", minHeight: "100px" }} />
                      <label>Home Address *</label>
                    </div>
                  </div>
                )}

                {/* STEP 3: Timing */}
                {step === 3 && (
                  <div>
                    <h3 className="font-fredoka text-3xl" style={{ color: "var(--purple-dark)", marginBottom: "8px" }}>Pick Your Timing ⏰</h3>
                    <p className="text-gray-400 font-medium" style={{ marginBottom: "40px" }}>Choose a class slot (Eastern Time)</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: "24px", marginBottom: "40px" }}>
                      {timings.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => set("timing", t)}
                          className={`py-6 px-4 rounded-2xl font-extrabold text-base border-2 transition-all duration-200 ${form.timing === t ? "scale-[1.03]" : "hover:border-purple-200"}`}
                          style={
                            form.timing === t
                              ? { background: "linear-gradient(135deg, var(--purple), var(--magenta))", color: "white", borderColor: "transparent", boxShadow: "0 6px 20px rgba(196,30,140,0.3)" }
                              : { borderColor: "#EDD9FF", color: "var(--purple)", background: "white" }
                          }
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="rounded-2xl p-6 border-2" style={{ background: "#FAF5FF", borderColor: "#EDD9FF" }}>
                      <p className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: "var(--magenta)" }}>Enrollment Summary</p>
                      <div className="space-y-3 text-sm font-semibold text-gray-600">
                        <div className="flex justify-between"><span>Child</span><span className="text-purple-800 font-extrabold">{form.kidsName || "—"}</span></div>
                        <div className="flex justify-between"><span>Grade</span><span className="text-purple-800 font-extrabold">{form.grade || "—"}</span></div>
                        <div className="flex justify-between"><span>Plan</span><span className="text-purple-800 font-extrabold">{planLabel}</span></div>
                        <div className="flex justify-between"><span>Timing</span><span className="text-purple-800 font-extrabold">{form.timing || "Not selected"}</span></div>
                        <div className="h-px bg-purple-100 my-1" />
                        <div className="flex justify-between"><span>Program Fee</span><span className="font-extrabold">${form.plan ? basePrice : "—"}</span></div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Payment Processing Fee</span>
                          <span className="font-bold">{form.plan ? `$${stripeFee}` : "—"}</span>
                        </div>
                        <div className="h-px bg-purple-100 my-1" />
                        <div className="flex justify-between text-base">
                          <span className="font-extrabold" style={{ color: "var(--purple-dark)" }}>Total</span>
                          <span className="font-fredoka text-xl" style={{ color: "var(--magenta)" }}>{form.plan ? `$${totalPrice}` : "—"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-5 py-4 text-sm font-semibold">
                ⚠️ {error}
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ height: "1px", background: "#EDE9FE", marginBottom: "28px" }} />
            <div className="flex gap-4">
              {step > 0 && (
                <button
                  type="button"
                  onClick={back}
                  className={`${navBtn} px-10 py-6 border-2 hover:bg-purple-50 flex-shrink-0`}
                  style={{ borderColor: "#EDD9FF", color: "var(--purple)" }}
                >
                  ← Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={!canProceed()}
                  className={`${navBtn} flex-1 py-6 px-8 text-white disabled:opacity-40 disabled:cursor-not-allowed`}
                  style={{
                    background: canProceed() ? "linear-gradient(135deg, var(--magenta), var(--orange))" : "#D1D5DB",
                    boxShadow: canProceed() ? "0 8px 24px rgba(196,30,140,0.3)" : "none",
                  }}
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canProceed() || loading}
                  className={`${navBtn} flex-1 py-6 px-8 text-white disabled:opacity-40`}
                  style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))", boxShadow: "0 8px 24px rgba(196,30,140,0.35)" }}
                >
                  {loading ? "⏳ Redirecting..." : `🎉 Pay Securely — $${totalPrice}`}
                </button>
              )}
            </div>

            <p className="text-center text-sm text-gray-400 font-medium mt-6">
              🔒 Secure payment via Stripe · SSL encrypted · No card stored
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

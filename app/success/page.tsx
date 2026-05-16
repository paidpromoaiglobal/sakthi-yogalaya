"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams  = useSearchParams();
  const sessionId     = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    if (!sessionId) { setStatus("error"); return; }

    fetch(`/api/verify-payment?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => setStatus(data.success ? "ok" : "error"))
      .catch(() => setStatus("error"));
  }, [sessionId]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: "linear-gradient(160deg, #FAF0FF 0%, #FFF5F0 50%, #FFF9F0 100%)" }}
    >
      <Image
        src="https://www.sakthiyogalaya.com/images/WebLogo.png"
        alt="Sakthi Yogalaya"
        width={180}
        height={48}
        className="h-12 w-auto object-contain mb-8"
        unoptimized
      />

      {status === "loading" && (
        <>
          <div className="text-5xl mb-6 animate-spin">⏳</div>
          <h1 className="font-fredoka text-4xl mb-4" style={{ color: "var(--purple-dark)" }}>
            Confirming your enrollment…
          </h1>
          <p className="text-gray-400 font-medium">Just a moment while we verify your payment.</p>
        </>
      )}

      {status === "ok" && (
        <>
          <div className="text-7xl mb-6 animate-bounce">🎉</div>
          <h1 className="font-fredoka text-5xl mb-4" style={{ color: "var(--purple-dark)" }}>
            You&apos;re Enrolled!
          </h1>
          <p className="text-xl font-semibold mb-3" style={{ color: "var(--magenta)" }}>
            Welcome to Season 6! 🧘‍♀️
          </p>
          <p className="text-gray-500 max-w-sm mb-8 font-medium leading-relaxed">
            Check your email for confirmation. We&apos;ll send you the Zoom link and WhatsApp group invite within 24 hours!
          </p>
          <div className="bg-white rounded-3xl p-6 max-w-sm shadow-sm border border-purple-100 mb-8 text-left">
            <div className="font-extrabold text-sm mb-3" style={{ color: "var(--purple-dark)" }}>What happens next?</div>
            <ul className="space-y-2 text-sm text-gray-600 font-semibold">
              <li>📧 Confirmation email sent to your inbox</li>
              <li>💬 WhatsApp group invite within 24 hrs</li>
              <li>🔗 Zoom link shared before first class</li>
              <li>🧘 Your child&apos;s yoga journey begins!</li>
            </ul>
          </div>
          <a href="/" className="cta-btn text-white font-extrabold px-8 py-3.5 rounded-full">
            ← Back to Home
          </a>
        </>
      )}

      {status === "error" && (
        <>
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="font-fredoka text-4xl mb-4" style={{ color: "var(--purple-dark)" }}>
            Something went wrong
          </h1>
          <p className="text-gray-500 max-w-sm mb-8 font-medium">
            If your payment was completed, don&apos;t worry — we&apos;ll reach out within 24 hours.
            Contact us at{" "}
            <a href="mailto:summercamp@sakthiyogalaya.com" style={{ color: "var(--magenta)" }}>
              summercamp@sakthiyogalaya.com
            </a>
          </p>
          <a href="/" className="cta-btn text-white font-extrabold px-8 py-3.5 rounded-full">
            ← Back to Home
          </a>
        </>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}

export default function CancelPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: "linear-gradient(135deg, #F5E6FF 0%, #FFF9E6 100%)" }}
    >
      <div className="text-8xl mb-6">😔</div>
      <h1 className="font-fredoka text-5xl mb-4" style={{ color: "var(--purple-dark)" }}>
        Payment Cancelled
      </h1>
      <p className="text-gray-600 max-w-md mb-8">
        No worries! Your spot is still waiting. Come back whenever you&apos;re ready to join the workshop.
      </p>
      <a
        href="/#enroll"
        className="stripe-btn text-white font-bold px-8 py-3 rounded-full"
      >
        Try Again →
      </a>
    </div>
  );
}

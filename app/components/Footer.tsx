import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="py-12 px-6 text-center"
      style={{ background: "linear-gradient(135deg, var(--purple-dark) 0%, #1a0733 100%)" }}
    >
      <div className="max-w-4xl mx-auto">
        <Image
          src="https://www.sakthiyogalaya.com/images/WebLogo.png"
          alt="Sakthi Yogalaya"
          width={180}
          height={48}
          className="h-12 w-auto object-contain mx-auto mb-4 brightness-150"
          unoptimized
        />
        <p className="text-purple-300 text-sm font-semibold mb-5">
          Online Kids Yoga Summer Workshop — Season 6 · Summer 2026
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-purple-300 text-sm mb-6">
          <a href="mailto:summercamp@sakthiyogalaya.com" className="hover:text-white transition-colors font-semibold">
            📧 summercamp@sakthiyogalaya.com
          </a>
          <a href="tel:+17274155308" className="hover:text-white transition-colors font-semibold">
            📞 +1 (727) 415-5308
          </a>
          <a href="tel:+18043007141" className="hover:text-white transition-colors font-semibold">
            📞 +1 (804) 300-7141
          </a>
          <a href="https://www.sakthiyogalaya.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-semibold">
            🌐 sakthiyogalaya.com
          </a>
        </div>
        <div className="h-px bg-white/10 mb-5" />
        <p className="text-purple-500 text-xs font-medium">
          © 2026 Sakthi Yogalaya · All rights reserved
        </p>
      </div>
    </footer>
  );
}

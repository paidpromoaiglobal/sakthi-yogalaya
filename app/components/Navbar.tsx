"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md py-2" : "bg-white/80 backdrop-blur-sm py-3"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Image
          src="https://www.sakthiyogalaya.com/images/WebLogo.png"
          alt="Sakthi Yogalaya"
          width={200}
          height={52}
          className="h-12 w-auto object-contain"
          unoptimized
        />
        <div className="flex items-center gap-4">
          <a href="tel:+17274155308" className="hidden md:flex items-center gap-1.5 text-sm font-bold hover:opacity-80 transition-opacity whitespace-nowrap" style={{ color: "var(--purple)" }}>
            📞 +1 (727) 415-5308
          </a>
          <a href="tel:+18043007141" className="hidden lg:flex items-center gap-1.5 text-sm font-bold hover:opacity-80 transition-opacity whitespace-nowrap" style={{ color: "var(--purple)" }}>
            📞 +1 (804) 300-7141
          </a>
          <a
            href="#enroll"
            className="cta-btn inline-flex items-center justify-center text-white font-bold px-7 py-4 rounded-full text-sm whitespace-nowrap"
          >
            Enroll Now ✨
          </a>
        </div>
      </div>
    </nav>
  );
}

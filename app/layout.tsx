import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kids Yoga Summer Workshop – Season 6 | Sakthi Yogalaya",
  description: "Join Sakthi Yogalaya's Online Kids Yoga Summer Workshop Season 6! Fun, playful yoga for children. Two flexible plans — 1 month or 2 months. Enroll now!",
  openGraph: {
    title: "Kids Yoga Summer Workshop – Season 6 | Sakthi Yogalaya",
    description: "Fun online yoga for kids this summer! Enroll in Season 6 of Sakthi Yogalaya's Summer Workshop.",
    url: "https://summercamp.sakthiyogalaya.com",
    siteName: "Sakthi Yogalaya",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

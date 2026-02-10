import type { Metadata } from "next";
import { Epilogue, Geist, Libre_Baskerville, Orbitron } from "next/font/google";
import "./globals.css";

// Body text - Main font
const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Large headings (H1, H2, H3)
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["800"],
});

// Smaller headings (H4, H5, H6)
const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Special/Tech elements
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Myra Keleher Cleaning Agency | Premium Home Cleaning in Florida",
  description:
    "Myra Keleher is a premium cleaning collective that turns chaotic spaces into pristine sanctuaries. Eco-friendly, meticulous, and reliable.",

  // ── Favicon / App icons ──────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/images/MK_Primary_light.png", type: "image/png" },
    ],
    apple: [
      { url: "/images/MK_Primary_light.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/images/MK_Primary_light.png",
  },

  // ── Open Graph (Facebook, WhatsApp, Slack, iMessage previews) ───────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://myrakeleher.com",
    siteName: "Myra Keleher Cleaning Agency",
    title: "Myra Keleher | Premium Home Cleaning in Florida",
    description:
      "Turn chaotic spaces into pristine sanctuaries. Eco-friendly, meticulous, and reliable cleaning services across Naples, Orlando, Miami & Tampa.",
    images: [
      {
        url: "/images/MK_Primary_light.png",
        width: 1200,
        height: 630,
        alt: "Myra Keleher — Premium Cleaning Services",
      },
    ],
  },

  // ── Twitter / X Card ────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Myra Keleher | Premium Home Cleaning in Florida",
    description:
      "Turn chaotic spaces into pristine sanctuaries. Eco-friendly, meticulous, and reliable.",
    images: ["/images/MK_Primary_light.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${epilogue.variable} ${geist.variable} ${libreBaskerville.variable} ${orbitron.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

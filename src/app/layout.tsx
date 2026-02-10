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

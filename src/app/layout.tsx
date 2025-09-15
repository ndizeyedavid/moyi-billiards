import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moyi Billiards",
  description:
    "Moyi Billiards offers a premium collection of high-quality billiards for enthusiasts and professionals alike. Explore our catalog and find the perfect billiard for your game.",
  icons: {
    icon: "/thumb.png",
  },
  keywords: [
    "Moyi Billiards",
    "billiards catalog",
    "premium billiards",
    "billiard prices",
    "professional billiards",
    "game equipment",
    "great moyi",
    "billiards",
    "the great moyi",
    "willison billiards",
    "billiards of willison",
  ],
  authors: [{ name: "NDIZEYE David", url: "https://davidndizeye.vercel.app/" }],
  openGraph: {
    type: "website",
    url: "https://moyibilliards.vercel.app",
    title: "Moyi Billiards",
    description:
      "Moyi Billiards offers a premium collection of high-quality billiards for enthusiasts and professionals alike. Explore our catalog and find the perfect billiard for your game.",
    siteName: "Moyi Billiards",
    images: [
      { url: "https://moyibilliards.vercel.app/tables/table1.png" },
      { url: "https://moyibilliards.vercel.app/tables/table2.webp" },
      { url: "https://moyibilliards.vercel.app/tables/table3.png" },
      { url: "https://moyibilliards.vercel.app/tables/table4.jpeg" },
    ],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}

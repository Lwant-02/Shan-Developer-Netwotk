import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Latin only — Google Sans has no Myanmar subset, so Shan is served by the AJ
// fonts below via the --font-sans fallback stack in globals.css.
const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
});

const aj00 = localFont({
  src: "../public/fonts/aj00.ttf",
  variable: "--font-aj00",
  weight: "400",
  display: "swap",
});

const aj12 = localFont({
  src: "../public/fonts/aj12.ttf",
  variable: "--font-aj12",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shan Developer Network",
  description: "Shan Developer Network",
  icons: {
    icon: "/icons/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${googleSans.variable} ${aj00.variable} ${aj12.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

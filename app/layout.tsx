import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
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
      className={`${montserrat.variable} ${aj00.variable} ${aj12.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

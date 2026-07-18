import { Google_Sans } from "next/font/google";
import localFont from "next/font/local";

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

// notFound() renders inside Next's own <html>, not the locale layout, so the 404
// pages have to re-declare these on a wrapper or the Shan face never loads.
export const fontVariables = [
  googleSans.variable,
  aj00.variable,
  aj12.variable,
].join(" ");

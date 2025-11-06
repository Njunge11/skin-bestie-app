import { Anton } from "next/font/google";
import localFont from "next/font/local";

export const anton = Anton({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export const neueHaasDisplay = localFont({
  src: [
    {
      path: "../../public/Fonts/NeueHaasDisplayRoman.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Fonts/NeueHaasDisplayMediu.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-neue-haas-display",
  display: "swap",
});

import "./globals.css";
import Providers from "./providers";
import LayoutWrapper from "./layoutWrapper";
import ClientToaster from "@/clientToaster";

import { Poppins, Playfair_Display } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
});

export const metadata = {
  title: "Best School in Bhander | RMSB - School",
  description: "Savitribai Phule Mission School Bhander",
  icons: {
    // icon: "/favicon.ico",
    // shortcut: "/favicon.ico",
    // apple: "/faviconnn.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${playfair.variable}`}>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
          <ClientToaster />
        </Providers>
      </body>
    </html>
  );
}

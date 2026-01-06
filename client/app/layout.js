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
  title: "School Management",
  description: "Admin frontend built with Next.js and Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${playfair.variable}`}>
        <div className="min-h-screen flex flex-col">
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
            <ClientToaster />
          </Providers>
        </div>
      </body>
    </html>
  );
}

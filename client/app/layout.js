"use client"

import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./Provider";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata = {
//   title: "Infinity Chat",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  return (

    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {" "}
            <Providers>
            <SessionProvider>
          <div className="flex overflow-x-hidden">
            <div className="overflow-x-hidden w-full h-full justify-center items-center">
              {children}
              <Toaster />
            </div>
          </div>
          
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

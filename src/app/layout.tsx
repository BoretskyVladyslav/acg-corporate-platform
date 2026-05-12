import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import Analytics from "@/src/components/Analytics";
import SmoothScrolling from "@/src/components/SmoothScrolling";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ACG",
  description: "Landing page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background text-foreground font-sans"
      >
        <Script id="bis-skin-checked-guard" strategy="beforeInteractive">
          {`(function(){var o=new MutationObserver(function(m){m.forEach(function(r){if(r.type==='attributes'&&r.attributeName==='bis_skin_checked'){r.target.removeAttribute('bis_skin_checked')}})});o.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['bis_skin_checked']});setTimeout(function(){o.disconnect()},5000);document.querySelectorAll('[bis_skin_checked]').forEach(function(e){e.removeAttribute('bis_skin_checked')})})()`}
        </Script>
        <Analytics />
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}

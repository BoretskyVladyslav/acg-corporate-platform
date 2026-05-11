import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        {/* Intercept Bitdefender extension attribute injections before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var o=new MutationObserver(function(m){m.forEach(function(r){if(r.type==='attributes'&&r.attributeName==='bis_skin_checked'){r.target.removeAttribute('bis_skin_checked')}})});o.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['bis_skin_checked']});setTimeout(function(){o.disconnect()},5000);document.querySelectorAll('[bis_skin_checked]').forEach(function(e){e.removeAttribute('bis_skin_checked')})})()`,
          }}
        />
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}

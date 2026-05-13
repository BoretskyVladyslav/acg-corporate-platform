import type { Metadata } from "next";
import Script from "next/script";
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
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID?.trim();

  return (
    <html
      lang="uk"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-x-hidden antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex min-w-0 flex-col overflow-x-hidden bg-background font-sans text-foreground"
      >
        <Script id="bis-skin-checked-guard" strategy="beforeInteractive">
          {`(function(){var o=new MutationObserver(function(m){m.forEach(function(r){if(r.type==='attributes'&&r.attributeName==='bis_skin_checked'){r.target.removeAttribute('bis_skin_checked')}})});o.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['bis_skin_checked']});setTimeout(function(){o.disconnect()},5000);document.querySelectorAll('[bis_skin_checked]').forEach(function(e){e.removeAttribute('bis_skin_checked')})})()`}
        </Script>
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-gtag" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(gaMeasurementId)});`}
            </Script>
          </>
        ) : null}
        {fbPixelId ? (
          <>
            <Script id="fb-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(fbPixelId)});fbq('track','PageView');`}
            </Script>
            <noscript>
              <img
                height={1}
                width={1}
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${encodeURIComponent(fbPixelId)}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        ) : null}
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}

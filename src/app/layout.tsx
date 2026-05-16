import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScrolling from "@/src/components/SmoothScrolling";
import {
  OG_IMAGE_DEFAULT_ALT,
  OG_IMAGE_PATH,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
} from "@/src/lib/siteMetadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Базова URL для metadataBase та абсолютних OG-посилань. */
function resolveSiteUrl(): URL {
  const fromEnv =
    typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
      ? process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/+$/, "")
      : "";
  if (fromEnv && /^https?:\/\//i.test(fromEnv)) {
    return new URL(`${fromEnv}/`);
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//i, "");
    return new URL(`https://${host}`);
  }
  return new URL("http://localhost:3002/");
}

const siteUrl = resolveSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: SITE_DEFAULT_TITLE,
    template: "%s | ACG",
  },
  description: SITE_DEFAULT_DESCRIPTION,
  openGraph: {
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    url: "/",
    siteName: "ACG",
    locale: "uk_UA",
    type: "website",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_DEFAULT_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // GTM: повна аналітика в контейнері; окремий GA лише якщо GTM не заданий (уникнення подвійного page_view).
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  const gaId =
    process.env.NEXT_PUBLIC_GA_ID?.trim() ||
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const showGaStandalone = Boolean(gaId) && !gtmId;
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID?.trim();

  return (
    <html
      lang="uk"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-x-clip antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex min-w-0 flex-col overflow-x-clip bg-background font-sans text-foreground"
      >
        <Script id="bis-skin-checked-guard" strategy="beforeInteractive">
          {`(function(){var o=new MutationObserver(function(m){m.forEach(function(r){if(r.type==='attributes'&&r.attributeName==='bis_skin_checked'){r.target.removeAttribute('bis_skin_checked')}})});o.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['bis_skin_checked']});setTimeout(function(){o.disconnect()},5000);document.querySelectorAll('[bis_skin_checked]').forEach(function(e){e.removeAttribute('bis_skin_checked')})})()`}
        </Script>
        {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
        {showGaStandalone && gaId ? <GoogleAnalytics gaId={gaId} /> : null}
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

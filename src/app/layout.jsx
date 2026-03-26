import Script from "next/script";
import "@/styles/index.css";
import Providers from "./providers";
import { HydrationErrorSuppressor } from "@/components/shared/HydrationErrorSuppressor";

export const metadata = {
  title: {
    default: "Pacific Discovery Network - Connect with Pacific Island Businesses",
    template: "%s | Pacific Discovery Network"
  },
  description: "Discover and connect with authentic Pacific Island businesses. Support local entrepreneurs, find unique products and services, and strengthen Pacific communities.",
  keywords: ["Pacific businesses", "Pacific Islands", "local businesses", "Pacific entrepreneurs", "Island economy", "Pacific marketplace"],
  authors: [{ name: "Pacific Discovery Network" }],
  creator: "Pacific Discovery Network",
  publisher: "Pacific Discovery Network",
  metadataBase: new URL("https://pacificdiscoverynetwork.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pacificdiscoverynetwork.com",
    title: "Pacific Discovery Network - Connect with Pacific Island Businesses",
    description: "Discover and connect with authentic Pacific Island businesses. Support local entrepreneurs and strengthen Pacific communities.",
    siteName: "Pacific Discovery Network",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "Pacific Discovery Network - Connecting Pacific Island Businesses"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pacific Discovery Network",
    description: "Discover and connect with authentic Pacific Island businesses.",
    images: ["/hero.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: "/favicon_min.ico",
    shortcut: "/favicon_min.ico",
    apple: "/favicon_min.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body>
        <HydrationErrorSuppressor />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

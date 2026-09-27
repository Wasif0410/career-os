import type { Metadata, Viewport } from "next";
import { Funnel_Display, Instrument_Sans, JetBrains_Mono, Kalam } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MotionProvider } from "@/components/motion-provider";
import { site } from "@/lib/site";
import "./globals.css";

const display = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const sans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const hand = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Career OS · Land the role you're aiming for",
    template: "%s · Career OS",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Career OS · Land the role you're aiming for",
    description: site.description,
    url: "/",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career OS · Land the role you're aiming for",
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f5f8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${hand.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <MotionProvider>{children}</MotionProvider>
        {/* Real-visitor Core Web Vitals. Does nothing off Vercel or until enabled in the project dashboard. */}
        <SpeedInsights />
      </body>
    </html>
  );
}

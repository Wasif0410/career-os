import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MotionProvider } from "@/components/motion-provider";
import { site, vercelEnv } from "@/lib/site";
import "./globals.css";

// Headlines: an editorial serif with optical sizes, so large type stays crisp and light.
const display = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

// Everything else: the same workhorse sans most product teams ship with.
const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
  themeColor: "#050b24",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <MotionProvider>{children}</MotionProvider>
        {/* Real-visitor Core Web Vitals. Its script only exists on Vercel, so skip it elsewhere to avoid a 404. */}
        {vercelEnv && <SpeedInsights />}
      </body>
    </html>
  );
}

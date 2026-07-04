import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MiniPlayer from "@/components/MiniPlayer";
import IntroGate from "@/components/IntroGate";
import { SpotifyPlayerProvider } from "@/lib/spotify-player-context";

export const metadata: Metadata = {
  title: "Ascendo",
  description: "Personal life tracker",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ascendo",
  },
};

export const viewport = {
  themeColor: "#0E1524",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SpotifyPlayerProvider>
          <IntroGate>
            <div className="app-shell">
              <Sidebar />
              <div className="main-col">
                <div className="content-scroll content-scroll-with-player">{children}</div>
              </div>
            </div>
            <MiniPlayer />
          </IntroGate>
        </SpotifyPlayerProvider>
      </body>
    </html>
  );
}

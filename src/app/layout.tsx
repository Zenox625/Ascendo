import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MiniPlayer from "@/components/MiniPlayer";
import IntroGate from "@/components/IntroGate";
import { SpotifyPlayerProvider } from "@/lib/spotify-player-context";

export const metadata: Metadata = {
  title: "Ascendo",
  description: "Personal life tracker",
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

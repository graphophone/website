import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header/header";
import MobileHeader from "@/components/header/mobile/mobile-header";
import { UserContextProvider } from "@/context/userContext";
import { ToastContextProvider } from "@/context/toastContext";
import { AssetContextProvider } from "@/context/assetContext";
import { PlayerContextProvider } from "@/context/playerContext";
import { ThemeProvider } from "next-themes";
import AudioPlayer from "@/components/player/audio-player";

const font = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Graphophone",
  description: "Music streaming app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", font.variable, "font-sans")}
    >
      <body className="min-h-screen overflow-x-hidden">
        <ToastContextProvider>
        <UserContextProvider>
        <AssetContextProvider>
        <PlayerContextProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="w-full h-max min-h-screen flex flex-col gap-4.5">
            <Header />
            <MobileHeader />

            <div className="w-full grow md:px-[9vw] flex pb-4.5">
              {children}
            </div>

            <AudioPlayer />
          </div>
        </ThemeProvider>
        </PlayerContextProvider>
        </AssetContextProvider>
        </UserContextProvider>
        </ToastContextProvider>
      </body>
    </html>
  );
}

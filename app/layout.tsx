import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header/header";
import MobileHeader from "@/components/header/mobile-header";
import { UserContextProvider } from "@/context/userContext";
import { ToastContextProvider } from "@/context/toastContext";
import { AssetContextProvider } from "@/context/assetContext";
import { ThemeProvider } from "next-themes";

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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ToastContextProvider>
          <UserContextProvider>
          <AssetContextProvider>
            <div className="w-full h-max min-h-screen flex flex-col gap-4.5">
              <div className="hidden md:block">
                <Header />
              </div>
              <MobileHeader />

              <div className="w-full grow pb-4.5 md:px-[9vw] flex">
                {children}
              </div>
            </div>
          </AssetContextProvider>
          </UserContextProvider>
          </ToastContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header/header";
import { UserContextProvider } from "@/context/userContext";
import { ToastContextProvider } from "@/context/toastContext";

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
      className={cn("h-full", "antialiased", font.variable, "font-sans")}
    >
      <body className="min-h-full overflow-x-hidden flex flex-col gap-2">
        <ToastContextProvider>
        <UserContextProvider>
          <Header />

          <div className="w-full grow md:px-[9vw] flex">
            {children}
          </div>
        </UserContextProvider>
        </ToastContextProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next"
import "./globals.css"
import AppProvider from "./context/AppProvider";
import Header from "./components/Header"
// import { DM_Sans } from "next/font/google"
// import { NextFont } from "next/dist/compiled/@next/font";

// export const dmSans: NextFont = DM_Sans({
//   subsets: ["latin"]
// })

export const metadata: Metadata = {
  title: "Music Recommender App",
  description: "This app is part of thesis project",
  authors: { name: "Jesse Plym"}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="relative max-h-screen bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 text-white w-full text-3xl">
        <AppProvider>
          <Header />
          {children}
        </AppProvider>
      </body>
    </html>
  )
}

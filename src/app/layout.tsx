import type { Metadata } from "next"
import "./globals.css"
import AppProvider from "./context/AppProvider"
import Header from "./components/Header"
import Player from "./components/Player"
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
          <main className={`h-full mx-4 sm:mx-10 grid grid-rows-[8fr,1fr] gap-2`}>
            {children}
            <Player />
          </main>
        </AppProvider>
      </body>
    </html>
  )
}

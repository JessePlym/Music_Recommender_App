import type { Metadata } from "next"
import "./globals.css"
import AuthProvider from "./context/AuthProvider";
import Header from "./components/Header";
import { DM_Sans } from "next/font/google"

export const dmSans = DM_Sans({
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Music Recommender App",
  description: "This app is part of thesis project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={dmSans.className}>
      <body className="relative max-h-screen bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 text-white w-full text-3xl">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import "./globals.css"
import AuthProvider from "./context/AuthProvider";
import Header from "./components/Header";

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
    <html lang="en">
      <body className="max-h-screen bg-slate-950 text-white w-full text-3xl">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

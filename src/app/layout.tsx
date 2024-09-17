import type { Metadata } from "next"
import "./globals.css"
import AuthProvider from "./context/AuthProvider";

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
      <body className="p-4 text-3xl">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

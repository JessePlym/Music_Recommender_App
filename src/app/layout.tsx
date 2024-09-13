import type { Metadata } from "next"
import "./globals.css"

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
      <body>
        {children}
      </body>
    </html>
  )
}

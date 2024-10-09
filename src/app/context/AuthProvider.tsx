"use client"

import { createContext, useState, useEffect, ReactNode } from "react";
import { getSession, SessionProvider } from "next-auth/react";

interface AuthContextType {
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expires_at: number | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expires_at, setExpiresAt] = useState<number | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();

      if (session) {
        setUserId(session.userId || null)
        setAccessToken(session.accessToken || null)
        setRefreshToken(session.refreshToken || null)
        setExpiresAt(session.expires_at || null)
      }
    }

    fetchSession()
  }, [])

  return (
    <AuthContext.Provider value={{ userId, accessToken, refreshToken, expires_at }}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </AuthContext.Provider>
  )
}
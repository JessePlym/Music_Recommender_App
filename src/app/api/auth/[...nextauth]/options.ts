import type { NextAuthOptions } from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

export const options: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: { 
          scope: 
          "user-top-read%20user-read-recently-played%20" +
          "user-read-private%20user-read-email%20streaming%20" +
          "user-read-playback-state%20user-library-read%20" +
          "user-modify-playback-state"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expires_at = Date.now() + (12 * 60 * 60 * 1000)
        token.userId = account.providerAccountId
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.expires_at = token.expires_at
      session.userId = token.userId
      return session
    }
  }
}


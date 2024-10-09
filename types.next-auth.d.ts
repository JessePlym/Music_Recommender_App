// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth"

// Extend the default `Session` interface
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expires_at?: number;
    userId?: string;
  }
}

declare module "next-auth" {
  interface User {
    userId?: string
  }
}

// Extend the default `JWT` interface
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expires_at?: number;
    userId?: string;
  }
}
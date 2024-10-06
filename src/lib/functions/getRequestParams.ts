import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

export async function getTokenFromJWT(request: NextRequest, secret: string) {
  const jwt = await getToken({req: request, secret})
  if (!jwt) return
  
  const token = jwt?.accessToken
  return token
}

export function getUserIdFromRequestParams(request: NextRequest) {
  const url = new URL(request.url)
  const userId: string | null = url.searchParams.get("id")
  return userId
}
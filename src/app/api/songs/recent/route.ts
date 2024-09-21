import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const DATA_SOURCE_URL = "https://api.spotify.com/v1/me/player/recently-played"
const LIMIT = 20
const secret = process.env.NEXTAUTH_SECRET as string

export async function GET(request: NextRequest) {
  const jwt = await getToken({req: request, secret})
  if (!jwt) return
  
  const token = jwt?.accessToken
  
  if (!token) {
    return NextResponse.json({ "message": "No Token"})
  }
  try {
    const response = await fetch(`${DATA_SOURCE_URL}?before=${Date.now()}&limit=${LIMIT}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data.items)
    } else {
      return NextResponse.json({ "status": response.status})
    }
  } catch (err) {
    return NextResponse.json({"message": "Error"})
  }
}
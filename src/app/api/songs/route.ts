import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const secret = process.env.NEXTAUTH_SECRET as string

export async function GET(req: NextRequest) {

  const token = await getToken({ req, secret})
  const songId = "7L9vDIDuqRUJRFxI2RBK2T"
  if (!token) {
    return NextResponse.json({ "message": "Unauthorized"})
  }
  const accessToken = token.accessToken

  try {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + accessToken
      }
    })
    if (!response.ok) {
      console.log(response)
      return
    }
    const data = await response.json()
    console.log(data)
    return NextResponse.json(data)
  } catch (err) {
    console.log(err)
  }
}
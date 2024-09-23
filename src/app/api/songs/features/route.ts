import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { DATA_SOURCE_URL } from "../../../../../constants"

const secret = process.env.NEXTAUTH_SECRET as string

export async function GET(req: NextRequest) {
  console.log("Fetch triggered")
  const token = await getToken({ req, secret})
  const id = req.url.slice(req.url.lastIndexOf("?") + 1)

  if (!id) return

  if (!token) {
    return NextResponse.json({ "message": "Unauthorized"})
  }
  const accessToken = token.accessToken

  try {
    const response = await fetch(`https://api.spotify.com/v1/audio-features/${id}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + accessToken
      }
    })
    if (!response.ok) return
    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.log(err)
  }
}

export async function POST(request: NextRequest) {
  const songPrefence: Preference = await request.json()
  if (!songPrefence) return
  const userId: string = "0000"
  try {
    const response = await fetch(`${DATA_SOURCE_URL}/preferences/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(songPrefence)
    })
    if (response.ok) {
      return NextResponse.json({ "message": "Song preferences sent successfully"})
    }
  } catch (err) {
    return NextResponse.json({"message": "Could not post data"})
  }
}
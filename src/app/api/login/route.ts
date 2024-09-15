import { NextResponse } from "next/server"


const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
// const redirectUri = "http://localhost:3000"
// const state = generateRandomString(16)
// const scope = "user-read-private%20user-read-email%20streaming"

export async function POST() {
  const url = "https://accounts.spotify.com/api/token"
  const authOptions: RequestInit = {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")
    },
    body: new URLSearchParams({
      grant_type: "client_credentials"
    })
  }
  try {
    const res = await fetch(url, authOptions)
    if (!res.ok) return
    const data = await res.json()
    const token = data["access_token"]
    console.log(token)
    return NextResponse.json({token})
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch token" }, { status: 500 })
  }
}
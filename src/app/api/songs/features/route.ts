import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongo"

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
  const url = new URL(request.url)
  const userId = url.searchParams.get("id")

  if (!userId) {
    return NextResponse.json({ "message": "No User id provided"})
  }

  
  try {
    const client = await clientPromise
    const db = client.db("MusicDB")
    
    const collection = db.collection("preferences")
    const payload = {
      $set: {
        ...songPrefence
      }
    }
    const filter = { id: userId}
    const options = { upsert: true}
  
    const result = await collection.updateOne(filter, payload, options)

    return NextResponse.json({"message": result})
  } catch (err) {
    return NextResponse.json({"message": "Could not post data"})
  }
}
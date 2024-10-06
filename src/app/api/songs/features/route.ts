import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongo"
import { validatePreferences } from "@/lib/functions/validate"

export async function POST(request: NextRequest) {
  const songPreference: Preference = await request.json()
  if (!songPreference) return
  const url = new URL(request.url)
  const userId = url.searchParams.get("id")

  if (!userId) {
    return NextResponse.json({ "message": "No User id provided"})
  }

  const valid = validatePreferences(songPreference)

  if (!valid) {
    return NextResponse.json({ "message": "Preferences are not valid"})
  }
  
  try {
    const client = await clientPromise
    const db = client.db("MusicDB")
    
    const collection = db.collection("preferences")
    const payload = {
      $set: {
        songPreference
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
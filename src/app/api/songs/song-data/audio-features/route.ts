import { getTokenFromJWT } from "@/lib/functions/getRequestParams"
import { getTrackFeatures } from "@/lib/functions/getTrackFeatures"
import { saveTracksToMongo } from "@/lib/functions/saveDataToMongo"
import { NextRequest, NextResponse } from "next/server"

type ReqBody = {
  tracks: Track[],
  collection: string,
  saveToMongo: boolean,
  userId: string
}

const secret = process.env.NEXTAUTH_SECRET as string

export async function POST(request: NextRequest) {
  const token = await getTokenFromJWT(request, secret)

  if (!token) {
    return NextResponse.json({ "message": "No Token"})
  }

  const { tracks, saveToMongo, userId, collection }: ReqBody = await request.json()

  
  if (saveToMongo) {
    await saveTracksToMongo(tracks, collection, userId)
    console.log("saved to mongo")
  } else {
    await getTrackFeatures(tracks, token)
  }

  return NextResponse.json(tracks)

}
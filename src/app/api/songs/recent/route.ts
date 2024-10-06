import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { getTrackFeatures } from "@/lib/functions/getTrackFeatures"
import clientPromise from "@/lib/mongo"

const SPOTIFY_DATA_SOURCE_URL = "https://api.spotify.com/v1"
const LIMIT = 50
const secret = process.env.NEXTAUTH_SECRET as string

export async function GET(request: NextRequest) {
  const jwt = await getToken({req: request, secret})
  if (!jwt) return
  
  const token = jwt?.accessToken

  const url = new URL(request.url)
  const userId: string | null = url.searchParams.get("id")

  if (!userId) {
    return NextResponse.json({ "message": "No User id provided"})
  }
  
  if (!token) {
    return NextResponse.json({ "message": "No Token"})
  }

  let tracks: Track[]

  try {
    const client = await clientPromise
    const db = client.db("MusicDB")

    const items = await db.collection("recent").find({ "id": userId}).toArray()
    const hour = 1000 * 60 * 60
    if (items.length > 0 && items[0].updatedAt + hour > Date.now()) {
      tracks = items[0].tracks
      console.log("Data retreived from mongo")
      return NextResponse.json(tracks)
    }
  } catch (err) {
    console.log("Error while retrieving data from mongo")
  }
  try {
    const response = await fetch(`${SPOTIFY_DATA_SOURCE_URL}/me/player/recently-played?before=${Date.now()}&limit=${LIMIT}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      tracks = filterDuplicateTracks(data.items)
      await getTrackFeatures(tracks, token, "tracks", userId)
      return NextResponse.json(tracks)
    } else {
      return NextResponse.json({ "status": response.status})
    }
  } catch (err) {
    tracks = []
    return NextResponse.json(tracks)
  }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterDuplicateTracks(items: any) {
  
  const uniqueTracks: Track[] = [];
  const seenIds = new Set();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items.forEach((item: any) => {
    if (!seenIds.has(item.track.id)) {
    seenIds.add(item.track.id);
    uniqueTracks.push({
      name: item.track.name,
      id: item.track.id,
      album: item.track.album,
      albumName: item.track.album.name,
      artist: item.track.album.artists[0].name,
      artistId: item.track.album.artists[0].id,
      popularity: item.track.popularity,
      uri: item.track.uri,
      features: {
        acousticness: 0,
        danceability: 0,
        instrumentalness: 0,
        key: 0,
        mode: 0,
        tempo: 0
      }
      })
    }
  })
  
  return uniqueTracks
}
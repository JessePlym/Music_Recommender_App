import { NextRequest, NextResponse } from "next/server"
import { getTrackFeatures } from "@/lib/functions/getTrackFeatures"
import { getTracksFromMongo } from "@/lib/functions/getDataFromMongo"
import { getTokenFromJWT, getUserIdFromRequestParams } from "@/lib/functions/getRequestParams"
import { saveTracksToMongo } from "@/lib/functions/saveDataToMongo"

const SPOTIFY_DATA_SOURCE_URL = "https://api.spotify.com/v1"
const LIMIT = 50
const secret = process.env.NEXTAUTH_SECRET as string

export async function GET(request: NextRequest) {
  const token = await getTokenFromJWT(request, secret)

  if (!token) {
    return NextResponse.json({ "message": "No Token"})
  }

  const userId = getUserIdFromRequestParams(request)

  if (!userId) {
    return NextResponse.json({ "message": "No User id provided"})
  }

  let tracks = await getTracksFromMongo(userId, "recent")

  if (tracks) {
    return NextResponse.json(tracks)
  }

  /**
   * If no tracks received from mongo, begin fetching from Spotify API
   */

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
      await getTrackFeatures(tracks, token)
      await saveTracksToMongo(tracks, "recent", userId)
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
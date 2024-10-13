import { NextRequest, NextResponse } from "next/server"
import { getTrackFeatures } from "@/lib/functions/getTrackFeatures"
import { getTokenFromJWT } from "@/lib/functions/getRequestParams"
import { getArtistGenres } from "@/lib/functions/getArtistGenres"


const SPOTIFY_DATA_SOURCE_URL = "https://api.spotify.com/v1"
const LIMIT = 50
const secret = process.env.NEXTAUTH_SECRET as string

export async function GET(request: NextRequest) {
  const token = await getTokenFromJWT(request, secret)

  if (!token) {
    return NextResponse.json({ "message": "No Token"})
  }

  let tracks: Track[] = []

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
      const tracksWithGenres = await getArtistGenres(tracks, token)
      await getTrackFeatures(tracksWithGenres, token)
      return NextResponse.json(tracksWithGenres)
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

  
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  items.forEach((item: any) => {
    if (!seenIds.has(item.track.id)) {
    seenIds.add(item.track.id);
    uniqueTracks.push({
      name: item.track.name,
      id: item.track.id,
      album: item.track.album,
      albumName: item.track.album.name,
      artist: item.track.album.artists[0],
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
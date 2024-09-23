import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { DATA_SOURCE_URL } from "../../../../../constants"

const SPOTIFY_DATA_SOURCE_URL = "https://api.spotify.com/v1"
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
    const response = await fetch(`${SPOTIFY_DATA_SOURCE_URL}/me/player/recently-played?before=${Date.now()}&limit=${LIMIT}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    console.log(response.status)
    if (response.ok) {
      const data = await response.json()
      const uniqueTracks = filterDuplicateTracks(data.items)
      await sendTrackFeaturesToDB(uniqueTracks, token)
      return NextResponse.json(uniqueTracks)
    } else {
      return NextResponse.json({ "status": response.status})
    }
  } catch (err) {
    return NextResponse.json({"message": "Error"})
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

async function sendTrackFeaturesToDB(tracks: Track[], accessToken: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tracksWithFeatures: Track[] = tracks.map(({ album, ...rest}) => rest)
  for (const track of tracksWithFeatures) {
    try {
      const response = await fetch(`${SPOTIFY_DATA_SOURCE_URL}/audio-features/${track.id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
      if (response.ok) {
        const featureData = await response.json()
        track.features.acousticness = featureData.acousticness
        track.features.danceability = featureData.danceability
        track.features.instrumentalness = featureData.instrumentalness
        track.features.key = featureData.key
        track.features.mode = featureData.mode
        track.features.tempo = featureData.tempo
      }

    } catch (err) {
      return
    }
  }
  
  try {
    const response = await fetch(`${DATA_SOURCE_URL}/songs`)
    const data = await response.json()
    const tracks = data[0].tracksWithFeatures

    // filterDuplicateTracks
 
    const payload = { tracksWithFeatures }
    await fetch(`${DATA_SOURCE_URL}/songs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
  } catch (err) {
    console.log(err)
  }
}
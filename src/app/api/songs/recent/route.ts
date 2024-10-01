import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

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
  try {
    const response = await fetch(`${SPOTIFY_DATA_SOURCE_URL}/me/player/recently-played?before=${Date.now()}&limit=${LIMIT}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      const uniqueTracks = filterDuplicateTracks(data.items)
      await getTrackFeatures(uniqueTracks, token)
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

async function getTrackFeatures(tracks: Track[], accessToken: string) {
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
  
  // try {
  //   const client = await clientPromise
  //   const db = client.db("MusicDB")
    
  //   const collection = db.collection("songs")
  //   const payload = {
  //     $set: {
  //       tracksWithFeatures
  //     }
  //   }
  //   const filter = { id: userId}
  //   const options = { upsert: true}
  
  //   await collection.updateOne(filter, payload, options)
    
  // } catch (err) {
  //   console.log(err)
  // }
}
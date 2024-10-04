import { getTrackFeatures } from "@/lib/functions/getTrackFeatures"
import clientPromise from "@/lib/mongo"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const SPOTIFY_DATA_SOURCE_URL = "https://api.spotify.com/v1"
const secret = process.env.NEXTAUTH_SECRET as string

type Item = {
  id: string,
  name: string,
  popularity: number
}

export async function POST(request: NextRequest) {
  const jwt = await getToken({req: request, secret})
  if (!jwt) return
  
  const token = jwt?.accessToken

  if (!token) {
    return NextResponse.json({ "message": "No Token"})
  }

  const url = new URL(request.url)
  const userId: string | null = url.searchParams.get("id")

  if (!userId) {
    return NextResponse.json({ "message": "No User id provided"})
  }
  const topArtistIds: string[] = await request.json()

  if (topArtistIds.length === 0) return
  const receivedArtists: string[] = []

  let tracks: Track[]

  try {
    const client = await clientPromise
    const db = client.db("MusicDB")

    const items = await db.collection("songs").find({ "id": userId}).toArray()
    const hour = 1000 * 60 * 60
    if (items[0].updatedAt + hour < Date.now()) {
      tracks = items[0].songData
      console.log("Data retreived from mongo\nTime left: " + ((items[0].updatedAt + hour) - Date.now()))
      return NextResponse.json(tracks)
    }
  } catch (err) {
    console.log("Error while retrieving data from mongo")
  }

  const start = Date.now()
  
  for (const artistId of topArtistIds) {
    try {
      const response = await fetch(`${SPOTIFY_DATA_SOURCE_URL}/artists/${artistId}/related-artists`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (response.ok) {
       const data = await response.json()
       const relatedArtists: Item[] = findItemsWithHighestPopularity(data.artists)
       relatedArtists.forEach(artist => receivedArtists.push(artist.name))
      } else {
        return NextResponse.json({ "status": response.status})
      }
    } catch (err) {
      return NextResponse.json({"message": "Error"})
    }
  }
  console.log("artists received: " + (Date.now() - start) + "ms")
  const queriedTracks = await queryTracksFromArtists(receivedArtists, token)
  console.log("Tracks queried: " + (Date.now() - start) + "ms")
  await getTrackFeatures(queriedTracks, token, "songData", userId)
  console.log("Features added: " + (Date.now() - start) + "ms")
  return NextResponse.json(queriedTracks)
}

function findItemsWithHighestPopularity(items: Item[]) {
  const highestPopularityArtists = items.sort((a: Item, b: Item) => b.popularity - a.popularity)
  return highestPopularityArtists.slice(0, 5) 
}

async function queryTracksFromArtists(artists: string[], accessToken: string) {
  if (artists.length === 0 && !accessToken) return [] as Track[]

  const tracks: Track[] = []

  for (const artist of artists) {
    try {
      const response = await fetch(`${SPOTIFY_DATA_SOURCE_URL}/search?q=artist%3A${artist}&type=track`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.tracks.items.forEach((item: any) => {
          if (!tracks.find(track => track.id === item.id)) {       
            tracks.push({
              name: item.name,
              id: item.id,
              artist: item.artists[0].name,
              artistId: item.artists[0].id,
              albumName: item.album.name,
              album: item.album,
              uri: item.uri,
              popularity: item.popularity,
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
      }
    } catch (err) {
      console.log(err)
    }
  }
  return tracks
}
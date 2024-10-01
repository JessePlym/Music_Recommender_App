import { getTrackFeatures } from "@/lib/functions/getTrackFeatures"
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
  const topArtistIds: string[] = await request.json()

  if (topArtistIds.length === 0) return
  const receivedArtists: string[] = []

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
  await getTrackFeatures(queriedTracks, token)
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
          tracks.push({
            name: item.name,
            id: item.id,
            artist: item.artists[0].name,
            albumName: item.album.name,
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
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  return tracks
}
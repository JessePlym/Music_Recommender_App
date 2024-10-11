import { getTracksFromMongo } from "@/lib/functions/getDataFromMongo"
import { getTokenFromJWT, getUserIdFromRequestParams } from "@/lib/functions/getRequestParams"
import { NextRequest, NextResponse } from "next/server"

const SPOTIFY_DATA_SOURCE_URL = "https://api.spotify.com/v1"
const secret = process.env.NEXTAUTH_SECRET as string

type Item = {
  id: string,
  name: string,
  popularity: number
}

export async function POST(request: NextRequest) {
  const token = await getTokenFromJWT(request, secret)

  if (!token) {
    return NextResponse.json({ "message": "No Token"})
  }

  const userId = getUserIdFromRequestParams(request)

  if (!userId) {
    return NextResponse.json({ "message": "No User id provided"})
  }
  const topArtistIds: string[] = await request.json()

  if (topArtistIds.length === 0) return
  const receivedArtists: string[] = []

  const tracks = await getTracksFromMongo(userId, "songs")

  if (tracks) {
    return NextResponse.json({tracks: tracks, dataFromMongo: true})
  }

  /**
   * If no tracks received from mongo, begin fetching from Spotify API
   */

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
      const tracks: Track[] = []
      console.log(err)
      return NextResponse.json(tracks)
    }
  }
  console.log("artists received: " + (Date.now() - start) + "ms")
  const queriedTracks = await queryTracksFromArtists(receivedArtists, token)
  console.log("Tracks queried: " + (Date.now() - start) + "ms")
  return NextResponse.json({tracks: queriedTracks, dataFromMongo: false})
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
              artist: item.artists[0],
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
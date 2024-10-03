"use client"

import { getSession, useSession } from "next-auth/react"
import Player from "./components/Player"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getRecentTracks } from "@/lib/requests/getRecentTracks"
import { calcAvgFeaturesOfListeningHistory } from "@/lib/functions/calcAvgFeatures"
import { calcRecommendedSongs } from "@/lib/functions/calcRecommendedSongs"
import SongList from "./components/SongList"
import { getPreferences } from "@/lib/requests/getPreferences"
import { getSongData } from "@/lib/requests/getSongData"

const testArtistIds = ["2NPduAUeLVsfIauhRwuft1"]  // "2UOVgpgiNTC6KK0vSC77aD", "3plJVWt88EqjvtuB4ZDRV3", "70cRZdQywnSFp9pnc2WTCE", "5kwthnxNdfnqGk0nL35wDC"

export default function Home() {
  const { data: session, status } = useSession()
  const [recentTracks, setRecentTracks] = useState<Track[] | null>(null)
  const [songData, setSongData] = useState<Track[] | null>(null)
  const [avgFeatures, setAvgFeatures] = useState<AverageSongFeature | null>(null)
  const [playingTrack, setPlayingTrack] = useState("")
  const [recommendedSongs, setRecommendedSongs] = useState<Track[] | null>(null)
  const [fetching, isFetching] = useState(true)
  const router = useRouter()

  
  useEffect(() => {
    if (status === 'authenticated' && session?.expires_at) {
      const isTokenExpired = Date.now() > session.expires_at
      if (isTokenExpired) {
        router.push("/api/auth/signin")
      }
    }
  }, [session, status, router])

  useEffect(() => {
    const fetchRecentTracks = async () => {
      if (status === "authenticated" && session.accessToken && session.userId) {
        const tracks: Track[] | null = await getRecentTracks(session.accessToken, session.userId)
        if (tracks) {
          setRecentTracks(tracks)
        }
        isFetching(false)
      }
    }
    fetchRecentTracks()
  }, [status, session?.accessToken, session?.userId])

  useEffect(() => {
    const fetchSongData = async () => {
      const session = await getSession()
      if (!session) return

      const accessToken = session.accessToken

      if (accessToken) {
        const songData = await getSongData(accessToken, testArtistIds)
        setSongData(songData)
      } else {
        console.log("No token")
      }
    }
    //fetchSongData()
  }, [])

  useEffect(() => {
    const giveRecommendations = async () => {
      if (session?.userId && recentTracks) {
        const preferences: Preference[] = await getPreferences(session.userId)
        const avg = calcAvgFeaturesOfListeningHistory(recentTracks)
        if (avg) {
          console.log(avg)
          setRecommendedSongs(calcRecommendedSongs(recentTracks, avg, preferences, false))
        }
      }
    }

    giveRecommendations()
  }, [recentTracks, avgFeatures, session?.userId])

  const handlePlayingTrack = (uri: string) => {
    setPlayingTrack(uri)
  }
  
  if (status === "loading" || fetching) {
    return <main className="flex flex-col justify-center items-center mt-20">Loading...</main>
  }

  return (
    <>
      <main className="h-full mx-10 grid grid-rows-[8fr,1fr] gap-2">
          <section className="relative bg-slate-950 mt-5 z-20 shadow-xl border border-white/80 p-2 grid grid-cols-[3fr,5fr]">
            <article className="flex flex-col gap-2 p-2">Recently Played Songs
              {
                recentTracks &&
                < SongList tracks={recentTracks} handlePlayingTrack={handlePlayingTrack}/>
              }
            </article>
            <article className="border-l border-white p-2 flex flex-col justify-start items-center gap-2">
              <h2>Song Suggestions</h2> 
                < SongList tracks={recommendedSongs} handlePlayingTrack={handlePlayingTrack} />      
            </article>
          </section>
          <section className=" bg-slate-950 z-20 sticky bottom-0 shadow-xl border border-white/80 p-2 flex justify-center">
            { (status === "authenticated" && session.accessToken && recentTracks) ? 
                <Player accessToken={session?.accessToken} trackUri={playingTrack} recentTracks={recentTracks} />
              : null
            }
          </section>
      </main>
    </>
  )
}

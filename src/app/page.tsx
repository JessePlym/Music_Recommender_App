"use client"

import { useSession } from "next-auth/react"
import Player from "./components/Player"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getRecentTracks } from "@/lib/requests/getRecentTracks"
import { calcAvgFeaturesOfListeningHistory } from "@/lib/functions/calcAvgFeatures"
import { calcMostSimilarItem } from "@/lib/functions/calcMostSimilarItem"
import SongList from "./components/SongList"
import { getPreferences } from "@/lib/requests/getPreferences"

export default function Home() {
  const { data: session, status } = useSession()
  const [recentTracks, setRecentTracks] = useState<Partial<Track[]>>([])
  const [ playingTrack, setPlayingTrack ] = useState("")
  const [ recommendedSongs, setRecommendedSongs] = useState<Track[] | null>(null)
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
        const tracks: Track[] = await getRecentTracks(session.accessToken, session.userId)
        setRecentTracks(tracks)
        setPlayingTrack(tracks[0].uri)
        const avg = calcAvgFeaturesOfListeningHistory(tracks)
        const preferences: Preference = await getPreferences(session.userId)
        if (avg) {
          setRecommendedSongs(calcMostSimilarItem(tracks, avg, preferences, true))
        }
      }
    }
    fetchRecentTracks()
  }, [status, session?.accessToken, session?.userId])

  const handlePlayingTrack = (uri: string) => {
    setPlayingTrack(uri)
  }
  
  if (status === "loading") {
    return <main className="flex flex-col justify-center items-center mt-20">Loading...</main>
  }

  return (
    <>
      <main className="h-full mx-10 grid grid-rows-[8fr,1fr] gap-2">
          <section className="relative bg-slate-950 mt-5 z-20 shadow-xl border border-white/80 p-2 grid grid-cols-[3fr,5fr]">
            <article className="flex flex-col gap-2 p-2">Recently Played Songs
              {
                recentTracks !== undefined &&
                < SongList tracks={recentTracks} handlePlayingTrack={handlePlayingTrack}/>
              }
            </article>
            <article className="border-l border-white p-2 flex flex-col justify-start items-center gap-2">
              <h2>Song Suggestions</h2>
              {
                recommendedSongs !== undefined &&
                < SongList tracks={recommendedSongs} handlePlayingTrack={handlePlayingTrack} />
              }
            </article>
          </section>
          <section className=" bg-slate-950 z-20 sticky bottom-0 shadow-xl border border-white/80 p-2 flex justify-center">
            { (status === "authenticated" && session.accessToken && recentTracks) ? 
                <Player accessToken={session?.accessToken} trackUri={playingTrack} />
              : null
            }
          </section>
      </main>
    </>
  )
}

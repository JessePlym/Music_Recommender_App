"use client"

import { useSession } from "next-auth/react"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { calcAvgFeaturesOfListeningHistory } from "@/lib/functions/calcAvgFeatures"
import { calcRecommendedSongs } from "@/lib/functions/calcRecommendedSongs"
import SongList from "./components/SongList"
import { getPreferences } from "@/lib/requests/getPreferences"
import Spinner from "./components/Spinner"
import useWindowSize from "./hooks/useWindowSize"
import useAuth from "./hooks/useAuth"
import useTracks from "./hooks/useTracks"
import usePlayer from "./hooks/usePlayer"

export default function Home() {
  const [fetching, isFetching] = useState(true)
  const { status } = useSession()
  const { userId, expires_at } = useAuth()
  const { setPlayingTrack } = usePlayer()
  const router = useRouter()
  const { width } = useWindowSize()
  const { recentTracks, recommendedTracks, trackData, setRecommendedTracks } = useTracks()
  const mobile = width < 450

  const isTokenExpired = useMemo(() => expires_at ? Date.now() > expires_at : false, [expires_at])

  
  useEffect(() => {
    if (status === 'authenticated' && expires_at) {
      if (isTokenExpired) {
        router.push("/api/auth/signin")
      }
    }
  }, [expires_at, status, router, isTokenExpired])

  useEffect(() => {
    if (recentTracks) {
      isFetching(false)
    }
  }, [recentTracks])

  useEffect(() => {
    const giveRecommendations = async () => {
      if (userId && recentTracks) {
        const preferences: Preference = await getPreferences(userId)
        const avg = calcAvgFeaturesOfListeningHistory(recentTracks)
        if (avg && trackData) {
          const songRecommendations: Track[] = calcRecommendedSongs(trackData, recentTracks, avg, [preferences], preferences.apply)
          setRecommendedTracks(songRecommendations)
        }
      }
    }

    giveRecommendations()
  }, [recentTracks, trackData, userId, setRecommendedTracks])

  const handlePlayingTrack = (uri: string) => {
    setPlayingTrack(uri)
  }
  
  if (status === "loading" || fetching) {
    return (
      <main className="flex flex-col justify-start items-center mt-20">
        <Spinner />
        Loading...
      </main>
    )
  }

  return (
    <>
      <section className={`relative bg-slate-950 mt-5 z-20 shadow-xl border border-white/80 p-2 ${mobile ? "flex flex-col-reverse" : "grid grid-cols-[3fr,5fr]"}`}>
        <article className="flex flex-col gap-2 p-2">Recently Played Songs
          {
            recentTracks &&
            < SongList tracks={recentTracks} handlePlayingTrack={handlePlayingTrack} mobile={mobile}/>
          }
        </article>
        <article className={`${mobile ? "border-b" : "border-l items-center"} border-white p-2 flex flex-col justify-start gap-2`}>
          <h2>Song Suggestions</h2>
          {(recommendedTracks === null || recommendedTracks.length === 0) 
            ? <>
                <Spinner /> 
                <h3 className="text-xl">Calculating suggestions</h3>
              </>
            : < SongList tracks={recommendedTracks} handlePlayingTrack={handlePlayingTrack} mobile={mobile}/>
          }
        </article>
      </section>
    </>
  )
}

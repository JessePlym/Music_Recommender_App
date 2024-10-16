"use client"

import { useSession } from "next-auth/react"
import Player from "./components/Player"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { getRecentTracks } from "@/lib/requests/getRecentTracks"
import { calcAvgFeaturesOfListeningHistory } from "@/lib/functions/calcAvgFeatures"
import { calcRecommendedSongs } from "@/lib/functions/calcRecommendedSongs"
import SongList from "./components/SongList"
import { getPreferences } from "@/lib/requests/getPreferences"
import { getSongData } from "@/lib/requests/getSongData"
import Spinner from "./components/Spinner"
import useWindowSize from "./hooks/useWindowSize"
import useAuth from "./hooks/useAuth"
import useTracks from "./hooks/useTracks"
import usePlayer from "./hooks/usePlayer"

export default function Home() {
  const [fetching, isFetching] = useState(true)
  const { status } = useSession()
  const { userId, accessToken, expires_at } = useAuth()
  const { setPlayingTrack } = usePlayer()
  const router = useRouter()
  const { width } = useWindowSize()
  const { recentTracks, recommendedTracks, trackData, setRecentTracks, setRecommendedTracks, setTrackData} = useTracks()
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
    const fetchRecentTracks = async () => {
      if (status === "authenticated" && accessToken && userId && !isTokenExpired) {
        const tracks: Track[] | null = await getRecentTracks(accessToken, userId)
        if (tracks) {
          setRecentTracks(tracks)
        }
        isFetching(false)
      }
    }
    fetchRecentTracks()
  }, [status, accessToken, userId, isTokenExpired, setRecentTracks])

  useEffect(() => {
    const fetchSongData = async () => {
      if (isTokenExpired) return

      if (accessToken && recentTracks && userId) {
        const artistIds = recentTracks.map(track => track.artist.id)
        const uniqueIds = new Set<string>()
        artistIds.forEach(id => uniqueIds.add(id))
        const topArtistIds = [...uniqueIds.values()].slice(0, 15)
        const songData = await getSongData(accessToken, topArtistIds, userId)
        setTrackData(songData ?? [])
      }
    }
    fetchSongData()
  }, [recentTracks, accessToken, userId, isTokenExpired, setTrackData])

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
      <main className="flex flex-col justify-center items-center mt-20">
        <Spinner />
        Loading...
      </main>
    )
  }

  return (
    <>
      <main className={`h-full ${mobile ? "mx-4" : "mx-10"} grid grid-rows-[8fr,1fr] gap-2`}>
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
          <section className=" bg-slate-950 z-20 sticky bottom-0 shadow-xl border border-white/80 p-2 flex justify-center">
            { (status === "authenticated") ? 
                <Player />
              : null
            }
          </section>
      </main>
    </>
  )
}

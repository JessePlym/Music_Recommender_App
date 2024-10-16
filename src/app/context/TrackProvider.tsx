"use client"

import { getRecentTracks } from "@/lib/requests/getRecentTracks"
import { useSession } from "next-auth/react"
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState, useMemo } from "react"
import useAuth from "../hooks/useAuth"
import { getSongData } from "@/lib/requests/getSongData"

interface TrackContextType {
  recentTracks: Track[] | null
  recommendedTracks: Track[] | null
  trackData: Track[] | null
  setRecentTracks: Dispatch<SetStateAction<Track[] | null>>
  setRecommendedTracks: Dispatch<SetStateAction<Track[] | null>>
  setTrackData: Dispatch<SetStateAction<Track[] | null>>
}

export const TrackContext = createContext<TrackContextType | undefined>(undefined)

export default function TrackProvider({ children}: { children: ReactNode }) {
  const [recentTracks, setRecentTracks] = useState<Track[] | null>(null)
  const [recommendedTracks, setRecommendedTracks] = useState<Track[] | null>(null)
  const [trackData, setTrackData] = useState<Track[] | null>(null)
  const { status } = useSession()
  const { userId, accessToken, expires_at } = useAuth()

  const isTokenExpired = useMemo(() => expires_at ? Date.now() > expires_at : false, [expires_at])

  useEffect(() => {
    const fetchRecentTracks = async () => {
      if (status === "authenticated" && accessToken && userId && !isTokenExpired) {
        const tracks: Track[] | null = await getRecentTracks(accessToken, userId)
        if (tracks) {
          setRecentTracks(tracks)
        }
      }
    }
    fetchRecentTracks()
  }, [status, accessToken, userId, isTokenExpired])

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
  }, [recentTracks, accessToken, userId, isTokenExpired])

  return (
    <TrackContext.Provider 
      value={{
        recentTracks, 
        recommendedTracks, 
        trackData, 
        setRecentTracks, 
        setRecommendedTracks, 
        setTrackData
        }}
    >
      { children }
    </TrackContext.Provider>
  )
}

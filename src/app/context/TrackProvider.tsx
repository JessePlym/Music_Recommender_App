"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"

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
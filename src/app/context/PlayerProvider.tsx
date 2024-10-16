"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"

interface PlayerContextType {
  playingTrack: string,
  setPlayingTrack: Dispatch<SetStateAction<string>>
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export default function PlayerProvider({ children }: { children: ReactNode}) {
  const [playingTrack, setPlayingTrack] = useState<string>("")

  return (
    <PlayerContext.Provider value={{ playingTrack, setPlayingTrack }}>
      { children }
    </PlayerContext.Provider>
  )
}
import { useContext } from "react"
import { PlayerContext } from "../context/PlayerProvider"

export default function usePlayer() {
  const context = useContext(PlayerContext)

  if (!context) {
    throw new Error("usePlayer must be used within an PlayerProvider")
  }
  return context
}
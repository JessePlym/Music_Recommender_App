import { useContext } from "react";
import { TrackContext } from "../context/TrackProvider";

export default function useTracks() {
  const context = useContext(TrackContext)

  if (!context) {
    throw new Error("useTracks must be used within an TrackProvider")
  }
  return context
}
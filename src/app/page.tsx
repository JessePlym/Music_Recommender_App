"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Songs from "./components/Songs"
import Player from "./components/Player"
import { tracks } from "../../trackUris"

export default function Home() {
  const { data: session } = useSession()
  const [playingTrack, setPlayingTrack] = useState<Track[]>(tracks)

  return (
    <>
      <main className="min-h-screen mx-auto flex-col justify-between">
        <div>Music Recommender App</div>
        <br />
        <div className="flex gap-2">
          <Songs />
        </div>
        { session?.accessToken && <Player accessToken={session?.accessToken} trackUri={playingTrack[0].uri}/>}
      </main>
    </>
  )
}

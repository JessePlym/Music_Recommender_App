"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Songs from "./components/Songs"
import Player from "./components/Player"
import { tracks } from "../../trackUris"

export default function Home() {
  const { data: session } = useSession()
  const accessToken: string | undefined = session?.accessToken
  const [playingTrack, setPlayingTrack] = useState<Track[]>(tracks)

  return (
    <>
      <main className="min-h-screen mx-auto flex-col justify-between">
        <div>Music Recommender App</div>
        <p>Token: {accessToken}</p>
        <br />
        <div className="flex gap-2">
          <Songs token={accessToken} />
        </div>
        { accessToken && <Player accessToken={accessToken} trackUri={playingTrack[0].uri}/>}
      </main>
    </>
  )
}

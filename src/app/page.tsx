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
      <main className="h-full mx-10 grid grid-rows-[7fr,1fr] gap-2">
        <section className="mt-5 border border-white p-2 grid grid-cols-[2fr,5fr]">
          <article className="border border-white p-2 flex flex-col gap-2">Recently Played Songs
          <ul className="text-2xl">
              <li>Song 1</li>
              <li>Song 2</li>
              <li>Song 3</li>
            </ul>
          </article>
          <article className="border border-white p-2 flex flex-col justify-start items-center gap-2">
            <h2>Song Suggestions</h2>
            <ul className="text-2xl">
              <li>Song 1</li>
              <li>Song 2</li>
              <li>Song 3</li>
            </ul>
          </article>
        </section>
        <section className="border border-white p-2 flex justify-center">
          { session?.accessToken && <Player accessToken={session?.accessToken} trackUri={playingTrack[0].uri}/>}
        </section>
      </main>
    </>
  )
}

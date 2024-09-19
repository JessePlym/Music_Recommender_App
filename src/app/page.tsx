"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Player from "./components/Player"
import { tracks } from "../../trackUris"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session } = useSession()
  const [playingTrack, setPlayingTrack] = useState<Track[]>(tracks)
  const router = useRouter()

  if (session === null) {
    router.push("/api/auth/signin")
  }
  if (!session?.accessToken) {
    return <main className="flex flex-col justify-center items-center mt-20">Loading...</main>
  }

  return (
    <>
    {
      session !== null &&
        <main className="h-full mx-10 grid grid-rows-[7fr,1fr] gap-2">
          <section className="relative bg-slate-950 mt-5 z-20 shadow-xl border border-white/80 p-2 grid grid-cols-[2fr,5fr]">
            <article className="flex flex-col gap-2 p-2">Recently Played Songs
            <ul className="text-2xl">
                <li>Song 1</li>
                <li>Song 2</li>
                <li>Song 3</li>
              </ul>
            </article>
            <article className="border-l border-white p-2 flex flex-col justify-start items-center gap-2">
              <h2>Song Suggestions</h2>
              <ul className="text-2xl">
                <li>Song 1</li>
                <li>Song 2</li>
                <li>Song 3</li>
              </ul>
            </article>
          </section>
          <section className="relative bg-slate-950 z-20 shadow-xl border border-white/80 p-2 flex justify-center">
            { session?.accessToken && <Player accessToken={session?.accessToken} trackUri={playingTrack[0].uri}/>}
          </section>
        </main>
    }
    </>
  )
}

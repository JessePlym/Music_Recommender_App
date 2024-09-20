"use client"

import { useSession } from "next-auth/react"
import Player from "./components/Player"
import { tracks } from "../../trackUris"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getRecentTracks } from "@/lib/getRecentTracks"

export default function Home() {
  const { data: session, status } = useSession()
  const playingTracks: Track[] = tracks
  const [recentTracks, setRecentTracks] = useState<Partial<Track[]>>([])
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session?.expires_at) {
      const isTokenExpired = Date.now() > session.expires_at
      if (isTokenExpired) {
        router.push("/api/auth/signin")
      }
    }
  }, [session, status, router])

  useEffect(() => {
    const fetchRecentTracks = async () => {
      if (status === "authenticated" && session.accessToken) {
        const tracks: Track[] = await getRecentTracks(session.accessToken)
        setRecentTracks(tracks)
      }
    }
    fetchRecentTracks()
  }, [status, session?.accessToken])
  
  if (status === "loading") {
    return <main className="flex flex-col justify-center items-center mt-20">Loading...</main>
  }

  return (
    <>
      <main className="h-full mx-10 grid grid-rows-[7fr,1fr] gap-2">
          <section className="relative bg-slate-950 mt-5 z-20 shadow-xl border border-white/80 p-2 grid grid-cols-[2fr,5fr]">
            <article className="flex flex-col gap-2 p-2">Recently Played Songs
            <ul className="text-xl">
              { recentTracks.map(track => (
                <li key={track?.id}>{track?.name}</li>
              ))}
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
            { (status === "authenticated" && session.accessToken) ? <Player accessToken={session?.accessToken} trackUri={playingTracks[0].uri}/> : null}
          </section>
      </main>
    </>
  )
}

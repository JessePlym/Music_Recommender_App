"use client"

import { useSession } from "next-auth/react"
import Player from "./components/Player"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getRecentTracks } from "@/lib/getRecentTracks"
import Image from "next/image"

export default function Home() {
  const { data: session, status } = useSession()
  const [recentTracks, setRecentTracks] = useState<Partial<Track[]>>([])
  const [ playingTrack, setPlayingTrack ] = useState("")
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
        setPlayingTrack(tracks[0].uri)
      }
    }
    fetchRecentTracks()
  }, [status, session?.accessToken])

  const handlePlayingTrack = (uri: string) => {
    setPlayingTrack(uri)
  }
  
  if (status === "loading") {
    return <main className="flex flex-col justify-center items-center mt-20">Loading...</main>
  }

  return (
    <>
      <main className="h-full mx-10 grid grid-rows-[8fr,1fr] gap-2">
          <section className="relative bg-slate-950 mt-5 z-20 shadow-xl border border-white/80 p-2 grid grid-cols-[3fr,5fr]">
            <article className="flex flex-col gap-2 p-2">Recently Played Songs
            <ul className="text-xl flex-col flex gap-2">
              { recentTracks.map(track => (
                <li className="flex justify-start items-center gap-2" key={track?.id}>
                  <Image 
                    alt="album cover"
                    width={40}
                    height={40}
                    src={track?.album?.images[0].url ?? ""}
                  />
                  <div>
                    <button onClick={() => handlePlayingTrack(track?.uri ?? "")}><p className="hover:text-white/80">{track?.name}</p></button>
                    <p className="text-base">{track?.artist}</p>
                  </div>
                </li>
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
          <section className=" bg-slate-950 z-20 sticky bottom-0 shadow-xl border border-white/80 p-2 flex justify-center">
            { (status === "authenticated" && session.accessToken && recentTracks) ? 
                <Player accessToken={session?.accessToken} trackUri={playingTrack} recentTracks={recentTracks}/>
              : null
            }
          </section>
      </main>
    </>
  )
}

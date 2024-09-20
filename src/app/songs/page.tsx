"use client"

import { useSession } from 'next-auth/react'

async function getRecentTracks(accessToken: string) {
  if (accessToken) {
    const response = await fetch("http://localhost:3000/api/songs/recent", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    const items = await response.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topTracks: Track[] = items.map((item: any) => item.track.name)
    

    console.log(topTracks)
  } else {
    console.log("No token")
  }
  }

export default function Songs() {
  const { data: session } = useSession()

  const printTracks = async () => {
    if (session?.accessToken) {
      await getRecentTracks(session?.accessToken)
    }
  } 
    return (
      <>
        <button onClick={printTracks}>Test</button>
      </>
    )
  }

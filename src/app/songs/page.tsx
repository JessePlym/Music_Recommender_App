"use client"

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { HOSTNAME } from '../../../constants'

// This is a testing page
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
  const [data, setData] = useState<Track[]>([])
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${HOSTNAME}/api/home`, { method: "GET"})
      const result = await response.json()
      console.log(result)
    }
    fetchData()
  }, [])

  return <div>Mongo Data</div>
  }
